import { jsPDF } from 'jspdf';
import type { SmartProject } from '../types';

export function generateProjectFeasibilityPdf(project: SmartProject, visitorName: string): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header band
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setFillColor(220, 38, 38); // Red 600 accent bar
  doc.rect(0, 38, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('ENVERTO SOLUTIONS', 16, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Industrial Engineering, Turnkey Solutions & Smart Business Consultancy', 16, 24);
  doc.text('www.envertosolutions.pk  |  +92-333-9278655  |  amir.project@gmail.com', 16, 30);

  y = 52;

  // Document title
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(project.title, pageWidth - 32);
  doc.text(titleLines, 16, y);
  y += titleLines.length * 7 + 2;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Sector: ${project.sector}   |   Prepared For: ${visitorName}   |   Date: ${new Date().toLocaleDateString('en-PK')}`,
    16,
    y
  );
  y += 10;

  // Key Financials box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(16, y, pageWidth - 32, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL CAPITAL INVESTMENT', 22, y + 9);
  doc.text('EST. MONTHLY NET RETURN', 86, y + 9);
  doc.text('PAYBACK HORIZON', 148, y + 9);

  doc.setFontSize(12);
  doc.setTextColor(220, 38, 38);
  doc.text(project.investmentLabel, 22, y + 17);
  doc.setTextColor(15, 23, 42);
  doc.text(project.estimatedMonthlyProfitPkr, 86, y + 17);
  doc.text(project.paybackMonths, 148, y + 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Space Requirement: ${project.spaceRequired}   |   Power Load: ${project.powerLoad}`, 22, y + 28);
  y += 44;

  // Executive Summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Executive Feasibility Overview', 16, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const summaryLines = doc.splitTextToSize(project.summary, pageWidth - 32);
  doc.text(summaryLines, 16, y);
  y += summaryLines.length * 5.5 + 8;

  // Turnkey Deliverables
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Turnkey Scope & Equipment Deliverables', 16, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  project.deliverables.forEach((item, index) => {
    const line = `${index + 1}. ${item}`;
    const wrapped = doc.splitTextToSize(line, pageWidth - 38);
    doc.text(wrapped, 20, y);
    y += wrapped.length * 5.5 + 2;
  });

  y += 6;

  // Consultancy & Licensing Note
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Implementation & Regulatory Support', 16, y);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const implText =
    'Enverto Solutions delivers end-to-end commissioning including machinery sourcing, electrical & mechanical installation, raw material supplier linkages, operator training, and compliance advisory (KPFA, PSQCA, Halal Food Authority, and KPEZDMC / Hattar SEZ industrial estate setup where applicable).';
  const implLines = doc.splitTextToSize(implText, pageWidth - 32);
  doc.text(implLines, 16, y);
  y += implLines.length * 5.5 + 12;

  // Offices footer block
  doc.setDrawColor(226, 232, 240);
  doc.line(16, y, pageWidth - 16, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Direct Engineering Consultation', 16, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('Peshawar Office: Office 220, Block A, Pirano Market, Karkhano, Hayatabad, Peshawar', 16, y);
  y += 5;
  doc.text('Haripur Plant & Office: Haripur Industrial Zone (AQUALIN Mineral Water & PET Plastic Industry), KP', 16, y);
  y += 5;
  doc.text('Phone / WhatsApp: +92-333-9278655   |   Email: amir.project@gmail.com', 16, y);

  const safeSlug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 48);
  doc.save(`Enverto-Feasibility-${safeSlug}.pdf`);
}
