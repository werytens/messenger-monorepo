const nodemailer = require('nodemailer');

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(to, link) {
        // await this.transporter.sendMail({
        //     from: process.env.SMTP_USER,
        //     to,
        //     subject: 'Активация профиля.',
        //     text: 'Для активации профиля перейдите по этой ссылке',
        //     html: 
        //         `
        //             <div style = 'background: black;color: white;text-align: center;'>
        //                 <h1>Для активации перейдите по ссылке</h1>
        //                 <a style = 'padding: 5px 10px; background: skyblue; color: black;' href = '${link}'>${link}</a>
        //             </div>
        //         `
        // })
    }
}

module.exports = new MailService();