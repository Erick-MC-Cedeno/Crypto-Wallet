import React, { useState } from 'react'
import { post, forgotPasswordApi } from '../api/http'
import { useHistory } from 'react-router-dom'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const history = useHistory()

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      await post(forgotPasswordApi, { email })
      setMessage('Si el correo existe, se ha enviado un mensaje con instrucciones.')
      // Redirect to login after success
      setTimeout(() => history.push('/login'), 1500)
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al enviar el correo')
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2>Restablecer contraseña</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit">Enviar enlace de restablecimiento</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 12 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  )
}
