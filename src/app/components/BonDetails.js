'use client'
import React, { useRef } from 'react';
import Image from 'next/image';
import { Printer } from 'lucide-react';
import { urlFor } from '@/sanity/lib/image';

const BonDeTravaux = ({ bon, id }) => {
  const printRef = useRef(null);    

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Bon de Travaux N° ${bon.num}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page { margin: 0; }
            body { margin: 0; padding: 20px; }
            @media print {
              @-moz-document url-prefix() {
                /* Firefox-specific print fixes */
                body { margin: 0 !important; padding: 0 !important; }
              }
              /* Force backgrounds */
              .bg-gray-50, .bg-green-100, .bg-yellow-100, .bg-red-100 {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
  
    printWindow.document.close();
  
    // Delay print slightly to ensure styles load (Firefox needs this)
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 200);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto mt-4 flex justify-end no-print">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <Printer />
        </button>
      </div>

      <div
        ref={printRef}
        className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6 print:shadow-none print:border print:border-gray-200"
      >
        <div className="flex items-center justify-between border-b-2 border-green-600 pb-4 print:border-green-600">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/OCP_Group.svg/1200px-OCP_Group.svg.png"
            alt="logo ocp"
            height={40}
            width={40}
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-green-700 print:text-green-700">BON DE TRAVAUX</h1>
            <p className="text-lg">N° {bon.num}</p>
          </div>
          <div className="w-10"></div>
        </div>

        {bon && (
          <div key={id} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg print:bg-gray-50">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 print:text-gray-500">Client</p>
                  <p className="font-medium">{bon.idClient?.identite}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 print:text-gray-500">Date</p>
                  <p className="font-medium">
                    {bon.date}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 print:text-gray-500">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bon.status === 'traité'
                        ? 'bg-green-100 text-green-800 print:bg-green-100 print:text-green-800'
                        : bon.status === 'en cours'
                        ? 'bg-yellow-100 text-yellow-800 print:bg-yellow-100 print:text-yellow-800'
                        : 'bg-gray-100 text-gray-800 print:bg-gray-100 print:text-gray-800'
                    }`}
                  >
                    {bon.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 print:text-gray-500">Validité</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bon.validity === 'permanent'
                        ? 'bg-green-100 text-green-800 print:bg-green-100 print:text-green-800'
                        : 'bg-red-100 text-red-800 print:bg-red-100 print:text-red-800'
                    }`}
                  >
                    {bon.validity}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-green-200 print:bg-gray-50 print:border-green-200">
              <h2 className="text-lg font-semibold text-green-700 mb-4 print:text-green-700">
                Détail des travaux demandés
              </h2>
              {bon.analyses && 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bon.analyses.map((analyse) => (
                    <div
                      key={analyse._id}
                      className="bg-white p-3 rounded border border-gray-200 hover:border-green-600 transition-colors print:bg-white print:border-gray-200"
                    >
                      <p className="text-gray-800 print:text-gray-800">{analyse.analyse}</p>
                    </div>
                  ))}
                </div>
              }
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2 print:text-gray-500">Signature de chef de service</p>
              {bon.chefServiceSignature && bon.chefServiceSignature.asset && (
                <div className="w-40 h-24 border border-gray-200 rounded-md overflow-hidden print:border-gray-200">
                  <Image
                    src={urlFor(bon.chefServiceSignature).url()}
                    alt="Signature du chef de service"
                    width={160}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
              {!bon.chefServiceSignature && (
                <div className="w-40 h-24 border border-gray-200 rounded-md flex items-center justify-center bg-gray-50 print:border-gray-200 print:bg-gray-50">
                  <p className="text-sm text-gray-400 print:text-gray-400">Aucune signature</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BonDeTravaux;