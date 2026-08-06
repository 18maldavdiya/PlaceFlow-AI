import { Job } from "../models/job.model.js";
import { logger } from "./logger.js";

/**
 * The Jobs Module (posting, editing, search) doesn't exist yet, so there's
 * no way to populate real listings through the product. The dashboard's
 * "Recommended Jobs" widget still needs to read real documents from
 * MongoDB rather than a hardcoded frontend array, so this seeds a handful
 * of realistic listings once, idempotently, at boot — never overwrites or
 * duplicates on subsequent restarts. Delete this once the Jobs Module can
 * create listings for real.
 */
const SEED_JOBS = [
  {
    company: "Nimbus Cloud Systems",
    role: "SDE Intern",
    location: "Bengaluru, India",
    salaryRange: "₹8–12 LPA",
    eligibility: "CGPA 7.0+, no active backlogs",
  },
  {
    company: "Fernbank Analytics",
    role: "Data Analyst",
    location: "Pune, India",
    salaryRange: "₹6–9 LPA",
    eligibility: "CGPA 6.5+, any branch",
  },
  {
    company: "Orbital Robotics",
    role: "Firmware Engineer",
    location: "Hyderabad, India",
    salaryRange: "₹10–14 LPA",
    eligibility: "CGPA 7.5+, ECE/EEE",
  },
  {
    company: "Vertex Financial Technologies",
    role: "Backend Engineer",
    location: "Remote",
    salaryRange: "₹12–18 LPA",
    eligibility: "CGPA 7.0+, CSE/IT",
  },
  {
    company: "Lattice Health Informatics",
    role: "Product Analyst",
    location: "Mumbai, India",
    salaryRange: "₹7–10 LPA",
    eligibility: "CGPA 6.5+, any branch",
  },
  {
    company: "Argon Semiconductor",
    role: "Embedded Systems Engineer",
    location: "Noida, India",
    salaryRange: "₹9–13 LPA",
    eligibility: "CGPA 7.0+, ECE",
  },
];

export async function seedJobsIfEmpty() {
  const existingCount = await Job.countDocuments();
  if (existingCount > 0) return;

  await Job.insertMany(SEED_JOBS);
  logger.info(`Seeded ${SEED_JOBS.length} sample jobs (Job collection was empty).`);
}

export default seedJobsIfEmpty;
