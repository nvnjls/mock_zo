import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface CertificateProps {
    studentName: string;
    badges: string[]; // Array of PNG URLs for badges
    backgroundImage: string; // URL to the JPG background image
}

const CertificateGenerator: React.FC<CertificateProps> = ({ studentName, badges, backgroundImage }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        if (certificateRef.current) {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2, // Higher scale for better quality
                useCORS: true, // Enable if images are cross-origin
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // Portrait A4
            const width = pdf.internal.pageSize.getWidth();
            const height = pdf.internal.pageSize.getHeight();
            pdf.addImage(imgData, 'PNG', 0, 0, width, height, undefined, 'FAST');
            pdf.save(`${studentName.replace(/\s+/g, '_')}_internship_certificate.pdf`);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={generatePDF}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
                Download internship PDF
            </button>
        </div>
    );
};

export default CertificateGenerator;