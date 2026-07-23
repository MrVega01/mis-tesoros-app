import { UserRole, VerificationCodeType } from '@mis-tesoros/contract'

export const API_URL = process.env.EXPO_PUBLIC_API_URL

export const ONBOARDING_SEEN_KEY = 'onboarding.seen'

export const TAX_KEY = 'tax'

// Re-exported from the shared contract so the API and mobile agree on one set
// of role / verification-code values. See packages/contract.
export const USER_ROLE = UserRole

export const RESEND_CODE_TYPE = VerificationCodeType

export const AUTH_ERROR_KEYS = {
  login: { 401: 'login.errors.invalidCredentials', 403: 'login.errors.emailUnverified' },
  signUp: { 409: 'signUp.errors.emailTaken' },
  verifySeller: { 400: 'codeSent.errors.invalidCode' },
  verifyCode: { 400: 'verifyCode.errors.invalidCode' },
  resetPassword: { 400: 'resetPassword.errors.tokenExpired' },
  fillCustomerData: {},
  fillSellerData: {}
}

export const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const COUNTRY_CODES = [
  // North America
  { iso: 'US', flag: '🇺🇸', name: 'United States', dialCode: '1' },
  { iso: 'CA', flag: '🇨🇦', name: 'Canada', dialCode: '1' },
  { iso: 'MX', flag: '🇲🇽', name: 'México', dialCode: '52' },
  // Central America
  { iso: 'GT', flag: '🇬🇹', name: 'Guatemala', dialCode: '502' },
  { iso: 'BZ', flag: '🇧🇿', name: 'Belize', dialCode: '501' },
  { iso: 'HN', flag: '🇭🇳', name: 'Honduras', dialCode: '504' },
  { iso: 'SV', flag: '🇸🇻', name: 'El Salvador', dialCode: '503' },
  { iso: 'NI', flag: '🇳🇮', name: 'Nicaragua', dialCode: '505' },
  { iso: 'CR', flag: '🇨🇷', name: 'Costa Rica', dialCode: '506' },
  { iso: 'PA', flag: '🇵🇦', name: 'Panamá', dialCode: '507' },
  // Caribbean
  { iso: 'CU', flag: '🇨🇺', name: 'Cuba', dialCode: '53' },
  { iso: 'JM', flag: '🇯🇲', name: 'Jamaica', dialCode: '1876' },
  { iso: 'HT', flag: '🇭🇹', name: 'Haiti', dialCode: '509' },
  { iso: 'DO', flag: '🇩🇴', name: 'República Dominicana', dialCode: '1809' },
  { iso: 'PR', flag: '🇵🇷', name: 'Puerto Rico', dialCode: '1787' },
  { iso: 'TT', flag: '🇹🇹', name: 'Trinidad y Tobago', dialCode: '1868' },
  { iso: 'BB', flag: '🇧🇧', name: 'Barbados', dialCode: '1246' },
  { iso: 'BS', flag: '🇧🇸', name: 'Bahamas', dialCode: '1242' },
  // South America
  { iso: 'CO', flag: '🇨🇴', name: 'Colombia', dialCode: '57' },
  { iso: 'VE', flag: '🇻🇪', name: 'Venezuela', dialCode: '58' },
  { iso: 'EC', flag: '🇪🇨', name: 'Ecuador', dialCode: '593' },
  { iso: 'PE', flag: '🇵🇪', name: 'Perú', dialCode: '51' },
  { iso: 'BO', flag: '🇧🇴', name: 'Bolivia', dialCode: '591' },
  { iso: 'BR', flag: '🇧🇷', name: 'Brasil', dialCode: '55' },
  { iso: 'PY', flag: '🇵🇾', name: 'Paraguay', dialCode: '595' },
  { iso: 'UY', flag: '🇺🇾', name: 'Uruguay', dialCode: '598' },
  { iso: 'AR', flag: '🇦🇷', name: 'Argentina', dialCode: '54' },
  { iso: 'CL', flag: '🇨🇱', name: 'Chile', dialCode: '56' },
  { iso: 'GY', flag: '🇬🇾', name: 'Guyana', dialCode: '592' },
  { iso: 'SR', flag: '🇸🇷', name: 'Surinam', dialCode: '597' },
  // Western Europe
  { iso: 'GB', flag: '🇬🇧', name: 'United Kingdom', dialCode: '44' },
  { iso: 'IE', flag: '🇮🇪', name: 'Ireland', dialCode: '353' },
  { iso: 'FR', flag: '🇫🇷', name: 'France', dialCode: '33' },
  { iso: 'BE', flag: '🇧🇪', name: 'Belgium', dialCode: '32' },
  { iso: 'NL', flag: '🇳🇱', name: 'Netherlands', dialCode: '31' },
  { iso: 'LU', flag: '🇱🇺', name: 'Luxembourg', dialCode: '352' },
  { iso: 'MC', flag: '🇲🇨', name: 'Monaco', dialCode: '377' },
  // Southern Europe
  { iso: 'ES', flag: '🇪🇸', name: 'España', dialCode: '34' },
  { iso: 'PT', flag: '🇵🇹', name: 'Portugal', dialCode: '351' },
  { iso: 'IT', flag: '🇮🇹', name: 'Italy', dialCode: '39' },
  { iso: 'GR', flag: '🇬🇷', name: 'Greece', dialCode: '30' },
  { iso: 'MT', flag: '🇲🇹', name: 'Malta', dialCode: '356' },
  { iso: 'CY', flag: '🇨🇾', name: 'Cyprus', dialCode: '357' },
  { iso: 'AD', flag: '🇦🇩', name: 'Andorra', dialCode: '376' },
  // Central Europe
  { iso: 'DE', flag: '🇩🇪', name: 'Germany', dialCode: '49' },
  { iso: 'AT', flag: '🇦🇹', name: 'Austria', dialCode: '43' },
  { iso: 'CH', flag: '🇨🇭', name: 'Switzerland', dialCode: '41' },
  { iso: 'PL', flag: '🇵🇱', name: 'Poland', dialCode: '48' },
  { iso: 'CZ', flag: '🇨🇿', name: 'Czech Republic', dialCode: '420' },
  { iso: 'SK', flag: '🇸🇰', name: 'Slovakia', dialCode: '421' },
  { iso: 'HU', flag: '🇭🇺', name: 'Hungary', dialCode: '36' },
  { iso: 'SI', flag: '🇸🇮', name: 'Slovenia', dialCode: '386' },
  { iso: 'HR', flag: '🇭🇷', name: 'Croatia', dialCode: '385' },
  // Northern Europe
  { iso: 'SE', flag: '🇸🇪', name: 'Sweden', dialCode: '46' },
  { iso: 'NO', flag: '🇳🇴', name: 'Norway', dialCode: '47' },
  { iso: 'DK', flag: '🇩🇰', name: 'Denmark', dialCode: '45' },
  { iso: 'FI', flag: '🇫🇮', name: 'Finland', dialCode: '358' },
  { iso: 'IS', flag: '🇮🇸', name: 'Iceland', dialCode: '354' },
  { iso: 'EE', flag: '🇪🇪', name: 'Estonia', dialCode: '372' },
  { iso: 'LV', flag: '🇱🇻', name: 'Latvia', dialCode: '371' },
  { iso: 'LT', flag: '🇱🇹', name: 'Lithuania', dialCode: '370' },
  // Eastern Europe
  { iso: 'RU', flag: '🇷🇺', name: 'Russia', dialCode: '7' },
  { iso: 'UA', flag: '🇺🇦', name: 'Ukraine', dialCode: '380' },
  { iso: 'BY', flag: '🇧🇾', name: 'Belarus', dialCode: '375' },
  { iso: 'MD', flag: '🇲🇩', name: 'Moldova', dialCode: '373' },
  { iso: 'RO', flag: '🇷🇴', name: 'Romania', dialCode: '40' },
  { iso: 'BG', flag: '🇧🇬', name: 'Bulgaria', dialCode: '359' },
  { iso: 'RS', flag: '🇷🇸', name: 'Serbia', dialCode: '381' },
  { iso: 'BA', flag: '🇧🇦', name: 'Bosnia y Herzegovina', dialCode: '387' },
  { iso: 'ME', flag: '🇲🇪', name: 'Montenegro', dialCode: '382' },
  { iso: 'AL', flag: '🇦🇱', name: 'Albania', dialCode: '355' },
  { iso: 'MK', flag: '🇲🇰', name: 'North Macedonia', dialCode: '389' }
]
