import Mongoose from 'mongoose'
import config from '../config/config.js';

const connection = await Mongoose.connect(config.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

Mongoose.connection.on('connected', () => {
    console.log('[Mongoose] - connected in:', config.MONGO_URL);
});

Mongoose.connection.on('error', (err) => {
    console.log('[Mongoose] - error:', err);
});

export default connection;