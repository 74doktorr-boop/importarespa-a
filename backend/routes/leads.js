const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Nodemailer (using the same config as contact.js)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: '74doktorr@gmail.com',
        pass: process.env.EMAIL_PASSWORD // Ensure this env var is set
    }
});

router.post('/', async (req, res) => {
    const { customer, vehicle } = req.body;

    if (!customer || !vehicle) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email content for the Admin (You)
    const adminMailOptions = {
        from: '74doktorr@gmail.com',
        to: '74doktorr@gmail.com', // Send to yourself
        subject: `🔥 NUEVO LEAD: ${vehicle.make} ${vehicle.model} - ${customer.name}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Nueva Solicitud de Importación</h2>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">👤 Datos del Cliente</h3>
                    <p><strong>Nombre:</strong> ${customer.name}</p>
                    <p><strong>Teléfono:</strong> <a href="https://wa.me/${customer.phone.replace(/\s+/g, '')}">${customer.phone}</a></p>
                    <p><strong>Email:</strong> ${customer.email || 'No proporcionado'}</p>
                    <p><strong>Código Postal:</strong> ${customer.postalCode}</p>
                </div>

                <div style="background-color: #f0f9ff; padding: 20px; border-radius: 10px; border: 1px solid #bae6fd;">
                    <h3 style="margin-top: 0; color: #0369a1;">🚗 Vehículo Solicitado</h3>
                    <img src="${vehicle.imageUrl}" alt="Coche" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">
                    <p><strong>Modelo:</strong> ${vehicle.make} ${vehicle.model} (${vehicle.year})</p>
                    <p><strong>Precio Origen:</strong> ${vehicle.price}€</p>
                    <p><strong>Km:</strong> ${vehicle.mileage}</p>
                    <p><strong>CO2:</strong> ${vehicle.co2} g/km</p>
                    <p><strong>Enlace Original:</strong> <a href="${vehicle.url}">Ver en Mobile.de</a></p>
                </div>

                <p style="font-size: 12px; color: #64748b; margin-top: 20px;">
                    Este lead se generó desde ImportarEspaña.com
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(adminMailOptions);
        console.log('Lead email sent successfully');
        res.status(200).json({ success: true, message: 'Lead received' });
    } catch (error) {
        console.error('Error sending lead email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

module.exports = router;
