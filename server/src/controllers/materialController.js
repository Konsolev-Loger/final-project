const MaterialService = require('../services/materialService')
const formatResponse = require('../utils/formatResponse')

class MaterialController {
    static async getAll(req, res) {
    try {
      const materials = await MaterialService.getAll();
      if (!materials)
        return res
          .status(404)
          .json(formatResponse(404, 'Материалы не найдены', null));
      return res.status(200).json(formatResponse(200, 'Материалы получены', materials, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async getOne(req,res) {
    const { id } = req.params;

    try {
        const oneMaterial = await MaterialService.getById(id)
        if(!oneMaterial)
        return res
          .status(404)
          .json(formatResponse(404, 'Материал не найден', null));
     return res.status(200).json(formatResponse(200, 'Материал получен', oneMaterial, null));     
    } catch (error) {
     return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));   
    }
  }

  static async createMaterial(req, res) {
    const { category_id, name, title, price, is_popular, img } = req.body;
    try {
      const createNewMaterial = await MaterialController.createMaterial({ category_id, name, title, price, is_popular, img });
      return res.status(201).json(formatResponse(201, 'Материал создан', createNewMaterial, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async updateMaterial(req, res) {
    const { category_id, name, title, price, is_popular, img } = req.body;
    const { id } = req.params;
    try {
      const updateThisMaterial = await MaterialService.update({ id }, { category_id, name, title, price, is_popular, img });
      return res.status(200).json(formatResponse(200, 'Материал обновлён', updateThisMaterial, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }

  static async deleteMaterial(req, res) {
    const { id } = req.params;
    try {
      const deleteThisMaterial = await MaterialService.delete({ id });
      if (!deleteThisMaterial)
        return res
          .status(404)
          .json(formatResponse(404, 'Материал не найден', null));
      return res.status(200).json(formatResponse(200, 'Материал удалён', deleteThisMaterial, null));
    } catch (error) {
      return res.status(500).json(formatResponse(500, 'Ошибка сервера', null, error));
    }
  }
}

module.exports = MaterialController
