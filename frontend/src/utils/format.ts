const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function calcularTotalPedido(itens: { quantidade: number; precoUnitario: number }[]): number {
  return itens.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0)
}

export function formatOrderCode(id: number): string {
  return `PED-${String(id).padStart(4, '0')}`
}

export function parseCurrencyDigitsToNumber(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  if (!digits) return 0
  return Number(digits) / 100
}

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}
