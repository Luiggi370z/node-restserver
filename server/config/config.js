process.env.PORT = process.env.PORT || 3000


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let dbUrl = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' :
    process.env.MONGO_URI

process.env.URL_DB = dbUrl