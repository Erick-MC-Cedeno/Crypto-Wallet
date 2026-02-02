import React, { useState, useEffect } from 'react'
import { post, resetPasswordApi } from '../api/http'
import { useLocation, useHistory } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function ResetPassword() {
  const query = useQuery()
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const qEmail = query.get('email') || ''
    const qToken = query.get('token') || ''
    setEmail(qEmail)
    setToken(qToken)
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    try {
      const body = { email, token, newPassword, confirmNewPassword }
      const res = await post(resetPasswordApi, body)
      setMessage(res?.data?.message || 'Contraseña restablecida con éxito')
      // Redirect to login automatically after a short delay
      setTimeout(() => history.push('/login'), 1500)
    } catch (err) {
      setError(err?.response?.data?.message || 'Error al restablecer la contraseña')
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h2>Crear nueva contraseña</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        {/* Token is read from the URL and sent with the request; do not display it */}
        <input type="hidden" value={token} />
        <div style={{ marginBottom: 12 }}>
          <label>Nueva contraseña</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Confirmar contraseña</label>
          <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required style={{ width: '100%', padding: 8 }} />
        </div>
        <button type="submit">Restablecer contraseña</button>
      </form>
      {message && <div style={{ color: 'green', marginTop: 12 }}>{message}</div>}
      {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
    </div>
  )
}
