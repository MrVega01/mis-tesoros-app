import { z } from 'zod'

export const createResetPasswordSchema = (t) => z
  .object({
    password: z
      .string()
      .min(1, t('resetPassword.validation.passwordRequired'))
      .min(8, t('resetPassword.validation.passwordMin')),
    confirmPassword: z
      .string()
      .min(1, t('resetPassword.validation.confirmPasswordRequired'))
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t('resetPassword.validation.passwordsMustMatch'),
    path: ['confirmPassword']
  })
