const Router = require('express').Router;
const router = new Router();
const ChatController = require('../controllers/ChatController');

router.post('/create', ChatController.create);
router.get('/get/:id', ChatController.get);

module.exports = router;