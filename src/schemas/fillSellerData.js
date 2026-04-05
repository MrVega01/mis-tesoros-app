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
    .regex(/^\+?[0-9\s\-().]{7,}$/, t('fillSellerData.validation.contactNumberInvalid'))
})
