import jsPDF from 'jspdf';

export const generateVehicleReportV2 = async (data, transportCost = 0) => {
    if (!data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // --- Helper Functions ---
    const addText = (text, x, y, size = 12, font = 'helvetica', style = 'normal', color = [0, 0, 0], align = 'left') => {
        doc.setFont(font, style);
        doc.setFontSize(size);
        doc.setTextColor(...color);
        doc.text(text, x, y, { align });
    };

    const drawLine = (y, color = [200, 200, 200]) => {
        doc.setDrawColor(...color);
        doc.line(margin, y, pageWidth - margin, y);
    };

    const addHeader = (title) => {
        doc.setFillColor(10, 25, 41); // Dark blue/black
        doc.rect(0, 0, pageWidth, 30, 'F');

        // Draw Luxury Logo Icon (Vector Shield)
        const logoX = margin;
        const logoY = 15;
        const scale = 0.5;

        doc.setDrawColor(212, 175, 55); // Gold
        doc.setLineWidth(1.5 * scale);

        // Shield Shape (Simplified for PDF robustness)
        doc.line(30 * scale + logoX, 2 * scale + logoY, 58 * scale + logoX, 12 * scale + logoY);
        doc.line(58 * scale + logoX, 12 * scale + logoY, 58 * scale + logoX, 30 * scale + logoY);
        doc.line(58 * scale + logoX, 30 * scale + logoY, 30 * scale + logoX, 68 * scale + logoY);
        doc.line(30 * scale + logoX, 68 * scale + logoY, 2 * scale + logoX, 30 * scale + logoY);
        doc.line(2 * scale + logoX, 30 * scale + logoY, 2 * scale + logoX, 12 * scale + logoY);
        doc.line(2 * scale + logoX, 12 * scale + logoY, 30 * scale + logoX, 2 * scale + logoY);

        // Monogram "IE"
        doc.setFont('times', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(212, 175, 55); // Gold
        doc.text('IE', 30 * scale + logoX, 45 * scale + logoY, { align: 'center' });

        // Text
        addText('IMPORTAR', margin + (70 * scale), 18, 18, 'times', 'bold', [255, 255, 255]);
        addText('ESPAÑA', margin + (70 * scale) + 35, 18, 18, 'helvetica', 'normal', [212, 175, 55]); // Gold
        addText('PREMIUM AUTOMOTIVE SERVICES', margin + (70 * scale), 24, 6, 'helvetica', 'bold', [200, 200, 200]);

        addText(title, pageWidth - margin, 20, 10, 'helvetica', 'normal', [200, 200, 200], 'right');
    };

    const addFooter = (pageNum) => {
        const today = new Date().toLocaleDateString();
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generado el ${today} - www.importarespaña.com`, margin, pageHeight - 10);
        doc.text(`Página ${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    };

    // ==========================================
    // PAGE 1: VEHICLE DETAILS & TAX
    // ==========================================
    addHeader('INFORME TÉCNICO & FISCAL');

    let yPos = 50;

    // Title
    addText(data.make.toUpperCase(), margin, yPos, 12, 'helvetica', 'bold', [100, 100, 100]);
    yPos += 8;
    addText(data.model, margin, yPos, 24, 'helvetica', 'bold', [0, 0, 0]);
    yPos += 10;
    addText(`${data.location}, ${data.country}`, margin, yPos, 10, 'helvetica', 'normal', [100, 100, 100]);

    // Price Tag
    const priceStr = new Intl.NumberFormat('de-DE', { style: 'currency', currency: data.currency }).format(data.price);
    doc.setFillColor(240, 245, 255);
    doc.roundedRect(pageWidth - margin - 60, yPos - 25, 60, 25, 3, 3, 'F');
    addText(priceStr, pageWidth - margin - 10, yPos - 10, 16, 'helvetica', 'bold', [0, 0, 0], 'right');
    addText('PRECIO ANUNCIO', pageWidth - margin - 10, yPos - 3, 7, 'helvetica', 'normal', [100, 100, 100], 'right');

    yPos += 20;

    // Image
    try {
        if (data.imageUrl) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = data.imageUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const imgWidth = pageWidth - (margin * 2);
            const imgHeight = (img.height / img.width) * imgWidth;
            const maxHeight = 90; // Limit height for layout safety

            let finalWidth = imgWidth;
            let finalHeight = imgHeight;

            if (finalHeight > maxHeight) {
                finalHeight = maxHeight;
                finalWidth = (img.width / img.height) * finalHeight;
            }

            const xOffset = (pageWidth - finalWidth) / 2;
            doc.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
            yPos += finalHeight + 15;
        } else {
            throw new Error("No image");
        }
    } catch (e) {
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 60, 2, 2, 'F');
        addText('IMAGEN NO DISPONIBLE', pageWidth / 2, yPos + 30, 10, 'helvetica', 'normal', [150, 150, 150], 'center');
        yPos += 75;
    }

    // Stats Grid
    const colWidth = (pageWidth - (margin * 2)) / 4;
    const drawStat = (label, value, x) => {
        addText(label, x, yPos, 8, 'helvetica', 'bold', [150, 150, 150]);
        addText(value.toString(), x, yPos + 7, 12, 'helvetica', 'bold', [0, 0, 0]);
    };

    drawStat('AÑO', data.year, margin);
    drawStat('KILOMETRAJE', `${data.mileage.toLocaleString()} km`, margin + colWidth);
    drawStat('POTENCIA', data.power ? `${data.power} CV` : 'N/A', margin + (colWidth * 2));
    drawStat('COMBUSTIBLE', data.fuelType || 'N/A', margin + (colWidth * 3));

    yPos += 20;
    drawLine(yPos);
    yPos += 15;

    // Tax Section
    addText('CÁLCULO IMPUESTO MATRICULACIÓN', margin, yPos, 14, 'helvetica', 'bold', [0, 0, 0]);
    yPos += 10;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 55, 3, 3, 'FD');

    let boxY = yPos + 15;
    const boxMargin = margin + 10;

    // Tax Logic
    let rate = 0;
    if (data.co2 <= 120) rate = 0;
    else if (data.co2 <= 159) rate = 4.75;
    else if (data.co2 <= 199) rate = 9.75;
    else rate = 14.75;
    const taxAmount = (data.price * rate) / 100;

    addText(`Emisiones CO2: ${data.co2} g/km`, boxMargin, boxY, 10, 'helvetica', 'normal', [50, 50, 50]);
    addText(`Tipo Impositivo: ${rate}%`, pageWidth - boxMargin, boxY, 10, 'helvetica', 'bold', [0, 0, 0], 'right');

    boxY += 15;
    drawLine(boxY, [230, 230, 230]);
    boxY += 15;

    addText('Total Impuesto (Estimado):', boxMargin, boxY, 12, 'helvetica', 'bold', [0, 0, 0]);
    addText(new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(taxAmount), pageWidth - boxMargin, boxY, 14, 'helvetica', 'bold', [220, 50, 50], 'right');

    addFooter(1);

    // ==========================================
    // PAGE 2: ADDITIONAL COSTS & CHECKLIST
    // ==========================================
    doc.addPage();
    addHeader('GASTOS ADICIONALES DE IMPORTACIÓN');

    yPos = 50;
    addText('LA REALIDAD DE IMPORTAR', margin, yPos, 16, 'helvetica', 'bold', [0, 0, 0]);
    yPos += 10;
    addText('Más allá del precio del coche y el impuesto de matriculación, existen otros costes obligatorios que debes tener en cuenta para evitar sorpresas.', margin, yPos, 10, 'helvetica', 'normal', [80, 80, 80]);

    yPos += 20;

    let currentPage = 2;

    const addCostItem = (title, desc, priceRange) => {
        const itemHeight = 35;

        // Check for page overflow
        if (yPos + itemHeight > pageHeight - margin - 20) {
            doc.addPage();
            yPos = 30; // Reset Y position
            addHeader('GASTOS ADICIONALES (CONT.)');
            currentPage++;
            addFooter(currentPage);
        }

        doc.setFillColor(250, 250, 250);
        doc.roundedRect(margin, yPos, pageWidth - (margin * 2), itemHeight, 2, 2, 'F');

        addText(title, margin + 5, yPos + 10, 11, 'helvetica', 'bold', [0, 0, 0]);

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);

        const textWidth = pageWidth - (margin * 2) - 60;
        const splitDesc = doc.splitTextToSize(desc, textWidth);
        doc.text(splitDesc, margin + 5, yPos + 20);

        addText(priceRange, pageWidth - margin - 10, yPos + 18, 11, 'helvetica', 'bold', [50, 50, 50], 'right');

        yPos += itemHeight + 5;
    };

    const transportPriceDisplay = transportCost > 0
        ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(transportCost)
        : 'Consultar';

    addCostItem(
        'Transporte y Logística Integral',
        'Servicio completo de puerta a puerta: Recogida en origen, transporte en camión portavehículos (no rodado), seguro a todo riesgo (CMR) y entrega en España.',
        transportPriceDisplay
    );

    addCostItem(
        'Matrículas Provisionales (Rojas/Verdes)',
        'Necesarias para circular legalmente mientras se tramita la matriculación definitiva.',
        '150€ - 300€'
    );

    addCostItem(
        'ITV de Importación',
        'Inspección técnica específica para vehículos importados (más exhaustiva).',
        '120€ - 180€'
    );

    addCostItem(
        'Tasas de Tráfico (DGT)',
        'Tasa administrativa para la expedición del permiso de circulación.',
        '~99€'
    );

    addCostItem(
        'Impuesto Municipal (IVTM)',
        'Impuesto de Circulación (varía según ayuntamiento y trimestre).',
        '20€ - 200€'
    );

    addCostItem(
        'Gestoría / Ficha Reducida',
        'Honorarios profesionales y certificado de características técnicas.',
        '150€ - 400€'
    );

    yPos += 10;

    // Check for page overflow before Transport Note
    if (yPos + 50 > pageHeight - margin - 20) {
        doc.addPage();
        yPos = 30;
        addHeader('INFORMACIÓN ADICIONAL');
        currentPage++;
        addFooter(currentPage);
    }

    // Detailed Transport Note
    doc.setFillColor(240, 245, 255);
    doc.setDrawColor(200, 220, 255);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 45, 2, 2, 'FD');

    addText('DETALLE DEL SERVICIO DE TRANSPORTE', margin + 5, yPos + 8, 10, 'helvetica', 'bold', [0, 50, 100]);

    const transportText = "El coste de transporte calculado cubre un servicio profesional integral que garantiza la seguridad del vehículo. Incluye:\n" +
        "1. Recogida coordinada con el vendedor en origen.\n" +
        "2. Transporte en camión portavehículos especializado (evita desgaste y km).\n" +
        "3. Seguro de carga a todo riesgo durante todo el trayecto.\n" +
        "4. Gestión logística y planificación de ruta óptima.\n" +
        "Nota: El precio es una estimación basada en la distancia kilométrica y tarifas de mercado.";

    doc.setFontSize(8);
    doc.setTextColor(60, 80, 100);

    const noteWidth = pageWidth - (margin * 2) - 10;
    const splitTransportText = doc.splitTextToSize(transportText, noteWidth);
    doc.text(splitTransportText, margin + 5, yPos + 16);

    yPos += 55;

    yPos += 10;

    if (yPos + 35 > pageHeight - margin - 20) {
        doc.addPage();
        yPos = 30;
        addHeader('NOTAS IMPORTANTES');
        currentPage++;
        addFooter(currentPage);
    }

    doc.setFillColor(255, 252, 235);
    doc.setDrawColor(250, 200, 50);
    doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 30, 2, 2, 'FD');

    doc.setFontSize(9);
    doc.setTextColor(100, 80, 0);
    const warningText = "IMPORTANTE: Estos costes son estimaciones y pueden variar según la Comunidad Autónoma, el tipo de vehículo y las tarifas vigentes. Recomendamos consultar con un profesional para un presupuesto cerrado.";
    const splitWarning = doc.splitTextToSize(warningText, pageWidth - (margin * 2) - 10);
    doc.text(splitWarning, margin + 5, yPos + 10);

    addFooter(currentPage);

    // ==========================================
    // PAGE 3: BRAND & CTA
    // ==========================================
    doc.addPage();

    // Full page dark background
    doc.setFillColor(10, 25, 41);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Center Content
    let centerY = pageHeight / 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.text('IMPORTAR ESPAÑA', pageWidth / 2, centerY, { align: 'center' });

    centerY += 20;
    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.text('Tu socio de confianza en importación de vehículos', pageWidth / 2, centerY, { align: 'center' });

    centerY += 40;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(margin + 40, centerY, pageWidth - margin - 40, centerY);

    centerY += 40;
    doc.setFontSize(12);
    doc.text('¿Necesitas ayuda con los trámites?', pageWidth / 2, centerY, { align: 'center' });

    centerY += 10;
    doc.text('Nos encargamos de todo el proceso por ti.', pageWidth / 2, centerY, { align: 'center' });

    centerY += 40;

    // Website Link (Visual)
    doc.setFillColor(59, 130, 246); // Blue button
    doc.roundedRect((pageWidth / 2) - 60, centerY - 10, 120, 20, 10, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('www.importarespaña.com', pageWidth / 2, centerY + 3, { align: 'center' });

    // Make it clickable
    doc.link((pageWidth / 2) - 60, centerY - 10, 120, 20, { url: 'https://www.importarespaña.com' });

    // Save
    // Save
    const sanitizedMake = data.make.replace(/[^a-z0-9]/gi, '_');
    const sanitizedModel = data.model.replace(/[^a-z0-9]/gi, '_');
    const filename = `ImportarEspana_${sanitizedMake}_${sanitizedModel}.pdf`;


    // Manual save to ensure filename is respected
    const blob = doc.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
