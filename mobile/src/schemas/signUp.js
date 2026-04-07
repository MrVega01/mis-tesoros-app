import { z } from 'zod'

export const createSignUpSchema = (t) => z.object({
  email: z
    .email(t('login.validation.emailInvalid')),
  password: z
    .string()
    .min(8, t('login.validation.passwordMin'))
})
