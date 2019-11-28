// PORT
process.env.PORT = process.env.PORT || 3000

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// DATA BASE
const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee_db' : process.env.MONGO_URI
process.env.URL_DB = urlDB