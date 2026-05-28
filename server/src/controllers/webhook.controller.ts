import { Request, Response } from 'express'
import crypto from 'crypto'
import { paymobConfig } from '../config/paymob'
import { supabase } from '../config/supabase'

export const handleWebhook = (req: Request, res: Response): void => {
  try {
    const hmac = req.query['hmac'] as string
    const body = req.body

    // التحقق من إن الـ request جاي من Paymob فعلاً
    const dataString = [
      body.amount_cents,
      body.created_at,
      body.currency,
      body.error_occured,
      body.has_parent_transaction,
      body.id,
      body.integration_id,
      body.is_3d_secure,
      body.is_auth,
      body.is_capture,
      body.is_refunded,
      body.is_standalone_payment,
      body.is_voided,
      body.order?.id,
      body.owner,
      body.pending,
      body.source_data?.pan,
      body.source_data?.sub_type,
      body.source_data?.type,
      body.success,
    ].join('')

    const hash = crypto
      .createHmac('sha512', paymobConfig.hmacSecret)
      .update(dataString)
      .digest('hex')

    if (hash !== hmac) {
      console.log('❌ Invalid HMAC - rejected')
      res.status(401).json({ message: 'Invalid HMAC' })
      return
    }

    // الدفع نجح
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
      console.log('❌ Payment failed:', body.id)
    }

    res.status(200).json({ message: 'Webhook received' })
  } catch (error) {
    console.error('Webhook error:', error)
    res.status(500).json({ message: 'Webhook error' })
  }
}
