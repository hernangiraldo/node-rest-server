// PORT
process.env.PORT = process.env.PORT || 3000

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

// DATA BASE
const urlDB = process.env.NODE_ENV === 'dev' ? 'mongodb://localhost:27017/coffee_db' : process.env.MONGO_URI
process.env.URL_DB = urlDB

// EXPIRATION DATE
process.env.EXPIRATION_TOKEN = '1h'

// SEED
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'develop-secret'

// GOOGLE CLIEND ID
process.env.CLIENT_ID = '653048375293-tqbeed5b43lrcsfbo3chdc83evis3ap6.apps.googleusercontent.com'