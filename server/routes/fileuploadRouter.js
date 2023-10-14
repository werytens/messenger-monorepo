const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const models = require('../db/models')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'attachments'); // Папка, где будут храниться загруженные файлы
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Файл не был загружен.' });
    }

    const filePath = req.file.path;
    const attachmentsCount = await models.attachments.findAll();
    res.json({ id: attachmentsCount.length, filePath });
});

module.exports = router;