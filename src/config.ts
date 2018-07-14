export const mode: 'development'|'production' = process.env.PORT  ? 'production' : 'development'
export const port = process.env.PORT || 8080
export const url = process.env.PORT ? 'https://typescript-api-playground.glitch.me' : 'http://localhost:8080'