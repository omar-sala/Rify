import { Request, Response } from 'express'
import { supabase } from '../config/supabase'

export const handleWebhook = (req: Request, res: Response): void => {
  try {
    console.log('📩 Webhook received:', JSON.stringify(req.body))

    const body = req.body

    if (body.success === true) {
      const orderId = body.order?.merchant_order_id

      console.log('✅ Payment successful, updating order:', orderId)

      supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId)
        .then(({ error }) => {
          if (error) {
            console.error('❌ Supabase update error:', error)
          } else {
            console.log('✅ Order updated to paid:', orderId)
          }
        })
    } else {
      console.log('❌ Payment failed')
    }

    res.status(200).json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Webhook error' })
  }
}
