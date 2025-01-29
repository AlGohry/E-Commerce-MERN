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

  // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
  const existingItemInCart = cart.items.find((p) => p.product.toString() === productID);

  if (existingItemInCart) {
    return { data: "Item already exists in cart", statusCode: 400 };
  }

  const product = await productModel.findById(productID);
  if (!product) {
    return { data: "Product not found", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Insufficient stock for item", statusCode: 400 };
  }

  // إضافة المنتج إلى السلة
  cart.items.push({ product: productID, unitPrice: product.price, quantity });

  // تحديث إجمالي السعر
  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};


