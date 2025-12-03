const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Política de Privacidad</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-slate-600">
                    <p><strong>Última actualización:</strong> {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">1. Responsable del Tratamiento</h2>
                    <p>
                        <strong>Titular:</strong> UNAI SANCHEZ PEREYRA | IMPORTAR ESPAÑA<br />
                        <strong>NIF:</strong> 49575893Z<br />
                        <strong>Dirección:</strong> Andoain, Kaleberria<br />
                        <strong>Email:</strong> 74doktorr@gmail.com
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">2. Finalidad del Tratamiento</h2>
                    <p>Tratamos la información que nos facilitan las personas interesadas con el fin de:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Gestionar el envío de la información que nos soliciten.</li>
                        <li>Facilitar a los interesados ofertas de productos y servicios de su interés (Cálculo de impuestos, informes de vehículos).</li>
                        <li>Gestionar el formulario de contacto y soporte.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">3. Legitimación</h2>
                    <p>La base legal para el tratamiento de sus datos es el consentimiento del interesado al rellenar los formularios y aceptar esta política.</p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">4. Destinatarios</h2>
                    <p>Los datos no se cederán a terceros salvo obligación legal o para la prestación de servicios técnicos necesarios (hosting, email marketing) que cumplen con la normativa GDPR.</p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">5. Derechos</h2>
                    <p>Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando datos personales que les conciernan, o no. Las personas interesadas tienen derecho a acceder a sus datos personales, así como a solicitar la rectificación de los datos inexactos o, en su caso, solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
