import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAuth from './components/RequireAuth'
import Home from './pages/Home'
import SearchPage from './pages/Search'
import EventDetail from './pages/EventDetail'
import MyTickets from './pages/MyTickets'
import Organizer from './pages/Organizer'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route
          path="/tickets"
          element={
            <RequireAuth>
              <MyTickets />
            </RequireAuth>
          }
        />
        <Route
          path="/organizer"
          element={
            <RequireAuth>
              <Organizer />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Full-screen routes without the app chrome */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/checkout/:id"
        element={
          <RequireAuth>
            <Checkout />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
