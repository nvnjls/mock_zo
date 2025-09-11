import React from 'react';
import CertificateGenerator from './CertificateGenerator';

const DownloadCertificate: React.FC = () => {
    // Sample data for the certificate
    const studentName = "John Doe";
    const backgroundImage = "https://raw.githubusercontent.com/nvnjls/platform_assets/main/certificateBG.jpg";
    const badges = [
        "https://raw.githubusercontent.com/nvnjls/platform_assets/main/badge1.png",
        "https://raw.githubusercontent.com/nvnjls/platform_assets/main/badge2.png",
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 overflow-x-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Download Your Internship Certificate</h2>
            <div className="shadow-lg border border-gray-300 w-[794px] max-w-full">
                <CertificateGenerator
                    studentName={studentName}
                    badges={badges}
                    backgroundImage={backgroundImage}
                />
            </div>
        </div>
    );
};

export default DownloadCertificate;