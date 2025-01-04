'use strict';

import mongoose from 'mongoose';

export const PRODUCT = {
	PET: 'pet',
	FOOD: 'food',
	SAND: 'sand',
	ACCESSORY: 'accessory',
};

const Schema = mongoose.Schema;

const productSchema = new Schema({
	product_name: { type: String, default: '', required: true },
	product_thumb: { type: String, default: '', required: true },
	product_price: { type: Number, default: '', required: true },
	product_quantity: { type: Number, default: 0, required: true },
	product_descripton: String,
	product_admin: String,
	product_type: { type: String, enum: Object.values(PRODUCT) },
	product_ratingAverage: {
		type: Number,
		default: 4,
		min: [1, 'Rating must be above 1.0'],
		max: [5, 'Rating must be behind 5.0'],
		set: (val) => Math.round(val * 10) / 10,
	},
	isDraft: { type: Boolean, default: true },
	isPublish: { type: Boolean, default: false },
});

// Schema.statics.PRODUCT = PRODUCT;

const Product = mongoose.model('Product', productSchema);

export { Product };
