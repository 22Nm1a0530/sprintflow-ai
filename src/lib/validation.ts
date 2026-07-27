import { z } from "zod";

const strictEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

const commonEmailDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "protonmail.com",
  "live.com",
  "aol.com",
];

// Common fake/typo TLDs to reject
const fakeTLDs = ["coms", "comss", "orgg", "nett", "infoo", "coom", "gmai", "yahooo"];

function isKnownEmailProvider(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  
  // Reject if domain ends with a fake TLD
  for (const fakeTLD of fakeTLDs) {
    if (domain?.endsWith("." + fakeTLD)) {
      return false;
    }
  }
  
  return commonEmailDomains.includes(domain);
}

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .regex(strictEmailRegex, "Enter a valid email address")
    .refine(isKnownEmailProvider, "Please use a real email provider (Gmail, Yahoo, Outlook, etc.) — check for typos like .coms"),
  password: z.string().min(6, "Password must be at least 6 characters"),
role: z.enum(["project_manager", "developer"]),});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;