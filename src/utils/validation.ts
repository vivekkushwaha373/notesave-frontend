import { z } from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
})

export const signInSchema = z.object({
    email: z.string().trim().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
})

export const otpSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
})

export const noteSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    content: z.string().min(1, 'Content is required'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>
export type OtpFormData = z.infer<typeof otpSchema>
export type NoteFormData = z.infer<typeof noteSchema>