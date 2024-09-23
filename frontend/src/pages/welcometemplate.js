import React from 'react';
import { Container, Typography, Button, Box, Link } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
  textAlign: 'center',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2,
  background: 'linear-gradient(145deg, #0a1f2d, #1c2d40)', 
  boxShadow: `0 8px 16px rgba(0, 0, 0, 0.3), 0 -4px 8px rgba(255, 255, 255, 0.1)`,
  maxWidth: '900px',
  margin: 'auto',
  textAlign: 'left',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontSize: '16px',
  fontWeight: 500,
  padding: '12px 24px',
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#007BFF', 
  color: '#FFFFFF',
  '&:hover': {
    backgroundColor: '#0056b3', 
    boxShadow: `0 4px 8px rgba(0, 0, 0, 0.4)`,
  },
}));

const WelcomeTemplate = () => {
  return (
    <StyledContainer maxWidth="lg">
      <StyledBox>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: '#E0E0E0', 
            fontWeight: 'bold',
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.5,
            fontSize: '2.5rem',
            mb: 2,
          }}
        >
          ¡Bienvenido a <strong>Crypto Soporte</strong>!
        </Typography>
        
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: '#B0B0B0', 
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.4,
            lineHeight: 1.7,
            fontSize: '1.2rem',
            mb: 2,
          }}
        >
          Antes de comenzar, ten en cuenta que nuestro servicio de <strong>chat</strong> es una herramienta de comunicación privada, exclusivamente para usuarios dentro de la plataforma.
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: '#B0B0B0', 
            fontFamily: 'Fira Code, monospace',
            letterSpacing: 0.4,
            lineHeight: 1.7,
            fontSize: '1.2rem',
            mb: 2,
          }}
        >
          Para mantener la sesión <strong>activa,</strong> no debes cerrar la página. De lo contrario, tu sesión caducará y deberás iniciar sesión de nuevo con tus credenciales.
        </Typography>
        
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: '#B0B0B0',
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.4,
            lineHeight: 1.7,
            fontSize: '1.2rem',
            mb: 2,
          }}
        >
          Para acceder al sistema, inicia sesión con tu <strong>nombre de usuario</strong> y <strong>contraseña</strong>. Si es tu primera vez, utiliza las credenciales de tu wallet en Next para registrarte. Una vez dentro del chat, utiliza la barra de búsqueda para encontrar al usuario <strong>loredo123</strong>, quien es uno de nuestros encargados de soporte y asistencia.
        </Typography>
        
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: '#B0B0B0',
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.4,
            lineHeight: 1.7,
            fontSize: '1.2rem',
            mb: 2,
          }}
        >
          Puedes acceder al chat en cualquier momento tocando el botón:
        </Typography>

        <Link href="http://192.168.100.2:3000" underline="none">
          <StyledButton>
            Ir al <strong>Chat</strong>
          </StyledButton>
        </Link>
        
        <Typography
          variant="h6"
          sx={{
            color: '#E0E0E0', 
            fontWeight: 'bold',
            fontFamily: 'Fira Code, monospace', 
            mt: 4,
            fontSize: '1.8rem',
            mb: 2,
          }}
        >
          <strong>Políticas de Privacidad</strong>
        </Typography>
        
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            color: '#B0B0B0', 
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.4,
            lineHeight: 1.7,
            fontSize: '1.1rem',
            mb: 2,
          }}
        >
          La <strong>privacidad</strong> de nuestros usuarios es crucial. Te recomendamos revisar nuestras <strong>políticas de privacidad</strong> para entender cómo recopilamos, usamos y protegemos tu información.
        </Typography>
        
        <Link href="https://yourcompany.com/privacy-policy" underline="none">
          <StyledButton>
            <strong>Políticas de Privacidad</strong>
          </StyledButton>
        </Link>
        
        <Typography
          variant="h6"
          sx={{
            color: '#E0E0E0', 
            fontWeight: 'bold',
            fontFamily: 'Fira Code, monospace', 
            mt: 4,
            fontSize: '1.8rem',
            mb: 2,
          }}
        >
          <strong>Soporte y Contacto</strong>
        </Typography>
        
        <Typography
          variant="body2"
          gutterBottom
          sx={{
            color: '#B0B0B0',
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.4,
            lineHeight: 1.7,
            fontSize: '1.1rem',
            mb: 2,
          }}
        >
          Si necesitas asistencia adicional o tienes alguna consulta, no dudes en <strong>contactarnos</strong> a través de nuestro correo electrónico de soporte: <Link href="mailto:support@yourcompany.com" sx={{ color: '#007BFF' }}>support@yourcompany.com</Link>.
        </Typography>
        
        <Typography
          variant="caption"
          display="block"
          sx={{
            mt: 3,
            color: '#606060', 
            fontFamily: 'Fira Code, monospace', 
            letterSpacing: 0.3,
            fontSize: '0.9rem',
          }}
        >
          Si necesitas ayuda, no dudes en contactarnos.
        </Typography>
      </StyledBox>
    </StyledContainer>
  );
};

export default WelcomeTemplate;
