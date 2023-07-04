"use strict";
import { cart } from "../models/cart.model.js";

class CartController {
  static async createUserCart({ userId, product }) {
    const query = { _id: userId, cart_status: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cart.findByIdAndUpdate(query, updateOrInsert, options);
  }

  static async updateCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
        _id: userId,
        "cart_products._id": productId,
        cart_status: "active",
      },
      updateSet = {
        $in: { "cart_products.quantity": quantity },
      },
      options = { upsert: true, new: true };

    return await cart.findByIdAndUpdate(query, updateSet, options);
  }

  static async addToCart({ userId, product }) {
    const userCart = await cart.findOne({ _id: userId });
    if (!userCart) {
      return await this.createUserCart(userId, product);
    }
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    return await this.updateCartQuantity({ userId, product });
  }
}

export default CartController;
