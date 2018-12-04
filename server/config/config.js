process.env.PORT = process.env.PORT || 3000

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

let dbUrl = process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe' :
    process.env.MONGO_URI

process.env.URL_DB = dbUrl

process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'seed-dev'

//secs x min x hours x days
process.env.TOKEN_EXPIRATION_TIME = '48h'

process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '10839397877-he85dhrtvgankkq7p0t271cmv35us29q.apps.googleusercontent.com'