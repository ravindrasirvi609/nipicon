/**
 * Script to send "ABSTRACT_CODE_UPDATE" emails to all accepted abstracts.
 * 
 * Usage:
 *   Dry-run: MONGO_URI="..." RESEND_API_KEY="..." npx tsx scripts/send-code-update-emails.ts --dry-run
 *   Execute: MONGO_URI="..." RESEND_API_KEY="..." npx tsx scripts/send-code-update-emails.ts
 */

import mongoose from "mongoose";
import { sendEmail } from "@/lib/mailer";
import AbstractModel from "@/Model/AbstractModel";

async function main() {
    const isDryRun = process.argv.includes("--dry-run");
    const mongoUri = process.env.MONGO_URI;
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!mongoUri) {
        console.error("❌ MONGO_URI environment variable is required");
        process.exit(1);
    }

    if (!isDryRun && !resendApiKey) {
        console.error("❌ RESEND_API_KEY environment variable is required for live execution");
        process.exit(1);
    }

    console.log(`\n🔗 Connecting to MongoDB...`);
    console.log(`📍 Mode: ${isDryRun ? "DRY-RUN (no emails sent)" : "LIVE EXECUTION (Sending emails)"}\n`);

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB\n");

    // Fetch accepted abstracts with valid presentation type
    const abstracts = await AbstractModel.find({
        Status: "Accepted",
        presentationType: { $in: ["Oral", "Poster"] },
        AbstractCode: { $exists: true, $ne: "" }
    }).sort({ createdAt: 1 });

    console.log(`📊 Found ${abstracts.length} abstracts to notify having Oral/Poster presentation type.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const abstract of abstracts) {
        const identifier = `${abstract.AbstractCode} (${abstract.name})`;

        if (isDryRun) {
            console.log(`[DryRun] Would send email to: ${abstract.email} for ${identifier}`);
            successCount++;
        } else {
            console.log(`Sending email to ${abstract.email} for ${identifier}...`);
            try {
                await sendEmail({
                    _id: abstract._id.toString(),
                    emailType: "ABSTRACT_CODE_UPDATE" as any, // Cast because scripts might not pick up local TS definition updates immediately
                });
                console.log(`✅ Sent successfully`);
                successCount++;

                // Add a small delay to be polite to the API
                await new Promise(resolve => setTimeout(resolve, 200));
            } catch (error) {
                console.error(`❌ Failed to send to ${identifier}:`, error);
                errorCount++;
            }
        }
    }

    console.log("\n" + "─".repeat(50));
    console.log(`Summary:`);
    console.log(`Total Processed: ${abstracts.length}`);
    console.log(`Successful: ${successCount}`);
    console.log(`Failed: ${errorCount}`);
    console.log("─".repeat(50) + "\n");

    await mongoose.disconnect();
}

main().catch(console.error);
