const categoryRouter = require('express').Router();
const CategoryController = require('../controllers/categoryController');

categoryRouter.get('/', CategoryController.getAllCategories);
categoryRouter.post('/', CategoryController.createCategory);
categoryRouter.put('/:id', CategoryController.updateCategory);
categoryRouter.delete('/:id', CategoryController.deleteCategory);


module.exports = categoryRouter
