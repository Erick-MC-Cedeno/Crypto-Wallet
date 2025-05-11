import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 
import { TextField, Button, Typography, Grid, Paper, Alert } from '@mui/material';
import useProvider from '../../hooks/useProviders';
import { AuthContext } from '../../hooks/AuthContext';

export default function ProviderForm() {
  const { createNewProvider, findByEMail, provider, error } = useProvider();
  const { auth } = useContext(AuthContext);
  const history = useHistory();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    idNumber: '',
    email: '',
    streetName: '',
    city: '',
    postalCode: '',
  });

  const [hasCheckedProvider, setHasCheckedProvider] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createNewProvider(form);
   
  };

  
  useEffect(() => {
    const fetchProvider = async () => {
      if (!hasCheckedProvider && auth?.email) {
        setHasCheckedProvider(true);
  
        try {
          const response = await findByEMail(auth.email);
  
          if (response) {          
            history.push('/providerChat');
          } else {
          }
        } catch (err) {
          console.error("Error en findByEMail:", err);
        }
      }
    };
    fetchProvider();
  }, [auth?.email, hasCheckedProvider, findByEMail, history]);

  
  useEffect(() => {
    if (provider) {
      history.push('/providerChat');
    }
  }, [provider, history]);

  return (
    <Paper elevation={3} style={{ padding: 24, maxWidth: 600, margin: '40px auto' }}>
      <Typography variant="h5" gutterBottom>
        Crear nuevo proveedor
      </Typography>

      {provider && (
        <Alert severity="success" style={{ marginBottom: 16 }}>
          Proveedor creado exitosamente.
        </Alert>
      )}
      {error && (
        <Alert severity="error" style={{ marginBottom: 16 }}>
          {error.message || 'Ocurrió un error'}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Primer nombre"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Número de identificación"
              name="idNumber"
              value={form.idNumber}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Correo electrónico"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Nombre de la calle"
              name="streetName"
              value={form.streetName}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Ciudad"
              name="city"
              value={form.city}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Código Postal"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Crear proveedor
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}
