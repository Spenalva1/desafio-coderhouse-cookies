import { getCookie, setCookie } from "./lib/cookies.js";

const container = document.querySelector('.container-fluid');
let isLogged = false;

// AUTH CHECK
const name = getCookie('name');
const loggedin = getCookie('loggedin');
if (name?.length > 0 && loggedin) {
  setCookie('loggedin', true, 60)
  const html = `
    <div class="logged-alert d-flex justify-content-between align-items-center alert alert-primary fw-bold mt-4" role="alert">
      <h2 class="fw-bold logged-message">Bienvenido ${name?.length > 0 ? 'name' : ''}</h2>
      <a href="/logout" class="btn btn-warning">Desloguear</a>
    </div>
  `;
  container.innerHTML = html + container.innerHTML;
  isLogged = true;
}
if (!loggedin) {
  window.location.pathname = '/login';
}
// AUTH CHECK

if (isLogged) {
  const socket                = io();

  const productForm           = document.querySelector('.product-form');
  const productTitleInput     = productForm.querySelector('[name="title"]');
  const productPriceInput     = productForm.querySelector('[name="price"]');
  const productThumbnailInput = productForm.querySelector('[name="thumbnail"]');
  const productsTable         = document.querySelector('.productsCtn');

  const compressionTitle      = document.querySelector('.compression');
  const chatForm              = document.querySelector('.chat-form');
  const chatMessageInput      = chatForm.querySelector('[name="message"]');
  const chatEmailInput        = chatForm.querySelector('[name="email"]');
  const chatNameInput         = chatForm.querySelector('[name="name"]');
  const chatSurnameInput      = chatForm.querySelector('[name="surname"]');
  const chatAgeInput          = chatForm.querySelector('[name="age"]');
  const chatAliasInput        = chatForm.querySelector('[name="alias"]');
  const chatAvatarInput       = chatForm.querySelector('[name="avatar"]');
  const messagesCtn           = document.querySelector('.chat-messages');

  let productsExists = false;

  const productsTemplate = Handlebars.compile(`
    {{#if productsExists}}
      <div class="bg-dark grid">
        <div class="row border-bottom">
          <div class="col-4 p-4 fw-bold">Nombre</div>
          <div class="col-4 p-4 fw-bold">Precio</div>
          <div class="col-4 p-4 fw-bold">Foto</div>
        </div>
        {{#each products}}
        <div class="row border-bottom">
          <div class="col-4 p-4">{{this.title}}</div>
          <div class="col-4 p-4">{{this.price}}</div>
          <div class="col-4 p-4">
            <img width="50" src="{{this.thumbnail}}" />
          </div>
        </div>
        {{/each}}
      </div>
    {{else}}
      <div class="alert alert-warning fw-bold" role="alert"> No se encontraron productos</div>
    {{/if}}
  `);

  const firstProductTemplate = Handlebars.compile(`
    <div class="bg-dark grid">
      <div class="row border-bottom">
        <div class="col-4 p-4 fw-bold">Nombre</div>
        <div class="col-4 p-4 fw-bold">Precio</div>
        <div class="col-4 p-4 fw-bold">Foto</div>
      </div>
      <div class="row border-bottom">
        <div class="col-4 p-4">{{title}}</div>
        <div class="col-4 p-4">{{price}}</div>
        <div class="col-4 p-4">
          <img width="50" src="{{thumbnail}}" />
        </div>
      </div>
    </div>
  `);

  const productTemplate = Handlebars.compile(`
    <div class="row border-bottom">
      <div class="col-4 p-4">{{title}}</div>
      <div class="col-4 p-4">{{price}}</div>
      <div class="col-4 p-4">
        <img width="50" src="{{thumbnail}}" />
      </div>
    </div>
  `);

  const messagesTemplate = Handlebars.compile(`
    {{#if messagesExists}}
      {{#each messages}}
        <div class="message-item">
          <span class="author">{{this.author.email}}</span>
          <span>
            [<span class="date">{{this.date}}</span>]:
          </span>
          <span class="message">{{this.message}}</span>
        </div>
      {{/each}}
    {{/if}}
  `);

  const messageTemplate = Handlebars.compile(`
    <div class="message-item">
      <span class="author">{{author.email}}</span>
      <span>
        [<span class="date">{{date}}</span>]:
      </span>
      <span class="message">{{message}}</span>
    </div>
  `);

  function renderProducts(products = []) {
    productsExists = !!products.length;
    const html = productsTemplate({products, productsExists: !!products.length});
    productsTable.innerHTML = html;
  }

  function renderProduct(product) {
    if (productsExists) {
      const html = productTemplate({...product});
      productsTable.querySelector('.grid').insertAdjacentHTML('beforeend', html);
    } else {
      const html = firstProductTemplate({...product});
      productsTable.innerHTML = html;
      productsExists = true;
    }
  }

  const author = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
  const message = new normalizr.schema.Entity('message', {
      author: author
  });
  const messagesCenter = new normalizr.schema.Entity('messagesCenter', {
      authors: [author],
      messages: [message]
  });

  function renderMessages(messages = null) {
    const normalizedLength = JSON.stringify(messages).length;
    const data = normalizr.denormalize(messages.result, messagesCenter, messages.entities);
    const denormalizedLength = JSON.stringify(data).length;
    const messagesToDisplay = data.messages;
    const html = messagesTemplate({messages: messagesToDisplay, messagesExists: !!messagesToDisplay.length});
    messagesCtn.innerHTML = html;
    messagesCtn.scrollTop = messagesCtn.scrollHeight;
    compressionTitle.innerHTML = `(Compresión: ${Math.floor(100 * normalizedLength / denormalizedLength)}%)`;
  }

  function renderMessage(message) {
    const html = messageTemplate({...message});
    messagesCtn.insertAdjacentHTML('beforeend', html);
    messagesCtn.scrollTop = messagesCtn.scrollHeight;
  }

  socket.on('products', renderProducts);

  socket.on('product', renderProduct);

  socket.on('messages', renderMessages);

  socket.on('message', renderMessage);

  productForm.addEventListener('submit', event => {
    event.preventDefault();
    const title = productTitleInput.value;
    const price = productPriceInput.value;
    const thumbnail = productThumbnailInput.value;
    socket.emit('productAdd', {title, price, thumbnail});
    productForm.reset();
  });

  chatForm.addEventListener('submit', event => {
    event.preventDefault();
    const data = {
      author: {
        email: chatEmailInput.value,
        name: chatNameInput.value,
        surname: chatSurnameInput.value,
        age: chatAgeInput.value,
        alias: chatAliasInput.value,
        avatar: chatAvatarInput.value
      },
      message: chatMessageInput.value,
    }
    socket.emit('message', data);
    chatMessageInput.value = '';
  });
}
