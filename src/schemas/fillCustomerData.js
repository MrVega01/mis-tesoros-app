import { z } from 'zod'

export const createFillCustomerDataSchema = (t) => z.object({
  firstName: z.string().min(1, t('fillCustomerData.validation.firstNameRequired')),
  lastName: z.string().min(1, t('fillCustomerData.validation.lastNameRequired')),
  contactNumber: z
    .string()
    .min(1, t('fillCustomerData.validation.contactNumberRequired'))
    .regex(/^\+?[0-9\s\-().]{7,}$/, t('fillCustomerData.validation.contactNumberInvalid'))
})
