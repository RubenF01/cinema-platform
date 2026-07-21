import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your email.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export const signUpSchema = signInSchema
  .extend({
    password: z.string().min(1, "Enter a password."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export const updateEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Enter your new email.")
    .email("Enter a valid email address."),
  password: z.string().min(1, "Enter your current password."),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(1, "Enter a new password."),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type UpdateEmailFormValues = z.infer<typeof updateEmailSchema>;
export type UpdatePasswordFormValues = z.infer<typeof updatePasswordSchema>;
