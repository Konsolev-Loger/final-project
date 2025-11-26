const roomRouter = require('express').Router();
const roomController = require('../controllers/roomController');

roomRouter.get('/', roomController.getAll);
roomRouter.post('/', roomController.create);
roomRouter.delete('/:id', roomController.delete);
roomRouter.put('/:id', roomController.update);

module.exports = roomRouter;
