import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import Category from '../../models/category.js';
import path from 'path';
import fs from 'fs';
 import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ITEMS_PER_PAGE = 4;
 

const getCategories = async (req, res) => {
  try {

    const search = req.query.search || '';
    const currentPage = parseInt(req.query.page) || 1;
 
    const query = search
      ? { name: { $regex: search, $options: 'i' } }
      : {};
 
    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / ITEMS_PER_PAGE);
 
    const category = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
 
    res.render('admin/category', {
      category,
      currentPage,
      totalPages,
      limit: ITEMS_PER_PAGE,
      search,
      // successMessage: req.flash('success'),
      // errorMessage: req.flash('error'),
    });
  } catch (error) {
    console.error('getCategories error:', error);
    res.redirect('/admin/error');
  }
};
 

// const getCategoryById = async (req, res) => {
//   try {
//     const category = await Category.findById({id:req.params.id});
//     if (!category) {
//       req.flash('error', 'Category not found');
//       return res.redirect('admin/category');
//     }
//     res.render('/admin/category', { category });
//   } catch (error) {
//     console.error('getCategoryById error:', error);
//     res.redirect('admin/category');
//   }
// };

const getAddCategory = (req, res) => {
  
  
  res.render('admin/addCategory', {
    errorMessage: req.flash('error'),
  });
};
 

const postAddCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
 
    // Check duplicate
    const existing = await Category.findOne({
      name: { $regex: `^${name}$`, $options: 'i' },
    });
    if (existing) {
      req.flash('error', 'Category already exists');
      return res.redirect('/admin/category/add');
    }
 
    const image = req.file ? req.file.filename : null;
 
    await Category.create({ name, description, image, isListed: true });
 
    req.flash('success', 'Category added successfully');
    res.redirect('/admin/category');
  } catch (error) {
    console.error('postAddCategory error:', error);
    req.flash('error', 'Something went wrong');
    res.redirect('/admin/category/add');
  }
};

const getEditCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/admin/category');
    }
    res.render('admin/editCategory', {
      category,
      errorMessage: req.flash('error'),
    });
  } catch (error) {
    console.error('getEditCategory error:', error);
    res.redirect('/admin/category');
  }
};
 

const postEditCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
 
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/admin/category');
    }
 
   
    const duplicate = await Category.findOne({
      _id: { $ne: req.params.id },
      name: { $regex: `^${name}$`, $options: 'i' },
    });
    if (duplicate) {
      req.flash('error', 'Another category with this name already exists');
      return res.redirect(`/admin/category/${req.params.id}/edit`);
    }
 
    
    if (req.file) {
      if (category.image) {
        const oldPath = path.join(__dirname, '../public/uploads/category', category.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      category.image = req.file.filename;
    }
 
    category.name = name;
    category.description = description;
    await category.save();
 
    req.flash('success', 'Category updated successfully');
    res.redirect('/admin/category');
  } catch (error) {
    console.error('postEditCategory error:', error);
    req.flash('error', 'Something went wrong');
    res.redirect(`/admin/category/${req.params.id}/edit`);
  }
};

const listCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isListed: true });
    req.flash('success', 'Category listed');
    res.redirect('/admin/category');
  } catch (error) {
    console.error('listCategory error:', error);
    res.redirect('/admin/category');
  }
};
 
const unlistCategory = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { isListed: false });
    req.flash('success', 'Category unlisted');
    res.redirect('/admin/category');
  } catch (error) {
    console.error('unlistCategory error:', error);
    res.redirect('/admin/category');
  }
};
 

const getAddOffer = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      req.flash('error', 'Category not found');
      return res.redirect('/admin/category');
    }
    res.render('admin/addCategoryOffer', {
      category,
      errorMessage: req.flash('error'),
    });
  } catch (error) {
    console.error('getAddOffer error:', error);
    res.redirect('/admin/category');
  }
};
 

const postAddOffer = async (req, res) => {
  try {
    const { offer } = req.body;
    const offerValue = parseInt(offer);
 
    if (isNaN(offerValue) || offerValue < 1 || offerValue > 100) {
      req.flash('error', 'Offer must be between 1 and 100');
      return res.redirect(`/admin/category/${req.params.id}/add-offer`);
    }
 
    await Category.findByIdAndUpdate(req.params.id, { offer: offerValue });
    req.flash('success', `${offerValue}% offer applied`);
    res.redirect('/admin/category');
  } catch (error) {
    console.error('postAddOffer error:', error);
    res.redirect('/admin/category');
  }
};
 

const removeOffer = async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id, { offer: 0 });
    req.flash('success', 'Offer removed');
    res.redirect('/admin/category');
  } catch (error) {
    console.error('removeOffer error:', error);
    res.redirect('/admin/category');
  }
};
 

export default {
  getCategories,
  // getCategoryById,
  getAddCategory,
  postAddCategory,
  getEditCategory,
  postEditCategory,
  listCategory,
  unlistCategory,
  getAddOffer,
  postAddOffer,
  removeOffer,
};