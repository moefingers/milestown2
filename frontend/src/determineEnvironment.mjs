export const env = {
  environment: process.env.NODE_ENV || 'development',
  backend: window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://milestown2.onrender.com',
  indexPath: window.location.hostname === "moefingers.github.io" ? "/milestown2" : "/"
}