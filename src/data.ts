// import { CommitteeMember } from "./app/organisingCommittee/page";
// import { SpeakerType } from "./app/speaker/page";
import { Plan } from "./lib/interface";

export interface CommitteeMember {
  name: string;
  designation: string;
  affiliation?: string;
  image: string;
  contact?: string;
}

export interface SpeakerType {
  name: string;
  designation: string;
  institution: string;
  role: string;
  isConfirmed: boolean;
  imageUrl: string;
}

export const schedule = {
  day1: [
    {
      time: "09:00 AM",
      event: "Registrations of Delegates and Guests",
      venue: "Registration Counters",
      speakers: [],
    },
    {
      time: "10:00 AM",
      event: "Inauguration",
      venue: "Auditorium",
      speakers: [],
    },
    {
      time: "10:45 AM",
      event: "Keynote Session 01",
      venue: "Auditorium",
      speakers: ["Dr. B. Suresh (Pro Chancellor, JSS AHER, Mysuru)"],
    },
    {
      time: "11:30 AM",
      event: "Tea Break",
      venue: "",
      speakers: [],
    },
    {
      time: "11:45 AM",
      event: "Keynote Session 02",
      venue: "Auditorium",
      speakers: ["Dr. R. Raghu (CEO, Molecular Solutions Software Pvt. Ltd.)"],
    },
    {
      time: "12:30 PM",
      event: "Keynote Session 03",
      venue: "Auditorium",
      speakers: [
        "Dr. Nirmal Robinson (Head, Centre for Cancer Biology, University of South Australia)",
      ],
    },
    {
      time: "12:30 PM",
      event: "Plenary Session 01",
      venue: "Seminar Hall",
      speakers: ["Mr. C. S. Mujeebuddin (CEO, Clinosol Research Pvt. Ltd)"],
    },
    {
      time: "1:15 PM",
      event: "Network cum Lunch Break",
      venue: "Food Court",
      speakers: [],
    },
    {
      time: "2:00 PM",
      event: "Keynote Session 04",
      venue: "Auditorium",
      speakers: [
        "Dr. Sneha Ambwani (Professor & Head, Pharmacology, AIIMS Jodhpur)",
      ],
    },
    {
      time: "2:40 PM",
      event: "Keynote Session 05",
      venue: "Auditorium",
      speakers: ["Dr. Rajpal Singh Kashyap (Director - Research, CIIMS)"],
    },
    {
      time: "3:20 PM",
      event: "Networking cum High Tea",
      venue: "",
      speakers: [],
    },
    {
      time: "3:35 PM",
      event: "Plenary Session 01 (Continued)",
      venue: "Auditorium",
      speakers: [
        "Dr. Sunil Bothara (Professor, Govt. Pharmacy College, Ch Sambhajinagar)",
        "Dr. Shoban Babu (Associate Professor, AIIMS Jodhpur)",
        "Dr. Shital Panchal (Associate Professor, Nirma University, Ahmedabad)",
      ],
    },
    {
      time: "3:00 PM - 5:30 PM",
      event: "E-Poster/Oral Presentation Session (Parallel Tracks)",
      venue: "Halls 3, 4, 5, 6, 7 & 8",
      speakers: [],
      subEvents: [
        {
          track: "Track A",
          sessions: [
            {
              time: "2:00 PM",
              event: "Plenary Session 02",
              venue: "Seminar Hall",
              speakers: [
                "Dr. Shital Butani (Associate Professor, Nirma University)",
              ],
            },
            {
              time: "2:40 PM",
              event: "Plenary Session 03",
              venue: "Seminar Hall",
              speakers: ["Dr. Rahul Shukla (Assistant Professor, NIPER-R)"],
            },
            {
              time: "3:35 PM",
              event: "Plenary Session 04",
              venue: "Seminar Hall",
              speakers: ["Dr. Keerti Jain (Assistant Professor, NIPER-R)"],
            },
          ],
        },
      ],
    },
  ],
  day2: [
    {
      time: "10:00 AM",
      event: "Keynote Session 06",
      venue: "Auditorium",
      speakers: [
        "Dr. Rajesh Ramasamy (Associate Professor, Universiti Putra Malaysia)",
      ],
    },
    {
      time: "10:40 AM",
      event: "Keynote Session 07 (Virtual)",
      venue: "Auditorium",
      speakers: ["Dr. Brett Simmonds (Chair, FIP Regulators Advisory Group)"],
    },
    {
      time: "11:15 AM",
      event: "Tea Break",
      venue: "",
      speakers: [],
    },
    {
      time: "11:30 AM",
      event: "Keynote Session 08",
      venue: "Auditorium",
      speakers: [
        "Dr. Suresh Mohankumar (Associate Professor, Swansea University, UK)",
      ],
    },
    {
      time: "11:15 AM - 1:00 PM",
      event: "E-Poster/Oral Presentation Session (Parallel Tracks)",
      venue: "Halls 3, 4, 5, 6, 7 & 8",
      speakers: [],
    },
    {
      time: "12:15 PM",
      event: "Plenary Session 05",
      venue: "Auditorium",
      speakers: ["Dr. Sameer Agarwal (EVP, Molecule AI)"],
    },
    {
      time: "1:15 PM",
      event: "Lunch Break",
      venue: "Food Court",
      speakers: [],
    },
    {
      time: "2:00 PM",
      event: "Plenary Session 06",
      venue: "Auditorium",
      speakers: ["Dr. D. Guru Kumar (JSSAHER, Mysuru)"],
    },
    {
      time: "2:40 PM",
      event: "Plenary Session 07",
      venue: "Auditorium",
      speakers: ["Mr. S. Rajalingam (Data Scientist, HCL, Chennai)"],
    },
    {
      time: "3:20 PM",
      event: "Plenary Session 08",
      venue: "Auditorium",
      speakers: ["Dr. Prabhakar Reddy Veerareddy (Palamuru University)"],
    },
    {
      time: "3:45 PM",
      event: "Tea Break",
      venue: "",
      speakers: [],
    },
    {
      time: "4:00 PM",
      event: "Valedictory Function & Prize Distribution",
      venue: "Auditorium",
      speakers: [],
    },
  ],
};

export const committee: CommitteeMember[] = [
  {
    name: "Dr. Gopal Natesan",
    designation: "LOC Chairman",
    affiliation: "Pharmanecia 4.E",
    image: "/profile/gopal.jpeg",
  },
  {
    name: "Dr. S. P. Dhanabal",
    designation: "Convener",
    affiliation: "Principal, JSS College of Pharmacy, Ooty",
    image: "/profile/Dhanabal.png",
  },
  {
    name: "Dr. R. Kalirajan",
    designation: "Organizing Secretary",
    affiliation:
      "HoD, Dept. of Pharmaceutical Chemistry, JSS College of Pharmacy, Ooty",
    contact: "Email: rkalirajan@jssuni.edu.in   Cell: 9994098087",
    image: "/profile/Kalirajan.jpg",
  },
  {
    name: "Mr. Basavalingadevaru",
    designation: "Administrative officer",
    affiliation: "JSS College of Pharmacy, Ooty",
    image: "/profile/Basavanna.jpeg",
  },
  {
    name: "Miss. Anjali Chouhan",
    designation: "Administrative Officer",
    affiliation: "Operant Pharmacy Federation",
    image: "/Anjali.jpeg",
  },
  {
    name: "Dr. S. Jubie",
    designation: "Chairman, Registration Committee",
    contact: "Cell: 9894618588",
    image: "/profile/Jubie.png",
  },
  {
    name: "Dr. B. Gowramma",
    designation: "Chairman, Scientific Committee (Presentations)",
    contact: "Cell: 9442111172",
    image: "/profile/Gowramma.png",
  },
  {
    name: "Dr. T. Durai Ananda Kumar",
    designation: "Chairman, Scientific Committee (Plenary sessions)",
    contact: "Cell: 9866852707",
    image: "/profile/Durai.png",
  },
  {
    name: "Dr. Gomathi Swaminathan",
    designation:
      "Chairman, Stage Committee (Inauguration & Valedictory Function)",
    contact: "Cell: 9790095279",
    image:
      "https://jssaherstoragenew.blob.core.windows.net/jssuudstorage/EmployeeData/E1309/EMP_1309_P_7697DDDE02.jpg",
  },
  {
    name: "Dr. Srikanth Jupudi",
    designation: "Chairman, Accommodation / Transport Committee",
    contact: "Cell: 9393011114",
    image:
      "https://jssaherstoragenew.blob.core.windows.net/jssuudstorage/EmployeeData/E1308/EMP_1308_P_768BF89FAA.jpg",
  },
  {
    name: "Dr. Gomathy Shanish",
    designation: "Chairman, Hospitality / Catering Committee",
    contact: "Cell: 9486433876",
    image: "/profile/Gomathy.png",
  },
  {
    name: "Dr. Vijay A. Jagtap",
    designation: "Principal, Yashwantrao Bhonsale College of Pharmacy",
    image: "/profile/Vijay.jpeg",
  },
  {
    name: "Dr. Wu Yuan Seng",
    designation:
      "Sunway Microbiome Centre, School of Medical and Life Sciences, Sunway University, Selangor 47500, Malaysia Department of Biological Sciences, School of Medical and Life Sciences, Sunway University, Selangor 47500, Malaysia",
    image: "/profile/Wu.jpg",
  },
];

export const subjectOptions = [
  { value: "pharmaceuticalTechnology", label: "Pharmaceutical Technology" },
  { value: "medChem", label: "Pharmaceutical / Medicinal Chemistry" },

  {
    value: "pharmacognosy",
    label:
      "Pharmacognosy, Indigenous Drugs, Herbal Formulations, and Phytochemistry",
  },
  {
    value: "pharmacologyToxicology",
    label: "Pharmacology and Toxicology, Clinical Research & Pharmacovigilance",
  },
  {
    value: "pharmaceuticalAnalysis",
    label: "Pharmaceutical Analysis and Quality Assurance",
  },
  {
    value: "biopharmaceutics",
    label: "Biopharmaceutics, Pharmacokinetics & Drug Metabolism",
  },
  { value: "biotechnology", label: "Biotechnology and Biotherapeutics" },
  {
    value: "clinicalPharmacy",
    label: "Hospital, Community, and Clinical Pharmacy",
  },
  {
    value: "pharmaceuticalEducation",
    label: "Pharmaceutical Education and Professional Pharmacy",
  },
  {
    value: "drugRegulatoryAffairs",
    label: "Drug Regulatory Affairs & Pharmaceutical Management",
  },
  {
    value: "pharmacoeconomics",
    label: "Pharmacoeconomics and Pharmacoepidemiology",
  },
  {
    value: "aiBioinformatics",
    label: "Artificial Intelligence / Bioinformatics / Data Analytics",
  },
];

export const designationOptions = [
  { value: "UG", label: "Undergraduate Student(UG)" },
  { value: "PG", label: "Postgraduate Student(PG)" },

  {
    value: "RC",
    label: "Research Scholer/PhD Scholar",
  },
  {
    value: "FD",
    label: "Faculty",
  },
];

export const plans: Plan[] = [
  {
    name: "UG or PharmD Student",
    description: "Includes entry to all sessions and conference kit.",
    spot: 1500,
    currency: "INR",
  },
  {
    name: "PG or PhD Student",
    description: "Includes entry to all sessions and conference kit.",
    spot: 2500,
    currency: "INR",
  },
  {
    name: "Academicians",
    description: "Includes entry to all sessions, conference kit, and lunch.",
    spot: 3000,
    currency: "INR",
  },
  {
    name: "Industrial Persons",
    description: "Includes entry to all sessions, conference kit, and lunch.",
    spot: 4000,
    currency: "INR",
  },
  {
    name: "Foreign Delegates",
    description: "Includes entry to all sessions, conference kit, and lunch.",
    spot: 200,
    currency: "USD",
  },
  {
    name: "Foreign Presenter (Online)",
    description: "Includes online presentation slot.",
    spot: 100,
    currency: "USD",
  },
  {
    name: "Accompanying Person (Indian)",
    description: "Access Food Area and lunch, No Entry for scientific session",
    spot: 1800,
    currency: "INR",
  },
  {
    name: "Accompanying Person (Foreign)",
    description: "Access Food Area and lunch, No Entry for scientific session",
    spot: 50,
    currency: "USD",
  },
];

export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// data.ts

export interface Article {
  id: string;
  title: string;
  slug: string;
  date: string;
  author: string;
  authorRole: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  tags: string[];
  metaDescription: string;
  keywords: string[];
}

export const articles: Article[] = [
  {
    id: "1",
    title:
      "Pioneering the Future of Drug Discovery: AI and Machine Learning Take Center Stage at International Conference",
    slug: "ai-ml-drug-discovery-conference",
    date: "2024-08-07",
    author: "Dr. Ananya Singh",
    authorRole: "Conference Chair, Professor of Pharmaceutical Chemistry",
    excerpt:
      "JSS College of Pharmacy, Ooty, announces a groundbreaking international conference on AI and machine learning in drug discovery, set to redefine the landscape of pharmaceutical research.",
    content: `The Department of Pharmaceutical Chemistry at JSS College of Pharmacy, Ooty, in collaboration with the Operant Pharmacy Federation, is proud to announce the International Research Conference on "Recent Advances in Artificial Intelligence and Machine Learning Driven Drug Discovery." This prestigious event will take place on March 7th and 8th, 2025, bringing together top minds in AI, machine learning, and pharmaceutical sciences.

As the pharmaceutical industry continues to evolve, the integration of AI and machine learning in drug discovery has emerged as a game-changer. This conference aims to highlight the transformative potential of these technologies in accelerating drug development, enhancing precision medicine, and improving patient outcomes. Attendees will have the opportunity to engage with leading researchers, data scientists, and industry experts, exchanging insights and fostering collaborations that could shape the future of healthcare.

Key topics to be covered include:
1. Machine learning algorithms for predicting drug-target interactions
2. AI-driven high-throughput screening methodologies
3. Deep learning approaches in de novo drug design
4. Natural language processing for mining biomedical literature
5. Ethical considerations in AI-assisted drug discovery

This conference is not only a platform for knowledge sharing but also a hub for innovation, where cutting-edge research meets real-world applications. Keynote speakers include Nobel laureate Dr. Elizabeth Chen, renowned for her work in computational biology, and Dr. Michael Patel, Chief AI Officer at PharmaTech Innovations.

Don't miss the chance to be part of this landmark event that could redefine the landscape of drug discovery. Early bird registration is now open, with special rates for students and early career researchers. For more information and registration details, visit our conference website at www.aimldrugdiscovery2025.com.`,
    imageUrl: "/ai-drug-discovery.jpg",
    tags: [
      "AI",
      "Machine Learning",
      "Drug Discovery",
      "Pharmaceutical Research",
      "Conference",
    ],
    metaDescription:
      "Join the International Research Conference on AI and Machine Learning Driven Drug Discovery at JSS College of Pharmacy, Ooty. Explore cutting-edge advancements in pharmaceutical research.",
    keywords: [
      "AI in drug discovery",
      "machine learning pharmaceutical research",
      "computational drug design",
      "pharmaceutical AI conference",
      "JSS College of Pharmacy",
    ],
  },
  {
    id: "2",
    title:
      "Revolutionizing Drug Development: How AI is Accelerating the Path from Lab to Patient",
    slug: "ai-accelerating-drug-development",
    date: "2024-08-01",
    author: "Dr. Rahul Gupta",
    authorRole: "Senior Researcher, Institute for AI in Healthcare",
    excerpt:
      "Artificial Intelligence is dramatically reducing the time and cost of drug development. This article explores the latest breakthroughs and their potential impact on global health.",
    content: `In recent years, the integration of Artificial Intelligence (AI) into drug development processes has led to unprecedented advancements in the pharmaceutical industry. This article delves into how AI is revolutionizing the journey of drugs from laboratory conception to patient administration, potentially saving years of development time and billions in costs.

Traditional drug development is a lengthy and expensive process, often taking over a decade and costing upwards of $2 billion to bring a single drug to market. However, AI-driven approaches are dramatically altering this landscape. By leveraging machine learning algorithms and big data analytics, researchers can now:

1. Identify promising drug candidates faster: AI models can screen millions of compounds in silico, predicting their efficacy and potential side effects with remarkable accuracy.

2. Optimize clinical trials: Machine learning algorithms can help design more effective clinical trials by identifying ideal patient populations and predicting potential outcomes.

3. Accelerate toxicity screening: AI-powered systems can predict a compound's toxicity much earlier in the development process, saving time and resources.

4. Repurpose existing drugs: By analyzing vast datasets of drug interactions and patient outcomes, AI can identify new uses for existing medications.

5. Personalize treatment plans: AI can analyze genetic data to predict how individual patients might respond to specific treatments, paving the way for precision medicine.

Case studies have shown the potential of these AI-driven approaches. For instance, the drug DSP-1181, an OCD treatment developed using AI, entered human clinical trials in just 12 months – a process that typically takes 4.5 years. Similarly, AI algorithms developed by DeepMind have demonstrated the ability to predict protein structures with unprecedented accuracy, a breakthrough that could accelerate drug discovery for a wide range of diseases.

However, challenges remain. Ensuring the ethical use of patient data, addressing potential biases in AI algorithms, and navigating regulatory frameworks are crucial considerations as we move forward. Despite these challenges, the potential of AI to transform drug development is immense, offering hope for faster, more cost-effective treatments for a wide range of diseases.

As we stand on the brink of this AI-driven revolution in drug development, it's clear that the future of healthcare will be shaped by our ability to harness these powerful technologies responsibly and effectively.`,
    imageUrl: "/ai-drug-development.jpg",
    tags: [
      "AI",
      "Drug Development",
      "Pharmaceutical Industry",
      "Clinical Trials",
      "Precision Medicine",
    ],
    metaDescription:
      "Explore how Artificial Intelligence is revolutionizing drug development, accelerating the process from lab to patient. Learn about breakthroughs in AI-driven pharmaceutical research.",
    keywords: [
      "AI in drug development",
      "machine learning clinical trials",
      "AI pharmaceutical industry",
      "precision medicine AI",
      "drug discovery artificial intelligence",
    ],
  },
  {
    id: "3",
    title:
      "Ethical Considerations in AI-Driven Drug Discovery: Balancing Innovation and Responsibility",
    slug: "ethics-ai-drug-discovery",
    date: "2024-07-15",
    author: "Dr. Priya Menon",
    authorRole: "Professor of Bioethics, Global Institute for AI Ethics",
    excerpt:
      "As AI reshapes drug discovery, ethical questions arise. This article examines the balance between rapid innovation and responsible development in AI-driven pharmaceutical research.",
    content: `The rapid integration of Artificial Intelligence (AI) into drug discovery processes has opened up exciting new possibilities for treating diseases and improving global health. However, this technological revolution also brings with it a host of ethical considerations that must be carefully addressed. This article explores the delicate balance between fostering innovation and ensuring responsible development in AI-driven pharmaceutical research.

Key ethical considerations in AI-driven drug discovery include:

1. Data Privacy and Consent: AI models require vast amounts of data to function effectively. How can we ensure that patient data used in these models is properly anonymized and that informed consent is obtained?

2. Algorithmic Bias: AI systems can inadvertently perpetuate or even amplify existing biases in healthcare. How can we design AI systems that are fair and equitable across diverse populations?

3. Transparency and Explainability: Many AI models, particularly deep learning systems, operate as "black boxes." How can we ensure that the decision-making processes of these AI systems are transparent and explainable to researchers, regulators, and patients?

4. Intellectual Property Rights: As AI systems become more autonomous in drug discovery, questions arise about who owns the intellectual property rights to AI-generated discoveries.

5. Human Oversight and Responsibility: While AI can accelerate many aspects of drug discovery, human oversight remains crucial. How do we strike the right balance between AI automation and human expertise?

6. Access and Equity: Will AI-driven drug discovery widen or narrow the gap in healthcare access between developed and developing countries?

7. Regulatory Challenges: How should regulatory frameworks evolve to keep pace with rapidly advancing AI technologies in drug discovery?

To address these ethical challenges, several approaches are being proposed and implemented:

1. Establishing interdisciplinary ethics boards that include AI experts, bioethicists, healthcare professionals, and patient advocates.

2. Developing robust guidelines for the ethical use of AI in drug discovery, such as those proposed by the World Health Organization.

3. Implementing "ethics by design" principles in AI systems, ensuring that ethical considerations are built into AI models from the ground up.

4. Promoting open-source AI models and datasets to increase transparency and collaborative scrutiny.

5. Investing in AI literacy programs for healthcare professionals, policymakers, and the public to foster informed discussions about the ethical implications of these technologies.

As we navigate this new frontier of AI-driven drug discovery, it's crucial to remember that ethical considerations should not be viewed as obstacles to innovation, but rather as guardrails that ensure our technological advancements truly benefit humanity. By proactively addressing these ethical challenges, we can harness the full potential of AI in drug discovery while upholding our responsibility to patients, society, and scientific integrity.

The future of AI in drug discovery is bright, but it must be guided by a strong ethical compass. Only by balancing innovation with responsibility can we ensure that the remarkable potential of AI translates into real-world benefits for patients worldwide.`,
    imageUrl: "/ethics-ai-drug-discovery.jpeg",
    tags: [
      "AI Ethics",
      "Drug Discovery",
      "Bioethics",
      "Healthcare AI",
      "Responsible Innovation",
    ],
    metaDescription:
      "Explore the ethical considerations in AI-driven drug discovery. Learn about balancing innovation with responsibility in pharmaceutical AI research.",
    keywords: [
      "AI ethics in drug discovery",
      "responsible AI pharmaceutical research",
      "bioethics artificial intelligence",
      "ethical considerations AI healthcare",
      "AI drug development ethics",
    ],
  },
  {
    id: "4",
    title:
      "AI and Machine Learning Revolutionize Drug Discovery: Join Us at the International Conference in Tamil Nadu",
    slug: "ai-machine-learning-drug-discovery-conference-tamil-nadu",
    date: "2024-10-01",
    author: "Dr. Priya Natarajan",
    authorRole: "Professor of Pharmaceutical Sciences",
    excerpt:
      "Discover the future of AI-driven drug discovery at the prestigious Pharmanecia 4.E conference in Tamil Nadu, India. March 7th-8th, 2025.",
    content: `The Pharmanecia 4.E International Research Conference, hosted by JSS College of Pharmacy, Ooty, Tamil Nadu, is set to redefine pharmaceutical research with its focus on AI and Machine Learning-driven drug discovery. Held on March 7th-8th, 2025, this event will bring together experts in artificial intelligence, machine learning, and pharmaceutical sciences from across India and around the world.

Tamil Nadu, a hub of pharmaceutical education and research, is the perfect backdrop for this groundbreaking event. Attendees will explore cutting-edge developments in AI and machine learning as applied to drug discovery and development. Topics will range from predictive algorithms to ethical issues surrounding AI-assisted drug design.

With India's booming pharmaceutical sector, this conference is poised to foster collaborations that could shape the future of healthcare. Whether you're a researcher, data scientist, or student, this conference is a must-attend for anyone interested in the intersection of AI and medicine.`,
    imageUrl: "/ai-drug-development_0.jpg",
    tags: [
      "AI",
      "Machine Learning",
      "Drug Discovery",
      "Pharmacy Conference",
      "Tamil Nadu",
      "India",
    ],
    metaDescription:
      "Explore AI and machine learning in drug discovery at Pharmanecia 4.E International Research Conference, Tamil Nadu, India. March 2025.",
    keywords: [
      "AI in drug discovery",
      "pharmaceutical research in Tamil Nadu",
      "India AI drug conference",
      "pharmacy conference Tamil Nadu",
      "JSS College of Pharmacy",
    ],
  },
  {
    id: "5",
    title:
      "Pharmanecia 4.E: India’s Leading AI and Machine Learning Drug Discovery Conference",
    slug: "pharmanecia-ai-ml-drug-conference-india",
    date: "2024-09-25",
    author: "Dr. Arun Kumar",
    authorRole: "Head of AI Research, PharmaTech Innovations",
    excerpt:
      "Join global experts at Pharmanecia 4.E in Ooty, Tamil Nadu for insights into AI and ML in drug discovery. Hosted by JSS College of Pharmacy, March 2025.",
    content: `Pharmanecia 4.E, India's premier conference on AI and Machine Learning-driven drug discovery, will take place at JSS College of Pharmacy, Ooty, Tamil Nadu on March 7th-8th, 2025. This international event will host leaders from both the pharmaceutical and tech industries, as well as top academic researchers.

India has become a hotbed of pharmaceutical research, and this conference underscores the nation’s commitment to integrating cutting-edge AI and ML technologies in drug discovery. Participants will dive into key themes like machine learning models for predicting drug interactions, AI-powered screening, and the ethical frameworks for AI in healthcare.

Tamil Nadu's rich academic and research culture further enhances the conference’s appeal. With a focus on fostering partnerships between Indian and global institutions, Pharmanecia 4.E aims to accelerate innovations that can transform drug discovery and medical treatments on a global scale.`,
    imageUrl: "/blog5.avif",
    tags: [
      "AI",
      "Machine Learning",
      "Drug Discovery",
      "Pharmaceutical Research",
      "India",
      "Tamil Nadu",
      "Research Conference",
    ],
    metaDescription:
      "Discover the latest AI and ML innovations in drug discovery at India's Pharmanecia 4.E conference, hosted by JSS College of Pharmacy, Tamil Nadu.",
    keywords: [
      "India AI conference",
      "drug discovery AI India",
      "Tamil Nadu AI drug discovery",
      "India pharmaceutical conference",
      "AI-driven drug research",
    ],
  },
  {
    id: "6",
    title:
      "Advancing Drug Discovery with AI: Highlights from Pharmanecia 4.E, Ooty, Tamil Nadu",
    slug: "advancing-drug-discovery-ai-conference-tamil-nadu",
    date: "2024-09-30",
    author: "Dr. Kavitha Menon",
    authorRole: "Associate Professor, Department of Pharmaceutical Chemistry",
    excerpt:
      "Pharmanecia 4.E, held at JSS College of Pharmacy in Ooty, Tamil Nadu, highlights how AI is transforming the pharmaceutical landscape.",
    content: `Artificial Intelligence and Machine Learning have the potential to revolutionize how drugs are discovered and developed, and nowhere is this more evident than at the Pharmanecia 4.E International Conference in Ooty, Tamil Nadu. Taking place on March 7th and 8th, 2025, this event will showcase groundbreaking research at the nexus of AI, ML, and pharmaceutical sciences.

This two-day conference will offer insights into AI's role in drug discovery, from predicting drug-target interactions to applying machine learning in lead optimization. Hosted by JSS College of Pharmacy, Ooty, and supported by the Operant Pharmacy Federation, the event is a vital forum for exploring the future of pharmaceutical research.

In addition to thought-provoking talks, the conference will feature a range of networking opportunities aimed at fostering collaboration between AI experts, data scientists, and pharmaceutical professionals. With selected research articles published in Scopus-indexed journals, this is a not-to-miss event for anyone in the pharmaceutical research community.`,
    imageUrl: "/What-is-Model-Informed-Drug-Development.webp",
    tags: [
      "AI",
      "Drug Discovery",
      "Machine Learning",
      "Pharmaceutical Research",
      "India",
      "Tamil Nadu",
      "Conference",
    ],
    metaDescription:
      "Attend the Pharmanecia 4.E International Research Conference on AI and ML in drug discovery, hosted in Ooty, Tamil Nadu, India.",
    keywords: [
      "AI drug discovery India",
      "conference Tamil Nadu",
      "pharma AI innovations",
      "AI and machine learning in drug research",
      "pharma research India",
    ],
  },
];

export const confSpeakers: SpeakerType[] = [
  {
    name: "Dr. B. Suresh",
    designation: "Pro Vice Chancellor",
    institution: "JSS AHER",
    role: "Keynote Speaker",
    isConfirmed: true,
    imageUrl: "/profile/chancellor.jpg",
  },
  {
    name: "Dr. Sneha Ambwani",
    designation: "Professor",
    institution: "AIIMS Jodhpur",
    role: "Keynote Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-sneha-ambwani.png",
  },
  {
    name: "Dr. Sameer Agarwal",
    designation: "Executive Vice President",
    institution: "Molecule AI",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-sameer-agarwal.png",
  },
  {
    name: "Dr. Sunil Bothara",
    designation: "Professor",
    institution: "Govt. Pharmacy College, Ch Sambhajinagar",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-sunil-bothara.png",
  },
  {
    name: "Dr. Rajesh Ramasamy",
    designation: "Associate Professor",
    institution: "Universiti Putra Malaysia",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-rajesh-ramasamy.png",
  },
  {
    name: "Dr. Keerti Jain",
    designation: "Assistant Professor",
    institution: "NIPER - R",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/Keerti-Jain.png",
  },
  {
    name: "Dr. Ravinder Kumar Kaundal",
    designation: "Head, Regulatory Toxicology",
    institution: "NIPER - R",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-ravinder-kaundal.png",
  },
  {
    name: "Dr. Rahul Shukla",
    designation: "Assistant Professor",
    institution: "NIPER - R",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-rahul-shukla.png",
  },
  {
    name: "Mr. S. Rajalingam",
    designation: "Data Scientist",
    institution: "HCL",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/mr-s-rajalingam.png",
  },
  {
    name: "Dr. Nirmal Robinson",
    designation: "Head",
    institution:
      "Cellular Stress and Immune Response Laboratory, Centre for Cancer Biology, University of South Australia Adelaide, Australia",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-nirmal-robinson.png",
  },
  {
    name: "Dr. Rajpal Singh Kashyap",
    designation: "Director, Research",
    institution: "Central India Institute of Medical Sciences (CIIMS)",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-rajpal-kashyap.png",
  },
  {
    name: "Dr. Shital Panchal",
    designation: "Associate Professor",
    institution: "Institute of Pharmacy, Nirma University, Ahmedabad",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-shital-panchal.png",
  },
  {
    name: "Dr. Shital Butani",
    designation: "Associate Professor",
    institution: "Institute of Pharmacy, Nirma University, Ahmedabad",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/Shital-Butani.png",
  },
  {
    name: "Dr. R. Raghu",
    designation: "CEO",
    institution: "Molecular Solutions Software Pvt. Ltd.",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-r-raghu.png",
  },
  {
    name: "Dr. Vivek Puri",
    designation: "Associate Professor",
    institution: "Chitkara University",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/vivek-puri.jpg",
  },
  {
    name: "Dr. Suresh Mohankumar",
    designation: "Associate Professor",
    institution: "Swansea University, UK",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-suresh-mohankumar.png",
  },
  {
    name: "Dr. Yuan Seng",
    designation: "Associate Professor",
    institution: "Sunway University, Malaysia",
    role: "Speaker",
    isConfirmed: true,
    imageUrl: "/speakers/dr-wu-yuan-seng.jpg",
  },
  {
    name: "Dr. MD Salahhudin",
    designation: "Principal",
    institution: "Al Ameen College of Pharmacy, Bangalore",
    role: "Chairperson",
    isConfirmed: true,
    imageUrl: "/speakers/dr-md-salahhudin.jpg",
  },
  {
    name: "Dr. Navin Dhingra",
    designation: "Registrar",
    institution: "Sage University, Bhopal",
    role: "Chairperson",
    isConfirmed: true,
    imageUrl: "/speakers/dr-navin-dhingra.jpg",
  },
  {
    name: "Dr. Jitendra Banweer",
    designation: "Dean",
    institution: "Faculty of Pharmacy, Sage University, Bhopal",
    role: "Chairperson",
    isConfirmed: true,
    imageUrl: "/speakers/dr-jitendra-banweer.jpg",
  },
  {
    name: "Dr. Radha Chafle",
    designation: "Group Registration - 20",
    institution: "Singhad IPS, Lonawala",
    role: "Evaluator - Poster",
    isConfirmed: false,
    imageUrl: "/speakers/dr-radha-chafle.jpg",
  },
  {
    name: "Dr. Tushar Rukari",
    designation: "Group Registration - 50",
    institution: "Yashwantrao Bhosale COP, Sawantwadi",
    role: "Evaluator - Poster",
    isConfirmed: false,
    imageUrl: "/speakers/dr-tushar.jpg",
  },
];
