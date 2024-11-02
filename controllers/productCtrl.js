const Products = require("../model/productModel");
// Filter, sorting and paginating
class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

filtering() {
  const queryObj = { ...this.queryString };

  const excludedFields = ["page", "sort", "limit"];
  excludedFields.forEach((el) => delete queryObj[el]);

  // Handle search query
  if (queryObj.search && queryObj.search.trim() !== "") {
    queryObj.title = { $regex: queryObj.search, $options: "i" }; // Case-insensitive search
    delete queryObj.search;
  }

  // Handle category filter (example)
  if (queryObj.category && queryObj.category.trim() !== "") {
    queryObj.category = queryObj.category; // Assuming category filtering is done here
    delete queryObj.category;
  }

  // If both search and category are empty, return all products
  if (Object.keys(queryObj).length === 0) {
    this.query = this.query.find(); // Return all products
    return this;
  }

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(
    /\b(gte|gt|lt|lte|regex)\b/g,
    (match) => "$" + match
  );

  this.query.find(JSON.parse(queryStr));

  return this;
}

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    try {
      const features = new APIfeatures(Products.find(), req.query)
        // .filtering()
        // .sorting()
        // .paginating();

      const products = await features.query;

      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

 createProduct : async (req, res) => {
  try {
    console.log("Received request to create product");

    // Log incoming request data
    console.log("Body:", req.body);
    console.log("File:", req.file);

    // Get the uploaded image path
    const uploadedImage = req.file?.path || "";

    // Extract fields from the request body
    const {
      product_id,
      title,
      price,
      description,
      content,
      images: bodyImages, // Images from body (if any)
      category,
    } = req.body;

    // Determine the final image path
    const images = uploadedImage || bodyImages; // Use uploaded image if available, otherwise use image from body

    // Check if images are provided
    if (!images) {
      return res.status(400).json({ msg: "No image uploaded" });
    }

    // Check if the product already exists
    const existingProduct = await Products.findOne({ product_id });
    if (existingProduct) {
      return res.status(400).json({ msg: "This product already exists." });
    }

    // Create new product
    const newProduct = new Products({
      product_id,
      title: title.toLowerCase(),
      price,
      description,
      content,
      images, // Final image value, whether from file or body
      category,
    });

    // Save the product to the database
    await newProduct.save();
    res.json({ msg: "Product created successfully" });
  } catch (err) {
    console.error("Error creating product:", err.message);
    return res.status(500).json({ msg: err.message });
  }
},



  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
    
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, content, images, category } = req.body;
      if (!images) return res.status(400).json({ msg: "No image upload" });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title,
          price,
          description,
          content,
          images,
          category,
        }
      );

      res.json({ msg: "Updated a Product" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};
module.exports = productCtrl;
