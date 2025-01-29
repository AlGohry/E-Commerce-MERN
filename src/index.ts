import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import cartRoute from "./routes/cartRoute";
import productRoute from "./routes/productRoute";
import { seedInitialProducts } from "./services/productService";

const app = express();
const port = 3001;

app.use(express.json())

mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Seed the products to database
seedInitialProducts();


app.use('/user', userRoute)
app.use('/product', productRoute)
app.use('/cart', cartRoute)

app.listen(port, () => {
  console.log(`Sevrer is running at: http://localhost:${port}`)
})