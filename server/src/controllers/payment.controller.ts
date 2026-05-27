import { Request, Response } from 'express'
import {
  getAuthToken,
  registerOrder,
  getPaymentKey,
} from '../services/paymob.service'
import { paymobConfig } from '../config/paymob'

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { amount, items, billingData, orderId } = req.body

    // Step 1: Auth Token
    const authToken = await getAuthToken()

    // Step 2: Register Order
    const paymobOrderId = await registerOrder(authToken, amount, items, orderId)

    // Step 3: Payment Key
    const paymentKey = await getPaymentKey(
      authToken,
      paymobOrderId,
      amount,
      billingData
    )

    // Return iframe URL to frontend
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${paymobConfig.iframeId}?payment_token=${paymentKey}`

    res.status(200).json({
      success: true,
      paymentKey,
      iframeUrl,
    })
  } catch (error) {
    console.error('Payment error:', error)
    res.status(500).json({
      success: false,
      message: 'Payment failed',
    })
  }
}
