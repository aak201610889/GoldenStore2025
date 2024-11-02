const Payments = require('../model/paymentModel')
const Users = require('../model/userModel')
const Products = require('../model/productModel')

const paymentCtrl = {
  getPayments: async (req, res) => { 
    try {
      const payments = await Payments.find()
      res.json(payments)

      }
    catch (err) { return res.status(500).json({ message: err.message }) }
  },
  createPayment: async (req, res) => { 
    try { 
      const user = await Users.findById(req.user.id).select('name email')
      if (!user)
        return res.status(404).json({ message: 'User not found' })
      
      const { cart, paymentID, address } = req.body;
      const { _id, name, email } = user;
      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,


      })
      res.json({newPayment})
    }

    catch (err) { return res.status(500).json({ message: err.message }) }
  }
}
module.exports = paymentCtrl