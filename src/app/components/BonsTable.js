// CHEMIN : src/app/components/BonsTable.js

'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Pencil, X, XCircle, FileDown, Eye, Plus } from 'lucide-react';
import * as XLSX from 'xlsx';

// ... (Le code pour ComboBox et MultiSelectComboBox ne change pas, donc je le cache pour la lisibilité)
// ... (Collez tout votre code de ComboBox et MultiSelectComboBox ici)

const ComboBox = ({ name, options, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  const filteredOptions = options.filter(option => 
    option && option.toLowerCase().includes((inputValue || '').toLowerCase())
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        if (inputValue && !options.some(option => 
          option && option.toLowerCase() === inputValue.toLowerCase()
        )) {
          setInputValue('');
          onChange({ target: { name, value: '' } });
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputValue, options, onChange, name]);
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange({ target: { name, value: newValue } });
    setIsOpen(true);
  };
  const handleSelectOption = (option) => {
    setInputValue(option);
    onChange({ target: { name, value: option } });
    setIsOpen(false);
  };
  const clearValue = () => {
    setInputValue('');
    onChange({ target: { name, value: '' } });
  };
  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          name={name}
          value={inputValue || ''}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full border rounded px-2 py-1 pr-8"
        />
        {inputValue && (
          <button 
            onClick={clearValue}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full border rounded mt-1 max-h-60 overflow-y-auto bg-white shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleSelectOption(option)}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
const MultiSelectComboBox = ({ name, options, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedOptions, setSelectedOptions] = useState(value || []);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    setSelectedOptions(value || []);
  }, [value]);
  const filteredOptions = options.filter(option => 
    option && option.toLowerCase().includes((inputValue || '').toLowerCase()) &&
    !selectedOptions.includes(option)
  );
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setInputValue('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };
  const handleSelectOption = (option) => {
    const newSelectedOptions = [...selectedOptions, option];
    setSelectedOptions(newSelectedOptions);
    onChange({ target: { name, value: newSelectedOptions } });
    setInputValue('');
    setIsOpen(false);
  };
  const removeOption = (optionToRemove) => {
    const newSelectedOptions = selectedOptions.filter(option => option !== optionToRemove);
    setSelectedOptions(newSelectedOptions);
    onChange({ target: { name, value: newSelectedOptions } });
  };
  const clearAll = () => {
    setSelectedOptions([]);
    onChange({ target: { name, value: [] } });
  };
  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <div className="w-full border rounded px-2 py-1 pr-8 flex flex-wrap items-center gap-1 min-h-[38px]">
          {selectedOptions.map((option) => (
            <span 
              key={option} 
              className="bg-blue-100 text-green-800 text-xs px-2 py-1 rounded flex items-center"
            >
              {option}
              <button 
                onClick={() => removeOption(option)}
                className="ml-1 text-green-500 hover:text-greenblue-700"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            className="flex-grow bg-transparent outline-none"
          />
        </div>
        {selectedOptions.length > 0 && (
          <button 
            onClick={clearAll}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full border rounded mt-1 max-h-60 overflow-y-auto bg-white shadow-lg">
          {filteredOptions.map((option) => (
            <li
              key={option}
              onClick={() => handleSelectOption(option)}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
// MODIFICATION 1 : Accepter la nouvelle propriété `isPermanentPage`
const BonsTable = ({ bons, clients, types, analyses, isPermanentPage = false }) => {
  const [filters, setFilters] = useState({
    num: '',
    client: '',
    typeBon: '',
    analyse: [],
    status: '',
    validity: '', // Ce filtre ne sera plus visible sur la nouvelle page
    date: '',
  });

  const safeClients = clients || [];
  const safeTypes = types || [];
  const safeAnalyses = analyses || [];
  const safeBons = bons || [];

  const filteredBons = useMemo(() => {
    // Le filtrage initial ne change pas, car il est fait sur la page parente.
    // On garde cette logique pour que la page originale continue de fonctionner.
    return safeBons.filter((bon) => {
      if (filters.num && !bon.num?.toString().includes(filters.num)) return false;
      if (filters.client && !bon.idClient?.identite?.toLowerCase().includes(filters.client.toLowerCase())) return false;
      if (filters.typeBon && !bon.typeBon?.typeBon?.toLowerCase().includes(filters.typeBon.toLowerCase())) return false;
      if (filters.analyse.length > 0) {
        const matchAllAnalyses = filters.analyse.every(selectedAnalysis => bon.analyses?.some(analysis => analysis.analyse?.toLowerCase() === selectedAnalysis.toLowerCase()));
        if (!matchAllAnalyses) return false;
      }
      // Les filtres pour status et validity ne s'appliqueront que sur la page originale
      if (!isPermanentPage && filters.status && bon.status !== filters.status) return false;
      if (!isPermanentPage && filters.validity && bon.validity !== filters.validity) return false;
      if (filters.date) {
        const bonDate = new Date(bon.date);
        const filterDate = new Date(filters.date);
        if (bonDate.toDateString() !== filterDate.toDateString()) return false;
      }
      return true;
    });
  }, [safeBons, filters, isPermanentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ num: '', client: '', typeBon: '', analyse: [], status: '', validity: '', date: '' });
  };

  const exportToExcel = () => {
    // ... La fonction d'export reste la même
     const dataToExport = filteredBons.map(bon => ({
      'Num': bon.num,
      'Client': bon.idClient?.identite || 'N/A',
      'Type Bon': bon.typeBon?.typeBon || 'N/A',
      'Details des travaux': bon.analyses?.map(analysis => analysis?.analyse).join(', ') || 'N/A',
      'Status': bon.status,
      'Validité': bon.validity || 'N/A',
      'Date': bon.date
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bons');
    const date = new Date();
    const fileName = `bons_export_${date.toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="m-3">
      {/* Filters Row */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ... (les filtres pour Num, Client, Type Bon, Analyses restent les mêmes) ... */}
         <div className="flex space-x-2 items-center">
    <input
      type="text"
      name="num"
      placeholder="Num"
      value={filters.num}
      onChange={handleFilterChange}
      className="border rounded px-2 py-1 w-full"
    />
  </div>
   <div className="flex space-x-2 items-center">
    <div className="flex-grow">
      <ComboBox
        name="client"
        options={safeClients.map(client => client?.identite).filter(Boolean)}
        value={filters.client}
        onChange={handleFilterChange}
        placeholder="Client"
      />
    </div>
    <Link href='/bons/create/client'>
      <button className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 hover:bg-green-200'>
        <Plus size={16} />
      </button>
    </Link>
  </div>
   <div className="flex space-x-2 items-center">
    <div className="flex-grow">
      <ComboBox
        name="typeBon"
        options={safeTypes.map(type => type?.typeBon).filter(Boolean)}
        value={filters.typeBon}
        onChange={handleFilterChange}
        placeholder="Type Bon"
      />
    </div>
    <Link href='/bons/create/type'>
      <button className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 hover:bg-green-200'>
        <Plus size={16} />
      </button>
    </Link>
  </div>
   <div className="flex space-x-2 items-center">
    <div className="flex-grow">
      <MultiSelectComboBox
        name="analyse"
        options={safeAnalyses.map(analysis => analysis?.analyse).filter(Boolean)}
        value={filters.analyse}
        onChange={handleFilterChange}
        placeholder="Détails des travaux"
      />
    </div>
    <Link href='/bons/create/analyse'>
      <button className='flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-800 hover:bg-green-200'>
        <Plus size={16} />
      </button>
    </Link>
  </div>
        
        {/* MODIFICATION 2 : Cacher les filtres inutiles sur la page des bons permanents */}
        {!isPermanentPage && (
          <>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded px-2 py-1 w-full">
              <option value="">Status</option>
              <option value="traité">Traité</option>
              <option value="en cours">En Cours</option>
            </select>
            
            <select name="validity" value={filters.validity} onChange={handleFilterChange} className="border rounded px-2 py-1 w-full">
              <option value="">Permanent ou non</option>
              <option value="permanent">permanent</option>
              <option value="non permanent">non permanent</option>
            </select>
          </>
        )}
        
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="border rounded px-2 py-1 w-full"/>
        
        <div className="flex items-center space-x-2">
          <button onClick={clearFilters} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center">
            <X size={16} className="mr-1" /> Vider
          </button>
          <button onClick={exportToExcel} className="bg-[#287737] hover:bg-green-800 text-white px-3 py-1 rounded flex items-center">
            <FileDown size={16} className="mr-1" /> Export
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#98ffa0]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Num</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Bon</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails des travaux</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              
              {/* MODIFICATION 3 : Cacher la colonne "Validité" qui n'est plus utile ici */}
              {!isPermanentPage && (
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validité</th>
              )}

              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBons.map((bon) => {
              // MODIFICATION 4 : La logique de calcul du statut en fonction de la date
              let statutTexte = bon.status;
              let statutCouleur = bon.status === 'traité' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';

              if (isPermanentPage) {
                  const aujourdhui = new Date();
                  const dateBon = new Date(bon.date);
                  aujourdhui.setHours(0, 0, 0, 0);
                  dateBon.setHours(0, 0, 0, 0);

                  if (dateBon < aujourdhui) {
                    statutTexte = 'Expiré';
                    statutCouleur = 'bg-red-200 text-red-800';
                  } else {
                    statutTexte = 'Valide';
                    statutCouleur = 'bg-green-200 text-green-800';
                  }
              }

              return (
                <tr key={bon._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">{bon.num}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{bon.idClient?.identite || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{bon.typeBon?.typeBon || 'N/A'}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {bon.analyses?.map((analysis) => analysis?.analyse).join(', ') || 'N/A'}
                  </td>
                  {/* MODIFICATION 5 : Afficher le statut (calculé ou original) */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statutCouleur}`}>
                      {statutTexte}
                    </span>
                  </td>
                  
                  {/* MODIFICATION 6 : Cacher la cellule de validité sur la nouvelle page */}
                  {!isPermanentPage && (
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bon.validity === 'permanent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {bon.validity || 'N/A'}
                      </span>
                    </td>
                  )}

                  <td className="px-4 py-3 whitespace-nowrap">{bon.date}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                     <div className='flex gap-3 justify-center'>
                  <div className="flex justify-center space-x-2">
                    <Link 
                      href={`/bons/edit/${bon._id}`} 
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Pencil size={18} />
                    </Link>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Link 
                      href={`/bons/show/${bon._id}`} 
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                    >
                      <Eye size={18} />
                    </Link>
                  </div>
                  </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredBons.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No bons match the current filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default BonsTable;