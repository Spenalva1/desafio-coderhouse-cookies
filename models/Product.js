import mongoose from '../DB/connection.js'

const schema = mongoose.Schema({
  title: { type: String, require: true, max: 100 },
  price: { type: Number, require: true },
  thumbnail: { type: String, require: true, max: 300 }
});

const Product = mongoose.model('products', schema);

export default Product;