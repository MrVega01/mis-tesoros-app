import { z } from 'zod'

export const createFillCustomerDataSchema = (t) => z.object({
  firstName: z.string().min(1, t('fillCustomerData.validation.firstNameRequired')),
  lastName: z.string().min(1, t('fillCustomerData.validation.lastNameRequired')),
  contactNumber: z
    .string()
    .min(1, t('fillCustomerData.validation.contactNumberRequired'))
    .regex(/^\+[1-9]\d{0,3}\s?\d{6,14}$/, t('fillCustomerData.validation.contactNumberInvalid'))
})
