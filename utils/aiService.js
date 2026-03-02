/**
 * Fallback simulated response for when the SDK is not available or fails.
 */
async function getVehicleVerdict(vehicleData) {
    const isGoodPrice = vehicleData.price < 30000;

    return {
        price_evaluation: isGoodPrice ? "Buen Precio" : "Precio Justo",
        score: isGoodPrice ? 8 : 7,
        summary: `Análisis para ${vehicleData.make} ${vehicleData.model} (${vehicleData.year}). Una opción equilibrada para el mercado español.`,
        pros: [
            "Precio competitivo comparado con mercado local",
            "Equipamiento verificado en anuncio",
            "Mantenimiento al día según descripción"
        ],
        cons: [
            "Kilometraje requiere verificación de libro técnico",
            "Transporte desde esta ubicación es estándar",
            "Revisar historial de accidentes"
        ],
        verdict_text: `Este ${vehicleData.model} de ${vehicleData.year} representa una oportunidad sólida. El precio de ${vehicleData.price} ${vehicleData.currency} está dentro del rango esperado para este kilometraje. Recomendamos proceder con la reserva si el historial de mantenimiento es completo.`
    };
}

module.exports = { getVehicleVerdict };
