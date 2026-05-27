import dotenv from 'dotenv'

dotenv.config()

export const paymobConfig = {
  apiKey: process.env.PAYMOB_API_KEY as string,
  integrationId: process.env.PAYMOB_INTEGRATION_ID as string,
  iframeId: process.env.PAYMOB_IFRAME_ID as string,
  hmacSecret: process.env.PAYMOB_HMAC_SECRET as string,
  baseUrl: 'https://accept.paymob.com/api',
}
