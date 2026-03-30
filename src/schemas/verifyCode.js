import { z } from 'zod'

export const createVerifyCodeSchema = (t) => z.object({
  code: z
    .string()
    .length(6, t('verifyCode.validation.codeLength'))
})
