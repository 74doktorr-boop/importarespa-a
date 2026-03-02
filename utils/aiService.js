const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (set up in Render/Vercel)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: { responseMimeType: "application/json" }
});

/**
 * Generates an AI verdict for a vehicle based on its data.
 * @param {Object} vehicleData 
 * @returns {Promise<Object>}
 */
async function getVehicleVerdict(vehicleData) {
    // If no API key is provided, return a simulated response to avoid breaking the app
    if (!process.env.GEMINI_API_KEY) {
        return getSimulatedVerdict(vehicleData);
    }

    const prompt = `
    Eres un experto en el mercado automotriz europeo especializado en importación a España.
    Analiza este coche y devuélveme un JSON con los siguientes campos:
    - price_evaluation: (cadena) Una de estas opciones: "Ganga", "Buen Precio", "Precio Justo", "Algo Caro", "Caro".
    - score: (número 1-10) Puntuación general de la oportunidad.
    - summary: (cadena) Un resumen de 2 frases máximo sobre el coche.
    - pros: (array de 3 cadenas) Puntos fuertes.
    - cons: (array de 3 cadenas) Puntos débiles o cosas a revisar.
    - verdict_text: (cadena) Un párrafo corto (3 líneas) de opinión profesional.

    Datos del coche:
    Marca: ${vehicleData.make}
    Modelo: ${vehicleData.model}
    Precio: ${vehicleData.price} ${vehicleData.currency}
    Año: ${vehicleData.year}
    Kilómetros: ${vehicleData.mileage}
    Potencia: ${vehicleData.power} CV
    Emisiones CO2: ${vehicleData.co2} g/km
    Combustible: ${vehicleData.fuelType}
    Ubicación: ${vehicleData.location}, ${vehicleData.country}

    Responde SOLO el JSON.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text);
    } catch (error) {
        console.error("AI Generation Error:", error);
        return getSimulatedVerdict(vehicleData);
    }
}

/**
 * Fallback simulated response for when the API key is missing or fails.
 */
function getSimulatedVerdict(vehicleData) {
    const isGoodPrice = vehicleData.price < 30000; // Simplified logic

    return {
        price_evaluation: isGoodPrice ? "Buen Precio" : "Precio Justo",
        score: isGoodPrice ? 8 : 7,
        summary: `Un ${vehicleData.make} ${vehicleData.model} de ${vehicleData.year} con ${vehicleData.mileage}km. Una opción sólida para importación.`,
        pros: [
            "Excelente relación calidad-precio en origen",
            "Mantenimiento generalmente bien documentado en este país",
            "Motor con buena reputación de fiabilidad"
        ],
        cons: [
            "Revisar el desgaste de los neumáticos por el clima",
            "Costes de transporte pueden variar sustancialmente",
            "Verificar historial de servicios oficiales"
        ],
        verdict_text: `Este ${vehicleData.model} parece ser una oportunidad interesante. Con ${vehicleData.mileage} km, el desgaste debería ser moderado. El mercado de ${vehicleData.country} suele ofrecer mejores precios que el español para estos modelos.`
    };
}

module.exports = { getVehicleVerdict };
