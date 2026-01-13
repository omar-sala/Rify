import ProtectedRoute from '../../../src/components/ProtectedRoute'

export default function UserDashboard() {
  return (
    <ProtectedRoute allowed={['user']}>
      <h1 className="p-10 text-2xl">User Dashboard</h1>
    </ProtectedRoute>
  )
}
