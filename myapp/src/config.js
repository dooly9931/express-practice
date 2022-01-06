const config = {
  development: {
    database: {
      host: 'localhost',
      port: 5432,
      database: 'testdb',
      user: 'testuser',
      password: 'testpw1234',
      max: 30
    }
  }, 
  production: {
  }
};

export default config;
