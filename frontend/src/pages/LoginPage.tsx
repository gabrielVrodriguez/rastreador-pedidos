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
import { login as loginRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import type { ApiError } from '../types/error'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.token)
      navigate('/pedidos')
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    mutation.mutate({ email, senha })
  }

  const errorMessage = axios.isAxiosError<ApiError>(mutation.error)
    ? mutation.error.response?.data.message
    : mutation.error
      ? 'Não foi possível fazer login'
      : null

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', mt: 8, px: 2 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Entrar</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField label="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </Button>
        <Link component={RouterLink} to="/cadastro" sx={{ textAlign: 'center' }}>
          Não tem conta? Cadastre-se
        </Link>
      </Box>
    </Box>
  )
}
