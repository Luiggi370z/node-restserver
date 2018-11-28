process.env.PORT = process.env.PORT || 3000


process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let dbUrl = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' :
    'mongodb://cafe-user:pzxULmXRjxMDM3E@ds119171.mlab.com:19171/cafe'

process.env.URL_DB = dbUrl