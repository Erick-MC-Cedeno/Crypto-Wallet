import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box, Button, Alert } from '@mui/material';
import useProvider from '../../hooks/useProviders';

export default function ProviderCard() {
  const { getAllProviders } = useProvider();
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState(null);

  const fetchProviders = async () => {
    console.log("Intentando obtener los proveedores...");
    try {
      const res = await getAllProviders();
      console.log("Respuesta de getAllProviders:", res);

      if (res && res.length > 0) {
        setProviders(res);
        setError(null);
      } else {
        console.log("No se encontraron proveedores.");
        setError({ message: 'No se encontraron proveedores.' });
        setProviders([]);
      }
    } catch (err) {
      console.log("Error al obtener proveedores:", err);
      setError(err);
      setProviders([]);
    }
  };

  useEffect(() => {
    fetchProviders();
    return () => {
     
    };
  }, []);

  return (
    <Box sx={{ padding: 3 }}>
      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error.message || 'Ocurrió un error al cargar los proveedores.'}
        </Alert>
      )}

      <Grid container spacing={2}>
        {providers.map((provider) => (
          <Grid item xs={12} sm={6} md={4} key={provider._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {provider.firstName} {provider.lastName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Correo electrónico: {provider.email}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Número de identificación: {provider.idNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Dirección: {provider.streetName}, {provider.city}, {provider.postalCode}
                </Typography>
                <Box mt={2}>
                  <Button variant="contained" color="primary" fullWidth>
                    Ver detalles
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}