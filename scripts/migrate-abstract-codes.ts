/**
 * Migration Script: Update Abstract Codes to New Format (Global Sequence)
 * 
 * Old format: TRACK + SEQ (e.g., PA001, NA005, PIA003)
 * New format: TRACK + TYPE + SEQ (e.g., PAO001, NAP001, PIO002)
 * 
 * Logic:
 * - Group abstracts GLOBALLY by presentation type (Oral vs Poster)
 * - Assign continuous sequences for each type (001, 002, 003...) regardless of track
 * - Keep original track prefix (or map 3-char like PIA to 2-char PI)
 * - Sort by createdAt to ensure oldest gets lowest sequence
 * 
 * Usage:
 *   Dry-run: MONGO_URI="mongodb://..." npx tsx scripts/migrate-abstract-codes.ts --dry-run
 *   Execute: MONGO_URI="mongodb://..." npx tsx scripts/migrate-abstract-codes.ts
 */

import mongoose from "mongoose";

// Track code mapping (ensure 3-char codes map to 2-char)
const TRACK_CODES: Record<string, string> = {
    "PIA": "PI",
    "NIP": "NI",
    // 2-chars fallback to themselves in logic below
    "NA": "NA",
    "PC": "PC",
    "PA": "PA",
    "HN": "HN",
    "AI": "AI",
};

interface AbstractDoc {
    _id: mongoose.Types.ObjectId;
    email: string;
    name: string;
    subject: string;
    AbstractCode: string;
    presentationType: "Oral" | "Poster";
    isPharmaInnovatorAward: boolean;
    Status: string;
    createdAt: Date;
    updatedAt: Date;
}

async function migrateAbstractCodes(isDryRun: boolean) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("❌ MONGO_URI environment variable is required");
        process.exit(1);
    }

    console.log(`\n🔗 Connecting to MongoDB...`);
    console.log(`📍 Mode: ${isDryRun ? "DRY-RUN (no changes will be made)" : "LIVE EXECUTION"}\n`);

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    if (!db) {
        console.error("❌ Database connection not available");
        process.exit(1);
    }

    const collection = db.collection("abstracts");

    // Find all accepted abstracts with AbstractCode and presentationType
    const abstracts = await collection.find({
        Status: "Accepted",
        AbstractCode: { $exists: true, $ne: null, $ne: "" },
        presentationType: { $in: ["Oral", "Poster"] }
    }).sort({ createdAt: 1 }).toArray() as unknown as AbstractDoc[];

    console.log(`📊 Found ${abstracts.length} accepted abstracts to migrate\n`);

    if (abstracts.length === 0) {
        console.log("ℹ️  No abstracts to migrate. Exiting.");
        await mongoose.disconnect();
        return;
    }

    // Group abstracts by presentation type ONLY (Global sequencing for Oral vs Poster)
    const orals: AbstractDoc[] = [];
    const posters: AbstractDoc[] = [];

    for (const abstract of abstracts) {
        if (abstract.presentationType === "Oral") {
            orals.push(abstract);
        } else if (abstract.presentationType === "Poster") {
            posters.push(abstract);
        }
    }

    const updates: { id: mongoose.Types.ObjectId; oldCode: string; newCode: string; name: string }[] = [];

    // Helper to process a global group
    const processGroup = (groupAbstracts: AbstractDoc[], typeIndicator: "O" | "P") => {
        // Sort by createdAt to maintain order (Oldest -> 001)
        groupAbstracts.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());

        for (let i = 0; i < groupAbstracts.length; i++) {
            const abstract = groupAbstracts[i];

            // Extract current track code from existing AbstractCode
            let trackCode = extractTrackCode(abstract.AbstractCode);

            // Handle special case for Pharma Innovator Award
            if (abstract.isPharmaInnovatorAward) {
                trackCode = "PI";
            }

            // Convert 3-char codes to 2-char if needed
            if (TRACK_CODES[trackCode]) {
                trackCode = TRACK_CODES[trackCode];
            }

            // Global sequence across ALL tracks for this type
            const sequenceNumber = (i + 1).toString().padStart(3, "0");
            const newCode = `${trackCode}${typeIndicator}${sequenceNumber}`;

            updates.push({
                id: abstract._id,
                oldCode: abstract.AbstractCode,
                newCode: newCode,
                name: abstract.name
            });
        }
    };

    processGroup(orals, "O");
    processGroup(posters, "P");

    console.log("📋 Application of Global Sequencing:\n");
    console.log(`Oral Presentations:   ${orals.length.toString().padEnd(5)} (Sequences O001 -> O${orals.length.toString().padStart(3, '0')})`);
    console.log(`Poster Presentations: ${posters.length.toString().padEnd(5)} (Sequences P001 -> P${posters.length.toString().padStart(3, '0')})`);
    console.log("─".repeat(80));

    console.log(`\n📝 Total updates to apply: ${updates.length}\n`);

    // Show detailed changes
    console.log("📄 Detailed Changes (Global Sequence Check):\n");
    console.log("─".repeat(80));
    console.log(`${"#".padEnd(4)} | ${"Old Code".padEnd(10)} | ${"New Code".padEnd(10)} | Name`);
    console.log("─".repeat(80));

    updates.forEach((update, index) => {
        const truncatedName = update.name.length > 40 ? update.name.substring(0, 37) + "..." : update.name;
        console.log(`${(index + 1).toString().padEnd(4)} | ${update.oldCode.padEnd(10)} | ${update.newCode.padEnd(10)} | ${truncatedName}`);
    });

    console.log("─".repeat(80));

    if (isDryRun) {
        console.log("\n🔍 DRY-RUN COMPLETE - No changes were made to the database.");
        console.log("   Run without --dry-run flag to apply changes.\n");
    } else {
        console.log("\n⏳ Applying changes to database...\n");

        let successCount = 0;
        let errorCount = 0;

        for (const update of updates) {
            try {
                await collection.updateOne(
                    { _id: update.id },
                    { $set: { AbstractCode: update.newCode, updatedAt: new Date() } }
                );
                successCount++;
            } catch (error) {
                console.error(`❌ Failed to update ${update.oldCode}: ${error}`);
                errorCount++;
            }
        }

        console.log(`✅ Successfully updated: ${successCount} abstracts`);
        if (errorCount > 0) {
            console.log(`❌ Failed updates: ${errorCount} abstracts`);
        }
        console.log("\n🎉 Migration complete!\n");
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB\n");
}

function extractTrackCode(abstractCode: string): string {
    // Check for 3-letter codes first (like PIA)
    const threeLetterCodes = ["PIA", "NIP"];
    for (const code of threeLetterCodes) {
        if (abstractCode.startsWith(code)) {
            return code;
        }
    }

    // Otherwise return first 2 characters
    return abstractCode.substring(0, 2);
}

// Parse command line arguments
const isDryRun = process.argv.includes("--dry-run");

migrateAbstractCodes(isDryRun).catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
});
