export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  },
  cms: {
    apiBaseUrl: process.env.CMS_API_BASE_URL || 'http://localhost:1337/api',
  }
});