export const getDgtLabel = (fuelType, year, isHybrid = false, isElectric = false) => {
    // Normalize inputs
    const fuel = fuelType ? fuelType.toLowerCase() : '';
    const yearNum = parseInt(year);

    // 0 EMISIONES (Blue)
    // Eléctricos de batería (BEV), eléctricos de autonomía extendida (REEV), 
    // híbridos enchufables (PHEV) con autonomía ≥ 40 km o vehículos de pila de combustible.
    if (isElectric || fuel.includes('eléctrico') || fuel.includes('electric') || fuel.includes('elektro')) {
        return '0';
    }
    if (fuel.includes('híbrido enchufable') || fuel.includes('plug-in') || fuel.includes('phev')) {
        return '0'; // Assuming > 40km range for simplicity in this context
    }

    // ECO (Blue/Green)
    // Híbridos enchufables con autonomía < 40km, híbridos no enchufables (HEV), 
    // vehículos propulsados por gas natural (GNC y GNL) o gas licuado del petróleo (GLP).
    if (isHybrid || fuel.includes('híbrido') || fuel.includes('hybrid')) {
        return 'ECO';
    }
    // Fixed: Removed broad 'gas' check that was catching 'gasolina'
    // Added specific checks for CNG, LPG, GNC, GLP
    if (fuel.includes('glp') || fuel.includes('gnc') || fuel.includes('gnl') || fuel.includes('lpg') || fuel.includes('cng') || fuel.includes('autogas')) {
        return 'ECO';
    }

    // C (Green)
    // Gasolina: Euro 4, 5 y 6 (Matriculados a partir de enero de 2006)
    // Diésel: Euro 6 (Matriculados a partir de enero de 2014)
    if (fuel.includes('gasolina') || fuel.includes('petrol') || fuel.includes('benzin')) {
        if (yearNum >= 2006) return 'C';
    }
    if (fuel.includes('diesel') || fuel.includes('diésel')) {
        if (yearNum >= 2014) return 'C';
    }

    // B (Yellow)
    // Gasolina: Euro 3 (Matriculados a partir de enero de 2000)
    // Diésel: Euro 4 y 5 (Matriculados a partir de enero de 2006)
    if (fuel.includes('gasolina') || fuel.includes('petrol') || fuel.includes('benzin')) {
        if (yearNum >= 2000) return 'B';
    }
    if (fuel.includes('diesel') || fuel.includes('diésel')) {
        if (yearNum >= 2006) return 'B';
    }

    // No Label
    return null;
};
