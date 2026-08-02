import { useState, type FormEvent } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import { register as registerRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import type { ApiError } from '../types/error'

export function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: registerRequest,
    onSuccess: (data) => {
      login(data.token)
      navigate('/pedidos')
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate({ nome, email, senha })
  }

  const errorMessage = axios.isAxiosError<ApiError>(mutation.error)
    ? mutation.error.response?.data.message
    : mutation.error
      ? 'Não foi possível cadastrar'
      : null

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', mt: 8, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Criar conta</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField
          label="Senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          helperText="Mínimo de 6 caracteres"
          required
        />
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
        <Link component={RouterLink} to="/login" sx={{ textAlign: 'center' }}>
          Já tem conta? Entrar
        </Link>
      </Box>
    </Box>
  )
}
