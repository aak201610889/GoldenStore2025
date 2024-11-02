const Order = require("../model/orderModel");


const createOrder = async (req, res) => {
    try {
      const { userName, phoneNumber, products } = req.body;
  
      // Check if required fields are present
      if (!userName || !phoneNumber || !products) {
        console.error("Missing required fields");
        return res.status(400).json({ error: "Missing required fields" });
      }
  
      // Create new order
      const newOrder = new Order({
        userName,
        phoneNumber,
        products,
      });
  
      // Save order
      await newOrder.save();
  
      // Populate the product details in the order response
      await newOrder.populate({
        path: 'products.product',
      });
  
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("Error creating order:", error.message);
      res.status(500).json({ error: "Error creating order", details: error.message });
    }
  };
  

module.exports = { createOrder };


const getOrder = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product") .sort({ createdAt: -1 }); // Sort by createdAt in descending order
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting order" });
  }
};

module.exports = {
  createOrder,
  getOrder,
  deleteOrder,
};
