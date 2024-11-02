const router = require('express').Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const productCtrl = require('../controllers/productCtrl');
const upload=require('../middleware/upload')
const uploadMemory=require('../middleware/upload2')
router.get("/products",productCtrl.getProducts)
router.post("/products",auth,authAdmin,upload.single("images"),productCtrl.createProduct)


router.put('/products/:id',auth,authAdmin,productCtrl.updateProduct)
  router.delete("/products/:id",auth,authAdmin, productCtrl.deleteProduct);


  const XLSX = require("xlsx");
  const Product = require("../model/productModel");
  


  
  router.post("/products/import", uploadMemory.single("file"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "File not provided" });
    }

    try {
        const file = req.file.buffer;
        const workbook = XLSX.read(file, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const products = XLSX.utils.sheet_to_json(worksheet);

        const createdProducts = [];
        const existingProducts = [];

        for (const prod of products) {
            const { product_id, title, price, description, content, images, category } = prod;

            // Check if the product already exists by Product ID or title
            const existingProduct = await Product.findOne({ $or: [{ product_id }, { title }] });
            if (existingProduct) {
                existingProducts.push(existingProduct);
            } else {
                const newProduct = new Product({ product_id, title, price, description, content, images, category });
                await newProduct.save();
                createdProducts.push(newProduct);
            }
        }

        res.json({
            message: `${createdProducts.length} products created, ${existingProducts.length} products already existed.`,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to import products." });
    }
});

  
  

module.exports = router;