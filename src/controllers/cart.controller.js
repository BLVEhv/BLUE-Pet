'use strict';
import { cart } from '../models/cart.model.js';
import User from '../models/user.model.js';
import { Product } from './../models/product.model.js';

const createUserCart = async ({ userId, product }) => {
	try {
		const query = { _id: userId, cart_status: 'active' },
			updateOrInsert = {
				$addToSet: {
					cart_products: product,
				},
			},
			options = { upsert: true, new: true };
		return await cart.findByIdAndUpdate(query, updateOrInsert, options);
	} catch (err) {
		console.log(err);
	}
};

const updateCartQuantity = async ({ userId, product }) => {
	try {
		const { productId, quantity } = product;
		const query = {
			_id: userId,
			'cart_products.productId': productId,
			cart_status: 'active',
		};

		// Tìm và kiểm tra phần tử trong mảng
		const foundCart = await cart.findOne(query);
		if (!foundCart) {
			throw new Error('User cart not found or product not in cart!');
		}

		const cartProductIndex = foundCart.cart_products.findIndex(
			(item) => item.productId === productId,
		);

		if (cartProductIndex === -1) {
			throw new Error("Product not found in user's cart!");
		}

		// Cập nhật số lượng
		const updateSet = {
			$inc: { [`cart_products.${cartProductIndex}.quantity`]: quantity },
		};

		const options = { upsert: true, new: true };

		return await cart.findOneAndUpdate(query, updateSet, options);
	} catch (err) {
		console.log(err);
	}
};

class CartController {
	addToCart = async (req, res, next) => {
		try {
			const user = await User.findOne({ email: req.user.email });
			const userCart = await cart.findOne({ _id: user._id });
			if (!userCart) {
				const newCart = await createUserCart({
					userId: user._id,
					product: req.body.product,
				});
				res.send(newCart);
			}
			if (userCart.cart_products.length === 0) {
				await userCart.updateOne({
					$addToSet: {
						cart_products: req.body.product,
					},
				});
				return res.send('Add success');
			}
			const productId = req.body.product.productId;
			const existProduct = userCart.cart_products.find((item) => {
				item.productId === productId;
			});
			if (existProduct) {
				const updateCart = await updateCartQuantity({
					userId: user._id,
					product: req.body.product,
				});
				res.send(updateCart);
			} else {
				await userCart.updateOne({
					$addToSet: {
						cart_products: req.body.product,
					},
				});
				return res.send('Add success');
			}
		} catch (err) {
			next(err);
		}
	};

	updateToCart = async (req, res, next) => {
		try {
			const user = await User.findOne({ email: req.user.email });
			const userCart = await cart.findOne({ _id: user._id });
			const { productId, quantity } = req.body.product;
			const foundProduct = await product.findOne({ _id: productId });
			if (!foundProduct) {
				throw new Error('Product not found!');
			}

			const cartProductIndex = userCart.cart_products.findIndex(
				(item) => item.productId === productId,
			);

			if (cartProductIndex === -1) {
				throw new Error("Product not found in user's cart!");
			}

			let updatedQuantity =
				userCart.cart_products[cartProductIndex].quantity + quantity;
			if (updatedQuantity < 0) {
				updatedQuantity = 0;
			}

			const updateSet = {};

			// Nếu updatedQuantity = 0, xoá product khỏi cart
			if (updatedQuantity === 0) {
				updateSet.$pull = {
					cart_products: {
						productId: productId,
					},
				};
				userCart.cart_products.splice(cartProductIndex, 1);
			} else {
				updateSet.$set = {
					[`cart_products.${cartProductIndex}.quantity`]: updatedQuantity,
				};
			}

			const options = { upsert: true, new: true };

			const updatedCart = await cart.findOneAndUpdate(
				{ _id: user._id, cart_status: 'active' },
				updateSet,
				options,
			);

			res.send(updatedCart);
		} catch (err) {
			next(err);
		}
	};

	deleteFromCart = async (req, res, next) => {
		const user = await User.findOne({ email: req.user.email });
		const query = { _id: user._id, cart_status: 'active' },
			updateSet = {
				$pull: {
					cart_products: {
						productId: req.body.product.productId,
					},
				},
			};
		const deleteCart = await cart.updateOne(query, updateSet);
		res.send(deleteCart);
	};

	getListUserCart = async (req, res, next) => {
		const listCart = await cart.find().lean();
		res.send(listCart);
	};
}

export default new CartController();
