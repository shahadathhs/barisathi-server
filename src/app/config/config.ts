import dotenv from 'dotenv'

// ** Load Environment Variables **
dotenv.config({ path: '.env' })

export const configuration = {
  env: process.env.NODE_ENV ?? 'development',
  port: process.env.PORT ?? 5000,
  mongo: {
    url: process.env.DATABASE_URL ?? 'mongodb://localhost:27017/test'
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1d'
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY ?? '',
    publicKey: process.env.STRIPE_PUBLIC_KEY ?? ''
  },
  client: {
    url: process.env.CLIENT_URL ?? 'http://localhost:5173'
  }
}
