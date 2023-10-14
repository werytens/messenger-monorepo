const Router = require('express').Router;
const router = new Router();
const userRouter = require('./userRouter.js');
const chatRouter = require('./chatRouter.js');
const messageRouter = require('./messageRouter.js');
const fileuploadRouter = require('./fileuploadRouter.js');
const fileloadRouter = require('./fileloadRouter.js');

router.use('/users', userRouter);
router.use('/chats', chatRouter);
router.use('/messages', messageRouter);
router.use('/files', fileuploadRouter);
router.use('/files', fileloadRouter)

module.exports = router;