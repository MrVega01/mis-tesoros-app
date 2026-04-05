import { z } from 'zod'

export const createFillSellerDataSchema = (t) => z.object({
  companyName: z.string().min(1, t('fillSellerData.validation.companyNameRequired')),
  sellerName: z.string().min(1, t('fillSellerData.validation.sellerNameRequired')),
  companyType: z.string().min(1, t('fillSellerData.validation.companyTypeRequired')),
  companyDescription: z.string().optional(),
  address: z.string().optional(),
  hoursOfOperation: z.string().optional(),
  contactNumber: z
    .string()
    .min(1, t('fillSellerData.validation.contactNumberRequired'))
    .regex(/^\+[1-9]\d{0,3}\s?\d{6,14}$/, t('fillSellerData.validation.contactNumberInvalid'))
})
