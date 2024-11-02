const Category = require('../model/categoryModel');

const categoryCtrl = {
  getCategories: async (req, res) => { 
    try {
      const categories = await Category.find();
      res.json(categories);
    }
    catch (err) {
      res.status(500).json({msg:err.message});
      }
  },
  createCategory: async (req, res) => {
    try {
      //if user have role=1 ---> admin
      // only admin can create,delete and update category
      const { name } = req.body;
     
      const category = await Category.findOne({ name });
      if (category) {
        res.status(400).json({ msg: 'category already exist' });
      }
      else{

        const newCategory = new Category({ name });
        await newCategory.save();
        res.json({ msg: 'category created' });
      }
    }
    
    catch (err) {
      res.status(500).json({msg:err.message});
    }
  },


// In your category controller
createCategory2: async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findOne({ name });
    if (category) {
      res.status(400).json({ msg: 'Category already exists' });
    } else {
      const newCategory = new Category({ name });
      await newCategory.save();
      res.json({ msg: 'Category created' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
},

// New endpoint to check for existing categories
checkCategories: async (req, res) => {
  try {
    const { categories } = req.body;
    const existingCategories = await Category.find({ name: { $in: categories } }).select('name');

    // Extract existing category names
    const existingNames = existingCategories.map(cat => cat.name);
    res.json(existingNames);
  } catch (error) {
    res.status(500).json({ msg: 'Server error' });
  }
},




  deleteCategory: async (req, res) => {
  
    try { 
      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: 'category deleted' });
    }
    catch (err) {
      res.status(500).json({msg:err.message});
    }
  },
  updateCategory: async (req, res) => {
  
    try { 
      const { name } = req.body;
      await Category.findByIdAndUpdate({ _id: req.params.id }, { name });
      res.json({ msg: 'category updated' });
    }
    catch (err) {
      res.status(500).json({msg:err.message});
    }
  }
};


module.exports = categoryCtrl;