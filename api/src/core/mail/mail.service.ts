import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Resend } from 'resend'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private readonly resend: Resend

  constructor(private config: ConfigService) {
    this.resend = new Resend(this.config.get<string>('RESEND_API_KEY', ''))
  }

  private get from() {
    const email = this.config.get<string>('RESEND_FROM_EMAIL', '')
    const name = this.config.get<string>('RESEND_FROM_NAME', 'Mis Tesoros')
    return `${name} <${email}>`
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    const { error } = await this.resend.emails.send({
      from: this.from,
      to,
      subject,
      html
    })

    if (error) {
      this.logger.error(`Failed to send "${subject}" to ${to}: ${error.message}`)
      throw new Error(error.message)
    }
  }

  async sendVerificationCode(to: string, code: string): Promise<void> {
    await this.send(
      to,
      'Verifica tu correo - Mis Tesoros',
      `
        <h2>Bienvenido a Mis Tesoros</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="letter-spacing:8px;font-size:32px;font-family:monospace;">${code}</h1>
        <p>Este código expira en 15 minutos.</p>
      `
    )
  }

  async sendPasswordResetCode(to: string, code: string): Promise<void> {
    await this.send(
      to,
      'Restablecer contraseña - Mis Tesoros',
      `
        <h2>Restablecer contraseña</h2>
        <p>Tu código para restablecer la contraseña es:</p>
        <h1 style="letter-spacing:8px;font-size:32px;font-family:monospace;">${code}</h1>
        <p>Este código expira en 15 minutos. Si no solicitaste esto, ignora este mensaje.</p>
      `
    )
  }
}
