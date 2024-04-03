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

// Helper function to sort the products
const sortProducts = (products, sortParam, sortOrder) => {
    return products.sort((a, b) => {
      let valueA = a[sortParam];
      let valueB = b[sortParam];
  
      // Assuming all values exist and are of the same type
      if (sortOrder === 'asc') {
        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
      } else {
        return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
      }
    });
  };
  
  
  app.get('/categories/:categoryname/products', async (req, res) => {
    const { categoryname } = req.params;
    const { company, n, page = 1, sort = 'price', order = 'asc', minPrice, maxPrice } = req.query;
  
    try {
      const products = await fetchProducts(categoryname, company, sort, order, minPrice, maxPrice);
    
      const sortedProducts = sortProducts(products, sort, order);
  
      const pageSize = parseInt(n);
      const pageNumber = parseInt(page);
      const paginatedProducts = sortedProducts.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  
      res.json({
        page: pageNumber,
        pageSize: pageSize,
        totalProducts: sortedProducts.length,
        products: paginatedProducts
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
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