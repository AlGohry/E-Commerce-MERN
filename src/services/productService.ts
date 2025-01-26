import productModel from "../models/productModel";

// Function to retrieve all products from the database
export const getAllProducts = async () => {
  return await productModel.find();
};

// Function to seed initial products into the database
export const seedInitialProducts = async () => {
  const products = [
    { title: "iPhone 14", image: "https://images.unsplash.com/photo-1633470563696-53117b5c2569?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 999, stock: 50 },
    { title: "Samsung Galaxy S23", image: "https://images.unsplash.com/photo-1610450949444-c03e7c9a77d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 899, stock: 40 },
    { title: "MacBook Pro 16", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 2499, stock: 20 },
    { title: "Dell XPS 15", image: "https://images.unsplash.com/photo-1579370318449-d6db1ae10d18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 2199, stock: 30 },
    { title: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1611080611674-7f7b1d7f3f63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 399, stock: 70 },
    { title: "Canon EOS R6", image: "https://images.unsplash.com/photo-1519183071298-a2962f7b62d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 2499, stock: 15 },
    { title: "Apple Watch Series 8", image: "https://images.unsplash.com/photo-1517451330945-3a7dd0c4f3b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 399, stock: 80 },
    { title: "Bose SoundLink", image: "https://images.unsplash.com/photo-1511376777868-611b54f68947?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 229, stock: 60 },
    { title: "Asus ROG Strix", image: "https://images.unsplash.com/photo-1563729784474-40a28f5eaab7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 1799, stock: 25 },
    { title: "Logitech MX Master 3", image: "https://images.unsplash.com/photo-1585657210576-8362b24531fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80", price: 99, stock: 100 },
  ];

  // Check if the database already has products
  const existingProducts = await getAllProducts();

  // If no products exist, insert the initial products
  if (existingProducts.length === 0) {
    await productModel.insertMany(products);
  }
};
