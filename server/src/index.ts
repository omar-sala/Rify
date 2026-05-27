import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import paymentRoutes from './routes/payment.routes'
import webhookRoutes from './routes/webhook.routes'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Bypass ngrok browser warning
app.use((req, _, next) => {
  req.headers['ngrok-skip-browser-warning'] = 'true'
  next()
})

app.get('/', (_, res) => {
  res.send('RIFY Backend Running 🚀')
})

app.use('/api/payment', paymentRoutes)
app.use('/api/webhook', webhookRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
