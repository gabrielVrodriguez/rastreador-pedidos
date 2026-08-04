import { useState, type FormEvent } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Link from '@mui/material/Link'
import InputAdornment from '@mui/material/InputAdornment'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { AuthLayout } from '../components/AuthLayout'
import { PasswordField } from '../components/PasswordField'
import { register as registerRequest } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/errors'
import { isValidEmail } from '../utils/validation'

export function RegisterPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [emailTocado, setEmailTocado] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: registerRequest,
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
    mutation.mutate({ nome, email, senha })
  }

  const errorMessage = getApiErrorMessage(mutation.error, 'Não foi possível cadastrar')

  return (
    <AuthLayout title="Criar conta" subtitle="Cadastre-se para começar a rastrear seus pedidos.">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ minHeight: 48 }}>{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</Box>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
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
        <PasswordField
          label="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          helperText="Mínimo de 6 caracteres"
          required
        />
        <Button type="submit" variant="contained" size="large" disabled={mutation.isPending}>
          {mutation.isPending ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
        <Link component={RouterLink} to="/login" sx={{ textAlign: 'center' }}>
          Já tem conta? Entrar
        </Link>
      </Box>
    </AuthLayout>
  )
}
