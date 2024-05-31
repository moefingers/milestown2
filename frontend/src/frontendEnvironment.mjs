const production = {
    environment: 'production',
    backend: 'https://milestown2.onrender.com/'
  };
  const development = {
    environment: 'development',
    backend: 'http://localhost:3000'
  };
  export const config = (process.env.NODE_ENV === 'development') 
    ? development 
    : production