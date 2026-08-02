import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { createOrder } from '../api/orders'
import type { OrderItemInput } from '../types/order'
import type { ApiError } from '../types/error'

const ITEM_VAZIO: OrderItemInput = { descricao: '', quantidade: 1, precoUnitario: 0 }

export function NewOrderPage() {
  const [nomeCliente, setNomeCliente] = useState('')
  const [enderecoEntrega, setEnderecoEntrega] = useState('')
  const [itens, setItens] = useState<OrderItemInput[]>([{ ...ITEM_VAZIO }])
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => navigate('/pedidos'),
  })

  function atualizarItem(index: number, campo: keyof OrderItemInput, valor: string) {
    setItens((atual) =>
      atual.map((item, i) =>
        i === index
          ? { ...item, [campo]: campo === 'descricao' ? valor : Number(valor) }
          : item,
      ),
    )
  }

  function adicionarItem() {
    setItens((atual) => [...atual, { ...ITEM_VAZIO }])
  }

  function removerItem(index: number) {
    setItens((atual) => atual.filter((_, i) => i !== index))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate({ nomeCliente, enderecoEntrega, itens })
  }

  const errorMessage = axios.isAxiosError<ApiError>(mutation.error)
    ? mutation.error.response?.data.message
    : mutation.error
      ? 'Não foi possível criar o pedido'
      : null

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Novo pedido</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <TextField label="Cliente" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} required />
        <TextField
          label="Endereço de entrega"
          value={enderecoEntrega}
          onChange={(e) => setEnderecoEntrega(e.target.value)}
          required
        />

        <Typography variant="subtitle1">Itens</Typography>
        {itens.map((item, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="Descrição"
              value={item.descricao}
              onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
              required
              sx={{ flex: 2 }}
            />
            <TextField
              label="Qtd."
              type="number"
              value={item.quantidade}
              onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
              slotProps={{ htmlInput: { min: 1 } }}
              required
              sx={{ flex: 1 }}
            />
            <TextField
              label="Preço unitário"
              type="number"
              value={item.precoUnitario}
              onChange={(e) => atualizarItem(index, 'precoUnitario', e.target.value)}
              slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
              required
              sx={{ flex: 1 }}
            />
            <IconButton onClick={() => removerItem(index)} disabled={itens.length === 1} aria-label="Remover item">
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}
        <Button startIcon={<AddIcon />} onClick={adicionarItem} sx={{ alignSelf: 'flex-start' }}>
          Adicionar item
        </Button>

        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? 'Salvando...' : 'Criar pedido'}
        </Button>
      </Box>
    </Box>
  )
}
