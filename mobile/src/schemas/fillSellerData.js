import { z } from 'zod'

export const createFillSellerDataSchema = (t) => z.object({
  companyName: z.string().min(1, t('fillSellerData.validation.companyNameRequired')),
  sellerName: z.string().min(1, t('fillSellerData.validation.sellerNameRequired')),
  sellerLastName: z.string().min(1, t('fillSellerData.validation.sellerLastNameRequired')),
  companyType: z.string().min(1, t('fillSellerData.validation.companyTypeRequired')),
  companyDescription: z.string().optional(),
  address: z.string().optional(),
  hoursOfOperation: z.nullable(
    z.object({
      monday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) }),
      tuesday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) }),
      wednesday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) }),
      thursday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) }),
      friday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) }),
      saturday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) }),
      sunday: z.object({ start: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/), end: z.string().regex(/^\d{2}:\d{2}:\d{2}Z?$/) })
    }).partial()
  ).optional(),
  contactNumber: z
    .string()
    .min(1, t('fillSellerData.validation.contactNumberRequired'))
    .regex(/^\+[1-9]\d{0,3}\s?\d{6,14}$/, t('fillSellerData.validation.contactNumberInvalid'))
})
