export type OrderStatus =
  | 'RECEBIDO'
  | 'EM_PREPARO'
  | 'SAIU_PARA_ENTREGA'
  | 'ENTREGUE'
  | 'CANCELADO'

export interface OrderItem {
  id: number
  descricao: string
  quantidade: number
  precoUnitario: number
}

export interface Order {
  id: number
  nomeCliente: string
  enderecoEntrega: string
  status: OrderStatus
  itens: OrderItem[]
  criadoEm: string
  atualizadoEm: string
}

export interface OrderItemInput {
  descricao: string
  quantidade: number
  precoUnitario: number
}

export interface CreateOrderInput {
  nomeCliente: string
  enderecoEntrega: string
  itens: OrderItemInput[]
}
