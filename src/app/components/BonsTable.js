'use client'
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Pencil, X, XCircle, FileDown, Eye, Plus   } from 'lucide-react';
import * as XLSX from 'xlsx';

const ComboBox = ({ name, options, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Add effect to sync with parent value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Add null check before calling toLowerCase
  const filteredOptions = options.filter(option => 
    option && option.toLowerCase().includes((inputValue || '').toLowerCase())
  );

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        
        // If input doesn't match any option, reset to empty
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

  // Add effect to sync with parent value changes
  useEffect(() => {
    setSelectedOptions(value || []);
  }, [value]);

  // Add null check before calling toLowerCase
  const filteredOptions = options.filter(option => 
    option && option.toLowerCase().includes((inputValue || '').toLowerCase()) &&
    !selectedOptions.includes(option)
  );

  // Handle clicks outside the dropdown
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

const BonsTable = ({ bons, clients, types, analyses }) => {
  console.log("show: ", bons)

  // const handleDelete = (id) => {

  // }
  const [filters, setFilters] = useState({
    num: '',
    client: '',
    typeBon: '',
    analyse: [],
    status: '',
    validity: '',
    date: '',
  });

  // Make sure props have default values to avoid null/undefined errors
  const safeClients = clients || [];
  const safeTypes = types || [];
  // const safeQualities = qualities || [];
  const safeAnalyses = analyses || [];
  const safeBons = bons || [];

  const filteredBons = useMemo(() => {
    return safeBons.filter((bon) => {
      // Number filter
      if (filters.num && !bon.num?.toString().includes(filters.num)) return false;

      // Client filter
      if (filters.client && 
          !bon.idClient?.identite?.toLowerCase().includes(filters.client.toLowerCase())) 
        return false;

      // Type Bon filter
      if (filters.typeBon && 
          !bon.typeBon?.typeBon?.toLowerCase().includes(filters.typeBon.toLowerCase())) 
        return false;

      // Qualité filter
      // if (filters.qualite && 
      //     !bon.qualite?.quality?.toLowerCase().includes(filters.qualite.toLowerCase())) 
      //   return false;

      // Analyses filter
      if (filters.analyse.length > 0) {
        // Check if ALL selected analyses exist in the bon's analyses
        const matchAllAnalyses = filters.analyse.every(selectedAnalysis => 
          bon.analyses?.some(analysis => 
            analysis.analyse?.toLowerCase() === selectedAnalysis.toLowerCase()
          )
        );
        if (!matchAllAnalyses) return false;
      }

      // Status filter
      if (filters.status && bon.status !== filters.status) return false;

      if (filters.validity && bon.validity !== filters.validity) return false;

      // Date filter
      if (filters.date) {
        const bonDate = new Date(bon.date);
        const filterDate = new Date(filters.date);
        if (bonDate.toDateString() !== filterDate.toDateString()) return false;
      }

      return true;
    });
  }, [safeBons, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      num: '',
      client: '',
      typeBon: '',
      analyse: [],
      status: '',
      validity: '',
      date: '',
    });
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const dataToExport = filteredBons.map(bon => ({
      'Num': bon.num,
      'Client': bon.idClient?.identite || 'N/A',
      'Type Bon': bon.typeBon?.typeBon || 'N/A',
      // 'Qualité': bon.qualite?.quality || 'N/A',
      'Details des travaux': bon.analyses?.map(analysis => analysis?.analyse).join(', ') || 'N/A',
      'Status': bon.status,
      'Validité': bon.validity || 'N/A',
      'Date': bon.date
    }));

    // Create a new workbook and add a worksheet with data
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bons');

    // Generate a filename
    const date = new Date();
    const fileName = `bons_export_${date.toISOString().split('T')[0]}.xlsx`;

    // Write the workbook and save as an Excel file
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="m-3">
      {/* Filters Row */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Num input */}
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
  
  {/* Client dropdown with add button */}
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
  
  {/* Type Bon dropdown with add button */}
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
  
  {/* Analyses multi-select with add button */}
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
  
  {/* Status dropdown */}
  <select
    name="status"
    value={filters.status}
    onChange={handleFilterChange}
    className="border rounded px-2 py-1 w-full"
  >
    <option value="">Status</option>
    <option value="traité">Traité</option>
    <option value="en cours">En Cours</option>
  </select>
  
  {/* Validity dropdown */}
  <select
    name="validity"
    value={filters.validity}
    onChange={handleFilterChange}
    className="border rounded px-2 py-1 w-full"
  >
    <option value="">Permanent ou non</option>
    <option value="permanent">permanent</option>
    <option value="non permanent">non permanent</option>
  </select>
  
  {/* Date input */}
  <input
    type="date"
    name="date"
    value={filters.date}
    onChange={handleFilterChange}
    className="border rounded px-2 py-1 w-full"
  />
  
  {/* Action buttons */}
  <div className="flex items-center space-x-2">
    <button 
      onClick={clearFilters}
      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center"
    >
      <X size={16} className="mr-1" /> Vider
    </button>
    
    <button 
      onClick={exportToExcel}
      className="bg-[#287737] hover:bg-green-800 text-white px-3 py-1 rounded flex items-center"
    >
      <FileDown size={16} className="mr-1" /> Export
    </button>
  </div>
</div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-[#98ffa0]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Num</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Bon</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualité</th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Détails des travaux</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validité</th>

              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBons.map((bon) => (
              <tr key={bon._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">{bon.num}</td>
                <td className="px-4 py-3 whitespace-nowrap">{bon.idClient?.identite || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">{bon.typeBon?.typeBon || 'N/A'}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {bon.analyses?.map((analysis) => analysis?.analyse).join(', ') || 'N/A'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${bon.status === 'traité' ? 'bg-green-100 text-green-800' : 
                      bon.status === 'en cours' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {bon.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${bon.validity === 'permanent' ? 'bg-green-100 text-green-800' : 
                      bon.validity === 'non permanent' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {bon.validity || 'N/A'}
                  </span>
                </td>
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
            ))}
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