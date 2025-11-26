const CategoryService = require('../services/categoryService');
const formatResponse = require('../utils/formatResponse');

class CategoryController {
  static async getAllCategories(req, res) {
    try {
      const categories = await CategoryService.getAll();
      if (!categories)
        return res.status(404).json(formatResponse(404, 'Категорий нет', null));
      return res
        .status(200)
        .json(formatResponse(200, 'Категории получены', categories, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async createCategory(req, res) {
    const { name } = req.body;
    try {
      const newCategory = await CategoryService.create({ name });
      return res
        .status(201)
        .json(formatResponse(201, 'Категория создана', newCategory, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async updateCategory(req, res) {
    const { name } = req.body;
    const { id } = req.params;
    try {
        const upCategory = await CategoryService.update({ id }, { name });
        return res.status(200).json(formatResponse(200, 'Категория обновлена', upCategory, null));
    } catch (error) {
        return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async deleteCategory(req, res) {
    const { id } = req.params
    try {
       const delCategory = await CategoryService.delete({ id }) 
       return res.status(200).json(formatResponse(200, 'Категория удалена', delCategory, null));
    } catch (error) {
        return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error)); 
    }
  }
}

module.exports = CategoryController