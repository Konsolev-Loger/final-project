const materialRouter = require('express').Router();
const MaterialController = require('../controllers/materialController')

materialRouter.get('/', MaterialController.getAll);
materialRouter.get('/:id', MaterialController.getOne);
materialRouter.post('/', MaterialController.createMaterial);
materialRouter.put('/:id', MaterialController.updateMaterial);
materialRouter.delete('/:id', MaterialController.deleteMaterial);


module.exports = materialRouter