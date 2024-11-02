const Users = require('../model/userModel')

const authAdmin = async (req, res, next) => {
  try {
    //get user informatin by id
    const user = await Users.findById({ _id: req.user.id })
    if(user.role===0){
      return res.status(400).json({msg:"you are not authorized to access this page (not admin)"});
    }
    next();
  }
  catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
module.exports = authAdmin;