import jsPDF from 'jspdf';

/**
 * Generates a premium PDF report for a vehicle.
 * @param {Object} data - Vehicle data
 * @param {number} transportCost - Estimated transport cost
 * @param {boolean} isClientQuote - Whether it's a quote for a client or a general report
 */
export const generateVehicleReportV2 = async (data, transportCost = 0, isClientQuote = false) => {
    if (!data) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // --- Modern Color Palette ---
    const COLORS = {
        primary: [10, 25, 41],     // Deep Slate (Importar España Main Color)
        accent: [59, 130, 246],    // Professional Blue
        text: [30, 41, 59],        // Dark Grey for text
        muted: [100, 116, 139],    // Slate 500
        success: [16, 185, 129],   // Emerald 500
        danger: [220, 38, 38],     // Red 600
        bg: [248, 250, 252],       // Slate 50
        white: [255, 255, 255]
    };

    // --- State Manager for Layout ---
    let yPos = 45;
    let currentPage = 1;

    // --- Helper Components ---
    const drawHeader = (title) => {
        // Dark Top Bar
        doc.setFillColor(...COLORS.primary);
        doc.rect(0, 0, pageWidth, 35, 'F');

        // Professional Logo Reconstruction
        const logoX = margin;
        const logoY = 17.5;

        // Background Circle for Icon
        doc.setFillColor(...COLORS.accent);
        doc.circle(logoX + 4, logoY, 6, 'F');

        // Arrow Icon (White)
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(1);
        doc.line(logoX + 1, logoY + 2, logoX + 4, logoY - 1);
        doc.line(logoX + 4, logoY - 1, logoX + 7, logoY - 1);
        doc.line(logoX + 7, logoY - 1, logoX + 8, logoY);

        // Brand Name
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text('IMPORTAR ESPAÑA', logoX + 13, logoY + 1.5);

        // Report Type Tag
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(180, 180, 180);
        doc.text(title.toUpperCase(), pageWidth - margin, logoY + 1, { align: 'right' });
    };

    const drawFooter = () => {
        const today = new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.muted);
        doc.text(`Generado el ${today} • www.importarespaña.com`, margin, pageHeight - 12);
        doc.text(`Página ${currentPage}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
    };

    const checkPageOverflow = (neededHeight) => {
        if (yPos + neededHeight > pageHeight - 25) {
            doc.addPage();
            currentPage++;
            yPos = 50;
            drawHeader(isClientQuote ? 'Presupuesto' : 'Informe Técnico');
            drawFooter();
            return true;
        }
        return false;
    };

    const drawSectionTitle = (title) => {
        checkPageOverflow(20);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...COLORS.primary);
        doc.text(title, margin, yPos);
        yPos += 3;
        doc.setDrawColor(...COLORS.accent);
        doc.setLineWidth(1.5);
        doc.line(margin, yPos, margin + 15, yPos);
        yPos += 12;
    };

    // ==========================================
    // INITIAL RENDER
    // ==========================================
    drawHeader(isClientQuote ? 'PRESUPUESTO DE IMPORTACIÓN' : 'INFORME TÉCNICO & FISCAL');
    drawFooter();

    // ==========================================
    // VEHICLE DATA CARD
    // ==========================================
    // Title Section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(...COLORS.primary);
    doc.text(data.model.toUpperCase(), margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const subtitle = `${data.make.toUpperCase()} • ${data.location}, ${data.country}`.toUpperCase();
    doc.text(subtitle, margin, yPos);

    // Price Badge
    const priceStr = new Intl.NumberFormat('es-ES', { style: 'currency', currency: data.currency || 'EUR' }).format(data.price);
    doc.setFillColor(...COLORS.bg);
    doc.roundedRect(pageWidth - margin - 70, yPos - 18, 70, 22, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...COLORS.accent);
    doc.text(priceStr, pageWidth - margin - 5, yPos - 3, { align: 'right' });
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.muted);
    doc.text('PRECIO DEL ANUNCIO', pageWidth - margin - 5, yPos - 12, { align: 'right' });

    yPos += 15;

    // Image Stage
    try {
        if (data.imageUrl) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.src = data.imageUrl;
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => reject('Timeout loading image'), 5000);
                img.onload = () => { clearTimeout(timeout); resolve(); };
                img.onerror = () => { clearTimeout(timeout); reject(); };
            });

            const maxHeight = 85;
            const maxWidth = contentWidth;
            let finalWidth = maxWidth;
            let finalHeight = (img.height / img.width) * maxWidth;

            if (finalHeight > maxHeight) {
                finalHeight = maxHeight;
                finalWidth = (img.width / img.height) * finalHeight;
            }

            const xOffset = (pageWidth - finalWidth) / 2;

            // Subtle Shadow/Border for Image
            doc.setFillColor(241, 245, 249);
            doc.rect(xOffset - 1, yPos - 1, finalWidth + 2, finalHeight + 2, 'F');

            doc.addImage(img, 'JPEG', xOffset, yPos, finalWidth, finalHeight);
            yPos += finalHeight + 15;
        } else {
            throw new Error("No image");
        }
    } catch (e) {
        doc.setFillColor(...COLORS.bg);
        doc.roundedRect(margin, yPos, contentWidth, 50, 4, 4, 'F');
        doc.setTextColor(...COLORS.muted);
        doc.setFontSize(10);
        doc.text('IMAGEN DEL VEHÍCULO NO DISPONIBLE', pageWidth / 2, yPos + 27, { align: 'center' });
        yPos += 65;
    }

    // Modern Info Grid
    const gridY = yPos;
    const boxW = (contentWidth - 10) / 4;

    const drawGridBox = (label, value, x) => {
        doc.setFillColor(...COLORS.bg);
        doc.roundedRect(x, gridY, boxW, 25, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.setTextColor(...COLORS.muted);
        doc.text(label.toUpperCase(), x + (boxW / 2), gridY + 8, { align: 'center' });
        doc.setFontSize(11);
        doc.setTextColor(...COLORS.primary);
        doc.text(value.toString(), x + (boxW / 2), gridY + 18, { align: 'center' });
    };

    drawGridBox('Año', data.year, margin);
    drawGridBox('Kms', `${(data.mileage || 0).toLocaleString()} km`, margin + boxW + 3.3);
    drawGridBox('Potencia', data.power ? `${data.power} CV` : 'N/A', margin + (boxW * 2) + 6.6);
    drawGridBox('Fuel', data.fuelType || 'N/A', margin + (boxW * 3) + 10);

    yPos += 40;

    // ==========================================
    // TAX ANALYTICS
    // ==========================================
    drawSectionTitle('ANÁLISIS FISCAL Y TASAS');

    // Tax Calculation Box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, yPos, contentWidth, 50, 4, 4, 'F');

    let rate = 0;
    if (data.co2 <= 120) rate = 0;
    else if (data.co2 <= 159) rate = 4.75;
    else if (data.co2 <= 199) rate = 9.75;
    else rate = 14.75;
    const taxAmount = (data.price * rate) / 100;

    doc.setFontSize(10);
    doc.setTextColor(...COLORS.text);
    doc.text('Base Imponible (Precio Vehículo):', margin + 10, yPos + 15);
    doc.text(priceStr, pageWidth - margin - 10, yPos + 15, { align: 'right' });

    doc.text(`Emisiones de CO2 (${data.co2 || 0} g/km) -> Tramo Fiscal:`, margin + 10, yPos + 25);
    doc.text(`${rate}%`, pageWidth - margin - 10, yPos + 25, { align: 'right' });

    doc.setDrawColor(203, 213, 225);
    doc.line(margin + 10, yPos + 32, pageWidth - margin - 10, yPos + 32);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('ESTIMACIÓN IMPUESTO MATRICULACIÓN:', margin + 10, yPos + 41);
    const taxStr = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(taxAmount);
    doc.setTextColor(...COLORS.danger);
    doc.text(taxStr, pageWidth - margin - 10, yPos + 41, { align: 'right' });

    yPos += 70;

    // ==========================================
    // ADDITIONAL COSTS PAGE
    // ==========================================
    doc.addPage();
    currentPage++;
    yPos = 50;
    drawHeader(isClientQuote ? 'DESGLOSE DE COSTES' : 'GESTIÓN Y ADUANAS');
    drawFooter();

    drawSectionTitle('GASTOS COMPLEMENTARIOS');

    const addPremiumCostItem = (title, description, amount) => {
        checkPageOverflow(35);

        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(margin, yPos, contentWidth, 28, 3, 3, 'FD');

        // Icon Accent
        doc.setFillColor(...COLORS.accent);
        doc.rect(margin, yPos, 4, 28, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...COLORS.primary);
        doc.text(title, margin + 8, yPos + 10);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...COLORS.muted);
        const splitDesc = doc.splitTextToSize(description, contentWidth - 85);
        doc.text(splitDesc, margin + 8, yPos + 18);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(...COLORS.text);
        doc.text(amount, pageWidth - margin - 10, yPos + 16, { align: 'right' });

        yPos += 33;
    };

    const transportDisplay = transportCost > 0
        ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(transportCost)
        : 'A CONSULTAR';

    addPremiumCostItem(
        'Logística y Transporte Terrestre',
        'Recogida en origen mediante camión portavehículos profesional, entrega segura en España y seguro de carga incluido.',
        transportDisplay
    );

    if (isClientQuote && data.fixedCostsTotal && data.commissionAmount) {
        const totalMgmt = data.fixedCostsTotal + data.commissionAmount;
        addPremiumCostItem(
            'Gestión Técnica y Administrativa',
            'Incluye Informe Técnico (Ficha Reducida), ITV de Importación, Tasas de la DGT, Placas Provisionales y Honorarios de Gestoría.',
            new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(totalMgmt)
        );
    } else {
        addPremiumCostItem('Inspección ITV Importación', 'Tramitación obligatoria y revisión extraordinaria por vehículo importado.', '120€ - 180€');
        addPremiumCostItem('Trámites DGT / Tasas', 'Expedición de permiso de circulación y matriculación en España.', '99,10€');
        addPremiumCostItem('Ficha Reducida / Ingeniería', 'Certificado de características técnicas homologado para el mercado español.', '150€ - 200€');
        addPremiumCostItem('Gestoría e Impresiones', 'Honorarios profesionales por la tramitación de expedientes y placas físicas.', '150€ - 300€');
    }

    yPos += 15;

    // TOTAL PRICE BANNER
    if (isClientQuote && data.totalClientPrice) {
        checkPageOverflow(45);
        doc.setFillColor(...COLORS.primary);
        doc.roundedRect(margin, yPos, contentWidth, 40, 5, 5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(255, 255, 255);
        doc.text('VALOR TOTAL LLAVE EN MANO', margin + 12, yPos + 17);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(180, 180, 180);
        doc.text('Coche + Impuestos + Transporte + Gestión Técnica', margin + 12, yPos + 27);

        const finalPrice = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(data.totalClientPrice);
        doc.setFontSize(26);
        doc.setTextColor(...COLORS.accent);
        doc.text(finalPrice, pageWidth - margin - 12, yPos + 25, { align: 'right' });

        yPos += 55;
    }

    // TRANSPORT NOTE CARD
    checkPageOverflow(45);
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
    doc.roundedRect(margin, yPos, contentWidth, 40, 3, 3, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(3, 105, 161);
    doc.text('INFORMACIÓN IMPORTANTE SOBRE EL TRASLADO', margin + 8, yPos + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(12, 74, 110);
    const transportNote = "Este presupuesto contempla un transporte profesional en camión abierto. El vehículo viaja asegurado con póliza de carga CMR. Los plazos de entrega estimados son de 10-15 días laborables desde la formalización de la reserva y disponibilidad del vehículo en vendedor.";
    const splitNote = doc.splitTextToSize(transportNote, contentWidth - 16);
    doc.text(splitNote, margin + 8, yPos + 18);

    // ==========================================
    // BRAND CLOSING PAGE
    // ==========================================
    doc.addPage();
    doc.setFillColor(...COLORS.primary);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    let centerY = pageHeight / 2.5;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(42);
    doc.setTextColor(255, 255, 255);
    doc.text('IMPORTAR ESPAÑA', pageWidth / 2, centerY, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(200, 200, 200);
    doc.setFont('helvetica', 'normal');
    doc.text('Llevamos tu pasión sobre ruedas a la puerta de tu casa', pageWidth / 2, centerY + 18, { align: 'center' });

    doc.setDrawColor(...COLORS.accent);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, centerY + 40, pageWidth / 2 + 40, centerY + 40);

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('¿Hablamos de tu próximo coche?', pageWidth / 2, centerY + 65, { align: 'center' });

    // Modern Rounded Button
    const btnW = 140;
    const btnH = 18;
    doc.setFillColor(...COLORS.accent);
    doc.roundedRect((pageWidth - btnW) / 2, centerY + 80, btnW, btnH, 9, 9, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('www.importarespaña.com', pageWidth / 2, centerY + 91.5, { align: 'center' });
    doc.link((pageWidth - btnW) / 2, centerY + 80, btnW, btnH, { url: 'https://www.importarespaña.com' });

    centerY += 130;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    const legalText = "Este documento es un informe estimativo y no constituye una oferta contractual vinculante. Los precios de impuestos y tasas pueden variar según la CC.AA y la normativa vigente de la AEAT y DGT en el momento de la matriculación.";
    const splitLegal = doc.splitTextToSize(legalText, contentWidth - 40);
    doc.text(splitLegal, pageWidth / 2, centerY, { align: 'center' });

    // Download Logic (Manual Trigger for Filename Control)
    const sanitizedMake = (data.make || 'Vehiculo').replace(/[^a-z0-9]/gi, '_');
    const sanitizedModel = (data.model || 'Modelo').replace(/[^a-z0-9]/gi, '_');
    const docType = isClientQuote ? 'PRESUPUESTO' : 'INFORME';
    const filename = `ImportarEspana_${sanitizedMake}_${sanitizedModel}_${docType}.pdf`;

    try {
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error("PDF generation failed", err);
        // Fallback save
        doc.save(filename);
    }
};

/**
 * Generates one of the free static guides offered by the site.
 * @param {string} type - 'guia' | 'checklist' | 'contrato'
 */
export const generateStaticGuide = async (type) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    const COLORS = {
        primary: [10, 25, 41],
        accent: [59, 130, 246],
        text: [30, 41, 59],
        muted: [100, 116, 139],
        bg: [248, 250, 252]
    };

    const drawHeader = (title) => {
        doc.setFillColor(...COLORS.primary);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text('IMPORTAR ESPAÑA', margin, 20);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(title.toUpperCase(), margin, 28);
    };

    if (type === 'guia') {
        drawHeader('La Biblia del Importador');
        let y = 60;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(...COLORS.primary);
        doc.text('Guía Maestra Paso a Paso', margin, y);
        y += 15;

        const steps = [
            { t: '1. Búsqueda y Filtro', d: 'Busca en Mobile.de o Autoscout24. Filtra por vendedores profesionales y verifica que el IVA sea deducible (MwSt. ausweisbar).' },
            { t: '2. Verificación Inicial', d: 'Pide el historial (VIN) y el COC (Certificado de Conformidad). Si no hay COC, necesitarás una Ficha Reducida en España.' },
            { t: '3. Compra y Pago', d: 'Realiza siempre transferencia bancaria internacional SEPA. Nunca pagues en efectivo cantidades grandes en el extranjero.' },
            { t: '4. Transporte', d: 'Contrata un portavehículos profesional. Asegúrate de recibir la documentación original (Teil I y Teil II).' },
            { t: '5. Matriculación', d: 'ITV de importación, Modelo 576 (Hacienda) y Tasa de Tráfico (DGT).' }
        ];

        steps.forEach(step => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(11);
            doc.setTextColor(...COLORS.accent);
            doc.text(step.t, margin, y);
            y += 6;
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9);
            doc.setTextColor(...COLORS.text);
            const splitText = doc.splitTextToSize(step.d, contentWidth);
            doc.text(splitText, margin, y);
            y += (splitText.length * 5) + 5;
        });

        doc.save('Guia_Maestra_Importacion_IE.pdf');
    }

    if (type === 'checklist') {
        drawHeader('Checklist de Inspección de Vehículo');
        let y = 60;
        doc.setFontSize(14);
        doc.setTextColor(...COLORS.primary);
        doc.text('Puntos Críticos a Revisar in-situ o vía vídeo', margin, y);
        y += 15;

        const items = [
            '[ ] Libro de mantenimiento sellado o digital completo',
            '[ ] Estado de neumáticos y discos de freno',
            '[ ] Desgaste de volante y pedales (¿coincide con los km?)',
            '[ ] Humo del escape (blanco o azulado es señal de peligro)',
            '[ ] Alineación de paneles (huecos no uniformes = posible golpe)',
            '[ ] Funcionamiento del AA y toda la electrónica',
            '[ ] Número de bastidor (VIN) coincide con los papeles'
        ];

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        items.forEach(item => {
            doc.text(item, margin, y);
            y += 10;
        });

        doc.save('Checklist_Inspeccion_IE.pdf');
    }

    if (type === 'contrato') {
        drawHeader('Modelo de Contrato Bilingüe (Simplificado)');
        let y = 60;
        doc.setFontSize(10);
        doc.setTextColor(...COLORS.text);
        const text = "Este es un extracto del contrato de compraventa bilingüe. Al comprar fuera de España, el contrato debe incluir: \\n\\n" +
            "- Datos completos del vendedor (Vendedor/Verkäufer)\\n" +
            "- Datos completos del comprador (Comprador/Käufer)\\n" +
            "- Datos del vehículo: Marca, Modelo, VIN, KM, Precio.\\n" +
            "- Cláusula de accidente: 'Unfallfrei' (Libre de accidentes).\\n" +
            "- Firma y sello del establecimiento.\\n\\n" +
            "Recomendamos usar siempre el contrato oficial alemán 'Kaufvertrag' facilitado por el vendedor profesional.";

        const splitText = doc.splitTextToSize(text, contentWidth);
        doc.text(splitText, margin, y);

        doc.save('Informacion_Contrato_Bilingue.pdf');
    }
};
