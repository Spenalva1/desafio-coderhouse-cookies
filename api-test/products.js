import faker from 'faker';

faker.locale = 'es';

class ProductTestController {
  constructor() {}

  async findAll(quantity) {
    return new Array(quantity).fill(null).map((e) => ({
        title: faker.commerce.productName(), 
        price: faker.commerce.price(), 
        thumbnail: faker.image.image(), 
    }));
  }
}

const productTestController = new ProductTestController();

export default productTestController;
