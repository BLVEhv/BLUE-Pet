import { cart } from "../models/cart.model.js";
import { pet } from "../models/pet.model.js";
import { product } from "../models/product.model.js";

const getProductById = async (id) => {
  return await product.findOne({ _id: id }).lean();
};
const getPetById = async (id) => {
  return await pet.findOne({ _id: id }).lean();
};

const checkProduct = async (products) => {
  try {
    return await Promise.all(
      products.map(async (prod) => {
        const foundProduct = await getProductById(prod.productId);
        if (foundProduct) {
          return {
            price: foundProduct.product_price,
            quantity: prod.quantity,
            productId: prod.productId,
            name: prod.name,
          };
        }
        const foundPet = await getPetById(prod.productId);
        if (foundPet) {
          return {
            price: foundPet.pet_price,
            quantity: prod.quantity,
            productId: prod.productId,
            name: prod.name,
          };
        }
      })
    );
  } catch (err) {
    console.error(err);
  }
};

class CheckOutConTroller {
  checkOutReview = async (req, res, next) => {
    try {
      const foundCart = await cart.findOne({
        _id: req.body.cartId,
        cart_status: "active",
      });
      if (!foundCart) {
        throw new Error("Cart is not exist!");
      }
      const checkOutOrder = {
        totalPrice: 0,
        feeShip: 30,
        totalCheckOut: 0,
      };

      const checkProductByServer = await checkProduct(req.body.cart_products);
      console.log("", checkProductByServer);
      if (!checkProductByServer[0]) {
        throw new Error("Order Wrong!");
      }

      //total price
      const checkOutPrice = checkProductByServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      //total before solve
      checkOutOrder.totalPrice += checkOutPrice;

      //total checkout
      checkOutOrder.totalCheckOut =
        checkOutOrder.totalPrice + checkOutOrder.feeShip;
      res.send(checkOutOrder);
    } catch (err) {
      next(err);
    }
  };
}

export default new CheckOutConTroller();
