import express from 'express';
import httpModule from 'http';
import session, { Cookie } from 'express-session'
import moment from 'moment';
import {Server} from 'socket.io';
import productController from './api/products.js';
import messagesController from './api/messages.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import {routerProductsApi, routerProductsView} from './routes/products.js';
import config from './config/config.js';
import normalizeMessages from './normalizr/messages-center.js';
import cookieParser from 'cookie-parser';
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const http = httpModule.Server(app);
const io = new Server(http);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');
app.use(cookieParser());

app.use('/api/productos', routerProductsApi);
app.use('/productos', routerProductsView);

/* AUTH ROUTES */
app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
  const name = req.body.name;
  if(!name || !name.length) {
    res.status(401).json({ error: 'No se envió un nombre para el Login' });
    return;
  }
  res.cookie('name', name).cookie('loggedin', true, {maxAge: 60000}).redirect('/');
});

app.get('/logout', (req, res) => {
  const name = req.cookies.name;
  res.clearCookie('name').clearCookie('loggedin').render('logout', { name });
});
/* AUTH ROUTES */

/* SOCKETS */
io.on('connection', async (socket) => {
  console.log('nuevo cliente conectado');

  socket.emit('products', await productController.findAll());

  socket.emit('messages', normalizeMessages(await messagesController.findAll()));

  socket.on('productAdd', async (data) => {
    const {title, price, thumbnail} = data;
    const newProduct = await productController.create({title, price, thumbnail});
    io.sockets.emit('product', newProduct);
  })

  socket.on('message', async (data) => {
    const {author, message} = data;
    const newMessage = {author, message, date: moment(new Date()).format('DD/MM/YYY HH:mm:ss')}
    await messagesController.create({author: newMessage.author, message: newMessage.message, date: newMessage.date})
    io.sockets.emit('message', newMessage);
  })
})
/* SOCKETS */

const server = http.listen(config.PORT || 8080, () => {
  console.log(`Servidor inicializado en el puerto ${config.PORT || 8080}.`);
})

server.on('error', () => {
  console.log('Error del servidor.');
})