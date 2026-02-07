const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure transporter
// Note: These environment variables must be set in .env
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS  // Your App Password
    }
});

router.post('/', async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    try {
        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: '74doktorr@gmail.com', // Where you want to receive emails
            replyTo: email, // Allows you to reply directly to the client
            subject: `[WEB] ${subject} - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">Nuevo Mensaje de Contacto</h2>
                    
                    <div style="margin-top: 20px;">
                        <p><strong>Nombre:</strong> ${name}</p>
                        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                        <p><strong>Teléfono:</strong> ${phone || 'No facilitado'}</p>
                        <p><strong>Asunto:</strong> ${subject}</p>
                    </div>

                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin-top: 20px;">
                        <h3 style="margin-top: 0; color: #475569;">Mensaje:</h3>
                        <p style="white-space: pre-wrap; color: #334155;">${message}</p>
                    </div>

                    <div style="margin-top: 30px; font-size: 12px; color: #94a3b8; text-align: center;">
                        Enviado desde el formulario de contacto de Importar España
                    </div>
                </div>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Error al enviar el email' });
    }
});

module.exports = router;
