import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'erickcedeno558@gmail.com',
      pass: 'kefo uixq iauf vstq',
    },
  });

  async sendTokenLogin(toEmail: string, token: string): Promise<void> {
    const mailOptions = {
      from: 'BlockVault <noreply@nextcryptoatm.com>',
      to: toEmail,
      subject: 'Token de verificación para iniciar sesión',
      html: `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #003366; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                .header { background-color: #115AF7; color: #ffffff; padding: 15px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 20px; background-color: #f4f4f4; border-radius: 8px; }
                .content p { line-height: 1.6; }
                .token { font-size: 32px; font-weight: bold; color: blue; text-align: center; margin: 20px 0; }
                .important { font-size: 20px; font-weight: bold; color: #ff5722; text-align: center; margin: 20px 0; }
                .security-tips { padding: 15px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin: 20px 0; }
                .security-tips h4 { font-size: 22px; color: #115AF7; margin: 0 0 10px; }
                .security-tips ul { padding-left: 20px; }
                .security-tips li { font-size: 18px; margin: 5px 0; }
                .footer { text-align: center; padding: 15px; font-size: 14px; color: #888; border-top: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>BlockVault</h1>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    <p>Ingresa los siguientes datos para confirmar que eres tú:</p>

                    <div class="token">
                     <span>TOKEN:</span> <strong>${token}</strong>
                    </div>

                    <p class="important">Token expirará en 1 minutos.</p>
                    <div class="security-tips">
                        <h4>Consejos para proteger tus fondos:</h4>
                        <ul>
                            <li>Utiliza contraseñas fuertes y únicas para tu cuenta.</li>
                            <li>Activa la autenticación de dos factores (2FA) siempre que sea posible.</li>
                            <li>No compartas tus claves privadas ni contraseñas con nadie.</li>
                            <li>Revisa regularmente tus transacciones y saldos.</li>
                            <li>Desconfía de enlaces y correos electrónicos sospechosos.</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p>Gracias por usar BlockVault.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }

  async generateToken(): Promise<string> {
    // Genera un token aleatorio de 6 dígitos
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    return token;
  }


  async sendVerificationEmail(email: string): Promise<void> {
    const verificationUrl = `http://localhost:3000/verifyemail`;

    await this.transporter.sendMail({
      from: '"Your App" <your-email@example.com>',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
      html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    });
  }


  async sendLoginNotificationEmail(toEmail: string): Promise<void> {
    const mailOptions = {
      from: 'BlockVault <noreply@nextcryptoatm.com>',
      to: toEmail,
      subject: 'Notificación de Inicio de sesión',
      html: `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0; background-color: #003366; }
                .container { max-width: 600px; margin: 20px auto; padding: 20px; border-radius: 10px; background-color: #ffffff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
                .header { background-color: #0E1BCE; color: #ffffff; padding: 15px; text-align: center; border-radius: 10px 10px 0 0; }
                .header h1 { margin: 0; font-size: 28px; }
                .content { padding: 20px; background-color: #f4f4f4; border-radius: 8px; }
                .content p { line-height: 1.6; }
                .important { font-size: 20px; font-weight: bold; color: #ff5722; text-align: center; margin: 20px 0; }
                .security-tips { padding: 15px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); margin: 20px 0; }
                .security-tips h4 { font-size: 22px; color: #0E1BCE; margin: 0 0 10px; }
                .security-tips ul { padding-left: 20px; }
                .security-tips li { font-size: 18px; margin: 5px 0; }
                .footer { text-align: center; padding: 15px; font-size: 14px; color: #888; border-top: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>BlockVault</h1>
                </div>
                <div class="content">
                    <p>Hola,</p>
                    <p>Hemos registrado un inicio de sesión en tu cuenta.</p>
                    <p>Si no reconoces esta actividad, por favor, contacta con nuestro soporte.</p>
                    <div class="important">IMPORTANTE: Protege tu cuenta</div>
                    <div class="security-tips">
                        <h4>Consejos para proteger tus fondos:</h4>
                        <ul>
                            <li>Utiliza contraseñas fuertes y únicas para tu cuenta.</li>
                            <li>Activa la autenticación de dos factores (2FA) siempre que sea posible.</li>
                            <li>No compartas tus claves privadas ni contraseñas con nadie.</li>
                            <li>Revisa regularmente tus transacciones y saldos.</li>
                            <li>Desconfía de enlaces y correos electrónicos sospechosos.</li>
                        </ul>
                    </div>
                </div>
                <div class="footer">
                    <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    <p>Gracias por usar BlockVault.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };


    

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
    }
  }
}
