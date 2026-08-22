import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/Login'
import Signup from './pages/Signup'

// Main Pages
import Dashboard from './pages/Dashboard'
import MyTrips from './pages/MyTrips'
import CreateTrip from './pages/CreateTrip'
import EditTrip from './pages/EditTrip'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import CitySearch from './pages/CitySearch'
import ActivitySearch from './pages/ActivitySearch'
import BudgetView from './pages/BudgetView'
import SharedView from './pages/SharedView'
import Profile from './pages/Profile'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

import { useApp } from './context/AppContext'

function PrivateRoute({ children }) {
  const { user } = useApp()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useApp()
  return !user ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      </Route>

      {/* Shared (no auth needed) */}
      <Route path="/share/:tripId" element={<SharedView />} />

      {/* Protected Routes */}
      <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/trips/new" element={<CreateTrip />} />
        <Route path="/trips/:tripId/edit" element={<EditTrip />} />
        <Route path="/trips/:tripId/build" element={<ItineraryBuilder />} />
        <Route path="/trips/:tripId/view" element={<ItineraryView />} />
        <Route path="/trips/:tripId/budget" element={<BudgetView />} />
        <Route path="/cities" element={<CitySearch />} />
        <Route path="/activities" element={<ActivitySearch />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
