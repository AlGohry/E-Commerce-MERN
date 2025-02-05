import express from "express";
import { addItemToCart, getActiveCartForUser, updateItemInCart, deleteItemInCart } from "../services/cartService";
import validateJWT from "../middlewares/validateJWT";
import { ExtendRequest } from "../types/extendRequest";

const router = express.Router();

// GET route to retrieve the active cart for a user
router.get("/", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const cart = await getActiveCartForUser({ userId });
  res.status(200).send(cart);
});

// POST route to add an item to the user's cart
router.post("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const { productID, quantity } = req.body;
  const response = await addItemToCart({ userId, productID, quantity });
  res.status(response.statusCode).send(response.data);
});

// PUT route to update the quantity of an item in the cart
router.put("/items", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const { productId, quantity } = req.body;
  const response = await updateItemInCart({ userId, productId, quantity });
  res.status(response.statusCode).send(response.data);
});

// DELETE route to remove an item from the cart using its productId
router.delete("/items/:productId", validateJWT, async (req: ExtendRequest, res) => {
  const userId = req?.user?._id;
  const { productId } = req.params;
  const response = await deleteItemInCart({ userId, productId });
  res.status(response.statusCode).send(response.data);
});

export default router;
