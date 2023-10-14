const express = require('express');
const router = express.Router();
const path = require('path');
const models = require('../db/models');

router.get('/download/:id', async (req, res) => {
    const fileId = req.params.id;

    const attachment = await models.attachments.findOne({where: {id: fileId}});

    const filePath = path.join(attachment.attachment_path);

    if (attachment.attachment_type_id === 1) {
        res.setHeader('Content-Type', 'audio/mpeg');
    }

    res.download(filePath, (err) => {
        if (err) {
            console.error('Ошибка при скачивании файла:', err);
            // res.status(500).send('Ошибка при скачивании файла');
        }
    });
});

module.exports = router;
