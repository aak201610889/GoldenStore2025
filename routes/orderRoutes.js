const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
router.post("/order", orderController.createOrder);
router.get("/orders",auth,authAdmin, orderController.getOrder);
router.delete("/order/:orderId",auth,authAdmin, orderController.deleteOrder);

module.exports = router;
