"use server"

import { Resend } from 'resend';
import ContactFormEmail from '@/components/EmailTemplate';
import { ContactFormSchema } from '../schemas';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);
const mail = process.env.RESEND_MAIL_ADDRESS!

type ContactFormInputs = z.infer<typeof ContactFormSchema>
export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data)
  if (result.success) {
    const { name, email, message, subject } = result.data
    try {
      const data = await resend.emails.send({
        from: mail,
        to: [email],
        subject: subject,
        text: message,
        react: ContactFormEmail({ name, email, message })
      })
      return { success: true, data }
    } catch (error) {
      return { success: false, error }
    }
  }

  if (result.error) {
    return { success: false, error: result.error.format() }
  }
}
