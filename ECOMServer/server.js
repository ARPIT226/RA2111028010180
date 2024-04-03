require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 9876;

const fetchProducts = async (category, company, page, size, sort, direction) => {
  return [
    { id: 1, name: 'Product 1', price: 100, rating: 4.5, company: 'AMZ' },
  ];
};

app.get('/categories/:category/products', async (req, res) => {
  const { category } = req.params;
  const { n, page = 1, sort = 'price', direction = 'asc' } = req.query;

  try {
    const products = await fetchProducts(category, undefined, page, n, sort, direction);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
});

app.get('/categories/:category/products/:productId', async (req, res) => {
  const { productId } = req.params;
  
  try {
    const products = await fetchProducts(); // Fetch all products and filter by ID
    const product = products.find(p => p.id === parseInt(productId));

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
});

app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');
});