const Router = require('express').Router;
const router = new Router();
const MessagesController = require('../controllers/MessagesController');

router.post('/send', MessagesController.send);
router.delete('/delete', MessagesController.delete);
router.put('/edit', MessagesController.edit);
router.put('/makeChecked', MessagesController.makeChecked);
router.get('/get/:id', MessagesController.get);
router.get('/getLast/:id', MessagesController.getLast);
router.get('/getUnchecked/:chatId', MessagesController.getUnchecked);

router.post('/addAttachment', MessagesController.addAttachment);
router.delete('/deleteAttachment', MessagesController.deleteAttachment);
router.get('/getAttachment/:id', MessagesController.getAttachment);

router.get('/nextid', MessagesController.nextId)


module.exports = router;