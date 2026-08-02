import { createBrowserRouter, Navigate } from 'react-router-dom'
import { App } from './App'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { OrdersListPage } from './pages/OrdersListPage'
import { NewOrderPage } from './pages/NewOrderPage'
import { ProtectedRoute } from './components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/pedidos" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'cadastro', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'pedidos', element: <OrdersListPage /> },
          { path: 'pedidos/novo', element: <NewOrderPage /> },
        ],
      },
    ],
  },
])
