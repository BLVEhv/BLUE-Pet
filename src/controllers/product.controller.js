import inventory from '../models/inventory.model.js';
import { Product, PRODUCT } from '../models/product.model.js';
import User from '../models/user.model.js';

class ProductController {
	createProduct = async (req, res, next) => {
		try {
			const {
				product_name,
				product_price,
				product_quantity,
				product_descripton,
				product_type,
			} = req.body;
			const user = await User.findOne({ email: req.user.email });
			if (!product_name) {
				throw new Error('Name is requried!');
			}
			if (!req.file) {
				throw new Error('Thumbnail is requried!');
			}
			if (!product_price) {
				throw new Error('Price is requried!');
			}
			if (!product_quantity) {
				throw new Error('Quantity is requried!');
			}
			const isValidType = Object.values(PRODUCT).includes(product_type);
			if (!isValidType) {
				throw new Error('Type is invalid!');
			}
			const newProduct = await Product.create({
				product_name: product_name,
				product_thumb: req.file.filename,
				product_price: product_price,
				product_quantity: product_quantity,
				product_descripton: product_descripton || '',
				product_admin: user._id,
				product_type: product_type,
				product_ratingAverage: 1.0,
				isDraft: true,
				isPublish: false,
			});
			return res.send(newProduct);
		} catch (e) {
			console.log(e);
			return res
				.status(e.status || 500)
				.json({ status: e.status, message: e.message });
		}
	};
	updateProduct = async (req, res, next) => {
		try {
			const {
				product_name,
				product_price,
				product_quantity,
				product_descripton,
			} = req.body;
			const id = req.params.id;

			const product = await Product.findById({ _id: id });
			if (!product) {
				throw new Error('Product is not exist!');
			}

			if (product_name) {
				product.product_name = product_name;
			}
			if (product_price) {
				product.product_name = product_price;
			}
			if (product_quantity) {
				product.product_name = product_quantity;
			}
			if (product_descripton) {
				product.product_name = product_descripton;
			}
			if (req.file) {
				product.product_thumb = req.file.filename;
			}
			await product.save();

			return res.send({ message: 'success', result: product });
		} catch (e) {
			console.log(e);
			return res
				.status(e.status || 500)
				.json({ status: e.status, message: e.message });
		}
	};
}

export default new ProductController();
