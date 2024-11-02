const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middleware/auth');

router.post('/register', userCtrl.register);
router.post('/login', userCtrl.login);
router.get('/logout', userCtrl.logout);



router.get('/refresh_token', userCtrl.refreshtoken);

// Uncomment these if you plan to use authentication
router.get('/infor', auth, userCtrl.getUser);
router.patch('/addcart', auth, userCtrl.addCart);
router.patch('/createAdmin*2024', auth, userCtrl.createAdmin);

module.exports = router;
