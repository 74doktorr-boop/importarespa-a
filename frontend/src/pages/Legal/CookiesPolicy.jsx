const CookiesPolicy = () => {
    return (
        <div className="min-h-screen bg-slate-50 pt-32">
            <div className="container mx-auto px-6 max-w-4xl">
                <h1 className="text-4xl font-bold text-slate-900 mb-8">Política de Cookies</h1>

                <div className="bg-white p-8 rounded-3xl shadow-sm space-y-6 text-slate-600">
                    <h2 className="text-2xl font-bold text-slate-800 mt-6">1. ¿Qué son las cookies?</h2>
                    <p>Una cookie es un fichero que se descarga en su ordenador al acceder a determinadas páginas web. Las cookies permiten a una página web, entre otras cosas, almacenar y recuperar información sobre los hábitos de navegación de un usuario o de su equipo y, dependiendo de la información que contengan y de la forma en que utilice su equipo, pueden utilizarse para reconocer al usuario.</p>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">2. ¿Qué tipos de cookies utiliza esta web?</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Cookies técnicas:</strong> Son aquellas que permiten al usuario la navegación a través de una página web, plataforma o aplicación y la utilización de las diferentes opciones o servicios que en ella existan.</li>
                        <li><strong>Cookies de análisis:</strong> Son aquellas que permiten al responsable de las mismas, el seguimiento y análisis del comportamiento de los usuarios de los sitios web a los que están vinculadas.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-slate-800 mt-6">3. Desactivación de cookies</h2>
                    <p>Puede usted permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su ordenador.</p>
                    <ul className="list-disc pl-6 space-y-2 mt-2">
                        <li>Chrome: Configuración - Mostrar opciones avanzadas - Privacidad - Configuración de contenido.</li>
                        <li>Firefox: Herramientas - Opciones - Privacidad - Historial - Configuración Personalizada.</li>
                        <li>Safari: Preferencias - Seguridad.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CookiesPolicy;
