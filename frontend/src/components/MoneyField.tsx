import { useRef, type ChangeEvent, type FocusEvent } from 'react'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import { formatCurrency, parseCurrencyDigitsToNumber } from '../utils/format'

interface MoneyFieldProps extends Omit<TextFieldProps, 'value' | 'onChange' | 'type'> {
  value: number
  onValueChange: (value: number) => void
}

function moverCursorParaOFim(input: HTMLInputElement) {
  requestAnimationFrame(() => {
    const fim = input.value.length
    input.setSelectionRange(fim, fim)
  })
}

export function MoneyField({ value, onValueChange, ...props }: MoneyFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onValueChange(parseCurrencyDigitsToNumber(event.target.value))
    if (inputRef.current) moverCursorParaOFim(inputRef.current)
  }

  function handleFocus(event: FocusEvent<HTMLInputElement>) {
    moverCursorParaOFim(event.target)
  }

  return (
    <TextField
      {...props}
      value={formatCurrency(value)}
      onChange={handleChange}
      onFocus={handleFocus}
      inputRef={inputRef}
      slotProps={{ htmlInput: { inputMode: 'numeric' } }}
    />
  )
}
