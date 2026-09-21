import { z } from "zod";



export const loginSchema = z.object({
    email: z.string().email("Enter a vaild email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    rememberMe: z.boolean().default(false),
});



export const registerSchema = z.object({
    firstName: z.string().min(2 , "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Enter a vaild email"),
    phone: z.string().regex(/^[+\d][\d\s-]{7,}$/ , "Enter a valid phone number").optional(),
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/ , "Must contain an uppercase letter").regex(/[0-9]/,"Must contain a number"),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true , {
        error:"You must accept the terms and conditions"
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});




export const forgotPasswordSchema = z.object({
    email: z.string().email("Enter a vaild email"),
})



export const resetPasswordSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters").regex(/[A-Z]/, "Must contain an uppercase letter").regex(/[0-9]/,"Must contain a number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});



export const verifyEmailSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits"),
});