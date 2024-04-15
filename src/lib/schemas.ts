import { z } from "zod";

export const ContactFormSchema = z.object({
  name: z.string({ required_error: 'Name is required.' }),
  email: z.string({ required_error: 'Email is required.' }).email('Invalid email.'),
  subject: z.string({required_error: "Subject is required"}),
  message: z
    .string({ required_error: "Message is required" })
    .min(6, { message: 'Message must be at least 6 characters.' })
})
