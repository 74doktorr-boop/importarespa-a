/**
 * Simple heuristic-based CO2 lookup/estimation.
 * In a production app, this would query a real database (e.g., KBA database or API).
 */

const CO2_AVERAGES = {
    gasoline: {
        2024: 130,
        2023: 135,
        2022: 140,
        2021: 145,
        2020: 150,
        2019: 155,
        2018: 160,
        2015: 170,
        2010: 190,
        default: 160
    },
    diesel: {
        2024: 120,
        2023: 125,
        2022: 130,
        2021: 135,
        2020: 140,
        2019: 145,
        2018: 150,
        2015: 160,
        2010: 180,
        default: 150
    },
    hybrid: {
        default: 40
    },
    electric: {
        default: 0
    }
};

function estimateCO2(fuelType, year) {
    if (!fuelType) return 150; // Conservative default

    const normalizedFuel = fuelType.toLowerCase();
    let category = 'gasoline';

    if (normalizedFuel.includes('diesel')) category = 'diesel';
    else if (normalizedFuel.includes('hybrid') || normalizedFuel.includes('electro')) category = 'hybrid';
    else if (normalizedFuel.includes('electric') || normalizedFuel.includes('elektro')) category = 'electric';

    const table = CO2_AVERAGES[category];

    // Exact year match
    if (table[year]) return table[year];

    // Closest year logic could be added here, but for now return default for the type
    return table.default;
}

module.exports = { estimateCO2 };
