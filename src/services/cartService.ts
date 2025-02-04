// import { addItemToCart } from './cartService';
import { cartModel } from "../models/cartModel";
import productModel from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({ userId, totalAmount: 0 });
  await cart.save();
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
}

export const getActiveCartForUser = async ({ userId }: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCartForUser({ userId });
  }

  return cart;
};

interface AddItemToCart {
  userId: string;
  productID: any;
  quantity: number;
}

export const addItemToCart = async ({ userId, productID, quantity }: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existingItemInCart = cart.items.find((p) => p.product.toString() === productID);

  if (existingItemInCart) {
    return { data: "Item already exists in cart", statusCode: 400 };
  }
// Fetch the product 
  const product = await productModel.findById(productID);

  if (!product) {
    return { data: "Product not found", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock for item", statusCode: 400 };
  }

  cart.items.push({ product: productID, unitPrice: product.price, quantity });

  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface UpdateItemInCart {
  productId: any;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({ productId, quantity, userId, }: UpdateItemInCart) => {
  // Retrieve the active cart for the user
  const cart = await getActiveCartForUser({ userId });

  // Check if the product exists in the cart
  const existsInCart = cart.items.find(
    (p) => p.product.toString() === productId
  );

  // If the product does not exist, return an error response
  if (!existsInCart) {
    return { data: "Item does not exist in cart", statusCode: 400 };
  }
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock for item", statusCode: 400 };
  }

  // Update the quantity of the existing product in the cart
  existsInCart.quantity = quantity;


  // Get all other cart items excluding the updated product
  const otherCartItems = cart.items.filter(
    (p) => p.product.toString() !== productId
  );

  // Calculate the total amount of the cart excluding the updated product
  let total = otherCartItems.reduce((sum, product) => {
    sum += product.quantity * product.unitPrice;
    return sum;
  }, 0);

  // Update the quantity of the existing item in the cart
  existsInCart.quantity = quantity;

  // Add the updated product's total price to the cart's total amount
  total += existsInCart.quantity * existsInCart.unitPrice;

  cart.totalAmount = total;
  // Save the updated cart to the database
  const updatedCart = await cart.save();

  // Return the updated cart data with a success status code
  return { data: updatedCart, statusCode: 200 };
};
