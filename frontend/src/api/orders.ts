import { api } from './client'
import type { CreateOrderInput, Order, OrderStatus } from '../types/order'

export async function listOrders(): Promise<Order[]> {
  const { data } = await api.get<Order[]>('/api/orders')
  return data
}

export async function getOrder(id: number): Promise<Order> {
  const { data } = await api.get<Order>(`/api/orders/${id}`)
  return data
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { data } = await api.post<Order>('/api/orders', input)
  return data
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
  const { data } = await api.patch<Order>(`/api/orders/${id}/status`, { status })
  return data
}
