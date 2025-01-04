import { Router } from 'express';
import AdminController from '../controllers/admin.controller.js';
import ProductController from '../controllers/product.controller.js';
import upload from '../middleware/upload.js';
import CartController from '../controllers/cart.controller.js';

const adminRouter = Router();

//adminUser
adminRouter.get('/user/', AdminController.getAllUser);

adminRouter.get('/user/:id', AdminController.getUserById);

adminRouter.put('/user/:id', AdminController.banUserById);

//admin
adminRouter.post('/create-admin', AdminController.createAdmin);

adminRouter.put('/:id', AdminController.resetPasswordById);

//create product
adminRouter.post(
	'/create-product',
	upload.single('product_thumb'),
	ProductController.createProduct,
);

//get all draft product
// adminRouter.get('/draft-product', ProductController.findAllDraft);

// //publish draft product
// adminRouter.put('/draft-product/:id', ProductController.publishDraftById);

//unpublish product
// adminRouter.put(
// 	'/un-publish-product/:id',
// 	ProductController.unPublishDraftById,
// );

//update product
adminRouter.patch(
	'/product/:id',
	upload.single('product_thumb'),
	ProductController.updateProduct,
);

//get list cart
adminRouter.get('/cart', CartController.getListUserCart);
export default adminRouter;
