const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      quantity: { type: Number, required: true, default: 1 },
     
    }
  ],
  totalPrice: { type: Number }, // Removed "required: true"
}, { timestamps: true });

// Calculate total price before saving
OrderSchema.pre("save", async function (next) {
  const products = this.products;
  let total = 0;

  for (const item of products) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) total += product.price * item.quantity;
  }

  this.totalPrice = total;
  next();
});

module.exports = mongoose.model("Order", OrderSchema);
