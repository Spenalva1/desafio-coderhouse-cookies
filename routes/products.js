import express from 'express';
import productController from '../api/products.js';
import productTestController from '../api-test/products.js';
import isLoggedIn from '../auth/isLoggedIn.js';

export const routerProductsApi = express.Router();
export const routerProductsView = express.Router();

/* API */
routerProductsApi.get('/listar', async (req, res) => {
  try {
    const products = await productController.findAll();
    if (!products.length) return res.json({ error: 'no hay productos cargados' })
    res.json(products)
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

routerProductsApi.get('/listar/:id', async (req, res) => {
  try {
    const product = await productController.findById(req.params.id);
    if (!product) {
      return res.json({ error: 'producto no encontrado' })
    }
    res.json(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

routerProductsApi.post('/guardar', async (req, res) => {
  try {
    const { title, price, thumbnail } = req.body;
    if (!title || !price || !thumbnail) return res.json({ error: 'faltan parametros' })
    const newProduct = await productController.create({ title, price, thumbnail });
    if (!newProduct) return res.json({ error: 'error al guardar producto' });
    res.redirect('/');
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

routerProductsApi.put('/actualizar/:id', async (req, res) => {
  try {
    const { title, price, thumbnail } = req.body;
    if (!title || !price || !thumbnail) return res.json({ error: 'faltan parametros' });
    const product = await productController.update(req.params.id, { title, price, thumbnail });
    if (!product) {
      return res.json({ error: 'producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});

routerProductsApi.delete('/borrar/:id', async (req, res) => {
  try {
    const product = await productController.delete(req.params.id);
    if (!product) return res.json({ error: 'producto no encontrado' });
    res.json(product);
  } catch (error) {
    return res.status(500).send({ error: error.message });
  }
});
/* API */

/* VIEWS */
routerProductsView.get('/vista', isLoggedIn, async (req, res) => {
  const products = await productController.findAll();
  res.render('products', { products, productsExists: products.length > 0, name: req.cookies.name, nameExists: req.cookies.name?.length > 0 });
})

routerProductsView.get('/vista-test', async (req, res) => {
  const cantParam = Number(req.query?.cant);
  const cant = !isNaN(cantParam) ? cantParam : 10;
  const products = await productTestController.findAll(cant);
  res.render('products', { products, productsExists: products.length > 0 });
})
/* VIEWS */