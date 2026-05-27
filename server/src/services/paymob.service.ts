import axios from 'axios'
import { paymobConfig } from '../config/paymob'

// Step 1: Get Auth Token
export const getAuthToken = async (): Promise<string> => {
  const response = await axios.post(`${paymobConfig.baseUrl}/auth/tokens`, {
    api_key: paymobConfig.apiKey,
  })
  return response.data.token
}

// Step 2: Register Order
export const registerOrder = async (
  authToken: string,
  amountCents: number,
  items: object[],
  merchantOrderId: string
): Promise<number> => {
  const response = await axios.post(
    `${paymobConfig.baseUrl}/ecommerce/orders`,
    {
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      merchant_order_id: merchantOrderId,
      items,
    }
  )
  return response.data.id
}

// Step 3: Get Payment Key
export const getPaymentKey = async (
  authToken: string,
  orderId: number,
  amountCents: number,
  billingData: object
): Promise<string> => {
  const response = await axios.post(
    `${paymobConfig.baseUrl}/acceptance/payment_keys`,
    {
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: billingData,
      currency: 'EGP',
      integration_id: paymobConfig.integrationId,
    }
  )
  return response.data.token
}
