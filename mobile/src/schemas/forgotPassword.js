import { z } from 'zod'

export const createForgotPasswordSchema = (t) => z.object({
  email: z
    .email(t('forgotPassword.validation.emailInvalid'))
})
