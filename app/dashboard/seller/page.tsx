import ProtectedRoute from '../../../src/components/ProtectedRoute'

export default function SellerDashboard() {
  return (
    <ProtectedRoute allowed={['seller']}>
      <h1 className="p-10 text-2xl">Seller Dashboard</h1>
    </ProtectedRoute>
  )
}
