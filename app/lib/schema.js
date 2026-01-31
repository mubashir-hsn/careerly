import { z } from "zod";

export const onboardingSchema = z.object({
  industry: z
    .string({ required_error: "Industry required" })
    .max(40, "Industry name too long, keep under 40 characters"),

  subIndustry: z
    .string({ required_error: "Specialization required" })
    .max(40, "Specialization too long, keep under 40 characters"),

  bio: z
    .string()
    .max(300, "Bio too long, write a short intro under 300 characters")
    .optional(),

  experience: z
    .string()
    .max(2, "Experience should be a number like 0 to 50")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .min(0, "Experience cannot be negative")
        .max(50, "Experience above 50 years is not allowed")
    ),

  skills: z
    .string()
    .max(250, "Skills too long, add only key skills")
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : undefined
    ),
});

export const contactSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email")
    .max(80, "Email too long"),

  mobile: z
    .string()
    .min(1, "Mobile number required")
    .max(20, "Mobile number too long"),

  profession: z
    .string()
    .max(40, "Profession name too long")
    .optional(),

  linkedin: z
    .string()
    .max(50, "LinkedIn link too long")
    .optional(),

  twitter: z
    .string()
    .max(50, "Twitter link too long")
    .optional(),

  portfolio: z
    .string()
    .max(50, "Portfolio link too long")
    .optional(),
});

export const entrySchema = z
  .object({
    title: z
      .string()
      .min(1, "Title required")
      .max(60, "Title too long"),

    organization: z
      .string()
      .min(1, "Organization required")
      .max(60, "Organization name too long"),

    startDate: z
      .string()
      .min(1, "Start date required")
      .max(15, "Invalid date format"),

    endDate: z.string().max(15).optional().or(z.literal("")),

    liveLink: z
      .string()
      .url("Invalid live link")
      .max(50, "Live link too long")
      .optional()
      .or(z.literal("")),

    githubLink: z
      .string()
      .url("Invalid GitHub link")
      .max(50, "GitHub link too long")
      .optional()
      .or(z.literal("")),

    description: z
      .string()
      .min(1, "Description required")
      .max(250, "Description too long, keep it short"),

    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) return false;
      return true;
    },
    {
      message: "End date required if this is not current",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (!data.current && data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be after start date",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  contactInfo: contactSchema,

  summary: z
    .string()
    .min(1, "Summary required")
    .max(400, "Summary too long, write briefly"),

  skills: z
    .string()
    .min(1, "Skills required")
    .max(200, "Skills too long"),

  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});

export const coverLetterSchema = z.object({
  name: z
    .string()
    .min(1, "Name required")
    .max(40, "Name too long"),

  email: z
    .string()
    .email("Invalid email")
    .max(80),

  contact: z
    .string()
    .max(20, "Contact info too long")
    .optional(),

  companyName: z
    .string()
    .min(1, "Company name required")
    .max(50, "Company name too long"),

  jobTitle: z
    .string()
    .min(1, "Job title required")
    .max(40, "Job title too long"),

  jobDescription: z
    .string()
    .min(1, "Job description required")
    .max(500, "Job description too long, keep only key points (max 500 characters)."),

  content: z
    .string()
    .max(2000, "Cover letter content too long")
    .optional(),
});

export const resumeAnalysisSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name required")
    .max(40, "Company name too long"),

  jobTitle: z
    .string()
    .min(1, "Job title required")
    .max(30, "Job title too long"),

  jobDescription: z
    .string()
    .min(1, "Job description required")
    .max(600, "Job description too long (max 600 characters)"),
});
