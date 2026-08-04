import { useState, type FormEvent } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import InputAdornment from '@mui/material/InputAdornment'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../components/PasswordField'
import { login as loginRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/errors'
import { isValidEmail } from '../utils/validation'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailTocado, setEmailTocado] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      login(data.token)
      navigate('/pedidos')
    },
  })

  const emailInvalido = email.length > 0 && !isValidEmail(email)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setEmailTocado(true)
      return
    }
    mutation.mutate({ email, senha })
  }

  const errorMessage = getApiErrorMessage(mutation.error, 'Não foi possível fazer login')

  return (
    <AuthLayout title="Entrar" subtitle="Acesse sua conta para continuar.">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ minHeight: 48 }}>{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</Box>
        <TextField
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTocado(true)}
          error={emailTocado && emailInvalido}
          helperText={emailTocado && emailInvalido ? 'Informe um e-mail válido' : ' '}
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
        <PasswordField label="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
          {mutation.isPending ? 'Entrando...' : 'Entrar'}
        </Button>
        <Link component={RouterLink} to="/cadastro" sx={{ textAlign: 'center' }}>
          Não tem conta? Cadastre-se
        </Link>
      </Box>
    </AuthLayout>
  )
}
