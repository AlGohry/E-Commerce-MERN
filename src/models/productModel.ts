import mongoose, { Schema, Document } from "mongoose";

// Define the product interface
export interface IProduct extends Document {
  title: string;
  image: string;
  price: number;
  stock: number;
}

// Create the product schema
const productSchema = new Schema<IProduct>({
  title: { type: String, required: true }, // Product title
  image: { type: String, required: true }, // Product image URL
  price: { type: Number, required: true }, // Product price
  stock: { type: Number, required: true, default: 0 }, // Product stock (default is 0)
});

// Create the product model
const productModel = mongoose.model<IProduct>("Product", productSchema);

// Export the product model
export default productModel;
