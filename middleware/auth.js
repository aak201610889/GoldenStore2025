const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const token = req.header("authorization")
    if (!token) {
      return res.status(401).json({ msg: "Invalid Authentication1" })
      
    }

    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if(err){
        return res.status(401).json({ msg: "error for Invalid Authentication" })
      }
     
      req.user = user;
      next();
    }
    )
  }
  catch (err) {
    res.status(500).json({msg:err.message});
  }
}

module.exports = auth;