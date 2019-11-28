// PORT
process.env.PORT = process.env.PORT || 3000

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// DATA BASE
const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee_db' : 'mongodb+srv://BenjiPrice:0o5wqeX76vFGYNyr@cluster0-hveev.mongodb.net/coffee_db'
process.env.URL_DB = urlDB