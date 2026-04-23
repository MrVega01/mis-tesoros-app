import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as sgMail from '@sendgrid/mail'

@Injectable()
export class MailService {
  constructor (private config: ConfigService) {
    sgMail.setApiKey(this.config.get<string>('SENDGRID_API_KEY', ''))
  }

  private get from () {
    return {
      email: this.config.get<string>('SENDGRID_FROM_EMAIL', ''),
      name: this.config.get<string>('SENDGRID_FROM_NAME', 'Mis Tesoros')
    }
  }

  async sendVerificationCode (to: string, code: string): Promise<void> {
    await sgMail.send({
      to,
      from: this.from,
      subject: 'Verifica tu correo - Mis Tesoros',
      html: `
        <h2>Bienvenido a Mis Tesoros</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing:8px;font-size:32px;font-family:monospace;">${code}</h1>
        <p>Este código expira en 15 minutos.</p>
      `
    })
  }

  async sendPasswordResetCode (to: string, code: string): Promise<void> {
    await sgMail.send({
      to,
      from: this.from,
      subject: 'Restablecer contraseña - Mis Tesoros',
      html: `
        <h2>Restablecer contraseña</h2>
        <p>Tu código para restablecer la contraseña es:</p>
        <h1 style="letter-spacing:8px;font-size:32px;font-family:monospace;">${code}</h1>
        <p>Este código expira en 15 minutos. Si no solicitaste esto, ignora este mensaje.</p>
      `
    })
  }
}
