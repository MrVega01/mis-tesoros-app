import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import helmet from 'helmet'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  )
  app.setGlobalPrefix('api/v1')

  const port = process.env.PORT ?? 3000
  await app.listen(port)
  console.log(`API running on http://localhost:${port}/api/v1`)
}
bootstrap()
