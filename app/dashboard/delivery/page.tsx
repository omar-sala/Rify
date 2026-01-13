import ProtectedRoute from '../../../src/components/ProtectedRoute'

export default function DeliveryDashboard() {
  return (
    <ProtectedRoute allowed={['delivery']}>
      <h1 className="p-10 text-2xl">Delivery Dashboard</h1>
    </ProtectedRoute>
  )
}
