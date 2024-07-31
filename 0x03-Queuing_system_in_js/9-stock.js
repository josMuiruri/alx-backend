const express = require("express");
const redis = require("redis");
const app = express();
const port = 1245;

// Connect to Redis
const client = redis.createClient();

// Handle Redis connection errors
client.on("error", (err) => {
  console.error("Redis error:", err);
});

// List of products
const listProducts = [
  { id: 1, name: "Suitcase 250", price: 50, stock: 4 },
  { id: 2, name: "Suitcase 450", price: 100, stock: 10 },
  { id: 3, name: "Suitcase 650", price: 350, stock: 2 },
  { id: 4, name: "Suitcase 1050", price: 550, stock: 5 },
];

// Helper function to get item by ID
function getItemById(id) {
  return listProducts.find((product) => product.id === id);
}

// Route to get list of products
app.get("/list_products", (req, res) => {
  const products = listProducts.map(({ id, name, price, stock }) => ({
    itemId: id,
    itemName: name,
    price,
    initialAvailableQuantity: stock,
  }));
  res.json(products);
});

// Helper function to reserve stock in Redis
function reserveStockById(itemId, stock) {
  return new Promise((resolve, reject) => {
    client.set(`item.${itemId}`, stock, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

// Helper function to get current reserved stock from Redis
async function getCurrentReservedStockById(itemId) {
  return new Promise((resolve, reject) => {
    client.get(`item.${itemId}`, (err, stock) => {
      if (err) reject(err);
      resolve(parseInt(stock, 10) || 0);
    });
  });
}

// Route to get product details by ID
app.get("/list_products/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);
  if (!product) {
    return res.json({ status: "Product not found" });
  }
  const reservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = product.stock - reservedStock;
  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: availableStock,
  });
});

// Route to reserve a product
app.get("/reserve_product/:itemId", async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);
  if (!product) {
    return res.json({ status: "Product not found" });
  }
  const reservedStock = await getCurrentReservedStockById(itemId);
  const availableStock = product.stock - reservedStock;
  if (availableStock <= 0) {
    return res.json({ status: "Not enough stock available", itemId });
  }
  await reserveStockById(itemId, reservedStock + 1);
  res.json({ status: "Reservation confirmed", itemId });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
