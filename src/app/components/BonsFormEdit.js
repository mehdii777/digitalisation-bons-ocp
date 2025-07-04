'use client'

import { useState, useRef, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateBon } from '@/sanity/lib/actions'
import { Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

export default function BonsFormEdit({ 
  bon, 
  clients, 
  types,  
  analyses, 
  status,
  validity
}) {
  const router = useRouter()
  const [selectedAnalyses, setSelectedAnalyses] = useState(bon?.analyses || [])
  const [searchTerm, setSearchTerm] = useState('')
  const [isAnalysesDropdownOpen, setIsAnalysesDropdownOpen] = useState(false)
  const [clientSearch, setClientSearch] = useState(bon?.idClient?.identite || '')
  const [typeSearch, setTypeSearch] = useState(bon?.typeBon?.typeBon || '')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [selectedClient, setSelectedClient] = useState(bon?.idClient || null)
  const [selectedType, setSelectedType] = useState(bon?.typeBon || null)

  const analysesDropdownRef = useRef(null)
  const clientDropdownRef = useRef(null)
  const typeDropdownRef = useRef(null)

  // Filter analyses based on search term and exclude already selected analyses
  const filteredAnalyses = analyses && analyses
    .filter(analyse => 
      analyse.analyse.toLowerCase().includes(searchTerm.toLowerCase()) && 
      !selectedAnalyses.some(selectedAnalyse => selectedAnalyse._id === analyse._id)
    )

  // Filter clients based on search term
  const filteredClients = clients.filter(client =>
    client.identite.toLowerCase().includes(clientSearch.toLowerCase())
  )

  // Filter types based on search term
  const filteredTypes = types.filter(type =>
    type.typeBon.toLowerCase().includes(typeSearch.toLowerCase())
  )

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (analysesDropdownRef.current && !analysesDropdownRef.current.contains(event.target)) {
        setIsAnalysesDropdownOpen(false)
      }
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target)) {
        setShowClientDropdown(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target)) {
        setShowTypeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle analysis selection
  const handleAnalysisSelect = (analyse) => {
    const newSelectedAnalyses = [...selectedAnalyses, analyse]
    setSelectedAnalyses(newSelectedAnalyses)
    setSearchTerm('')
    setIsAnalysesDropdownOpen(false)
  }

  // Handle analysis removal
  const handleAnalysisRemove = (analyseToRemove) => {
    const newSelectedAnalyses = selectedAnalyses.filter(
      analyse => analyse._id !== analyseToRemove._id
    )
    setSelectedAnalyses(newSelectedAnalyses)
  }

  // Handle client selection
  const handleClientSelect = (client) => {
    setSelectedClient(client)
    setClientSearch(client.identite)
    setShowClientDropdown(false)
  }

  // Handle type selection
  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setTypeSearch(type.typeBon)
    setShowTypeDropdown(false)
  }

  const [isPending, startTransition] = useTransition();
  // Server Action submission
  const handleUpdate = async (formData) => {
    startTransition(async() => {
      const dataToSubmit = {
        num: formData.get('num'),
        identite: selectedClient?._id || formData.get('identite'),
        type: selectedType?._id || formData.get('type'),
        analyse: selectedAnalyses.map(a => a._id),
        status: formData.get('status'),
        validity: formData.get('validity'),
        date: formData.get('date')
      }
    

    try {
      const result = await updateBon(bon._id, dataToSubmit)
      if (result?._id) {
        router.push('/bons')
        toast("La modification du bon a été modifier avec succès")
      }
    } catch (error) {
      console.error(error)
      toast("La modification du bon a échoué")
      
    }
  })

  }

  return (
    <div className="container mx-auto p-4">
      <form action={handleUpdate} className="space-y-4">
        {/* Num */}
        <div className="flex flex-col">
          <label className="font-semibold text-[#007e0a]">Num:</label>
          <input
            type="text"
            name="num"
            defaultValue={bon?.num || ''}
            placeholder="Enter un numéro"
            className="border p-2 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
        </div>

        {/* Identite */}
        <div className="flex flex-col relative mb-4" ref={clientDropdownRef}>
          <label className="font-semibold text-[#007e0a]">Identité:</label>
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => {
              setClientSearch(e.target.value)
              setShowClientDropdown(true)
              if (!e.target.value) setSelectedClient(null)
            }}
            onClick={() => setShowClientDropdown(true)}
            placeholder="Rechercher client..."
            className="border p-2 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
          <input type="hidden" name="identite" value={selectedClient?._id || ''} />
          
          {showClientDropdown && (
            <div className="absolute z-10 w-full mt-1 top-full left-0 border rounded shadow-lg bg-white max-h-60 overflow-y-auto">
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <div
                    key={client._id}
                    onClick={() => handleClientSelect(client)}
                    className="p-2 hover:bg-green-50 cursor-pointer transition duration-200"
                  >
                    {client.identite}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center">
                  Aucun clients trouvé
                </div>
              )}
            </div>
          )}
        </div>

        {/* Type */}
        <div className="flex flex-col relative mb-4" ref={typeDropdownRef}>
          <label className="font-semibold text-[#007e0a]">Type:</label>
          <input
            type="text"
            value={typeSearch}
            onChange={(e) => {
              setTypeSearch(e.target.value)
              setShowTypeDropdown(true)
              if (!e.target.value) setSelectedType(null)
            }}
            onClick={() => setShowTypeDropdown(true)}
            placeholder="Rechercher type..."
            className="border p-2 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
          <input type="hidden" name="type" value={selectedType?._id || ''} />
          
          {showTypeDropdown && (
            <div className="absolute z-10 w-full mt-1 top-full left-0 border rounded shadow-lg bg-white max-h-60 overflow-y-auto">
              {filteredTypes.length > 0 ? (
                filteredTypes.map(type => (
                  <div
                    key={type._id}
                    onClick={() => handleTypeSelect(type)}
                    className="p-2 hover:bg-green-50 cursor-pointer transition duration-200"
                  >
                    {type.typeBon}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center">
                  Aucun types trouvé
                </div>
              )}
            </div>
          )}
        </div>

        {/* Analyses - Multi-Select */}
        <div className="flex flex-col relative" ref={analysesDropdownRef}>
          <label className="font-semibold text-[#007e0a]">Détails des travaux:</label>
          <input
            type="hidden"
            name="analyse"
            value={selectedAnalyses.map(a => a._id).join(',')}
          />
          <div 
            className="flex flex-wrap gap-2 border p-2 rounded bg-white"
            onClick={() => setIsAnalysesDropdownOpen(!isAnalysesDropdownOpen)}
          >
            {selectedAnalyses.map(analyse => (
              <div 
                key={analyse._id} 
                className="
                  flex items-center bg-green-100 text-green-800 
                  px-2 py-1 rounded-full text-sm
                  gap-1 
                "
              >
                {analyse.analyse}
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAnalysisRemove(analyse)
                  }}
                  className="text-green-500 hover:text-green-700"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            
            {selectedAnalyses.length === 0 && (
              <span className="text-gray-500">
                Choisir les détails des travaux
              </span>
            )}
          </div>

          {/* Dropdown */}
          {isAnalysesDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 top-full left-0 border rounded shadow-lg bg-white max-h-60 overflow-y-auto">
              {/* Search Input */}
              <input 
                type="text"
                placeholder="Rechercher détails des travaux..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border-b focus:outline-none focus:ring focus:ring-green-300"
              />

              {/* Analyses List */}
              {filteredAnalyses && filteredAnalyses.length > 0 ? (
                filteredAnalyses.map(analyse => (
                  <div
                    key={analyse._id}
                    onClick={() => handleAnalysisSelect(analyse)}
                    className="p-2 hover:bg-green-50 cursor-pointer transition duration-200"
                  >
                    {analyse.analyse}
                  </div>
                ))
              ) : (
                <div className="p-2 text-gray-500 text-center">
                  Aucun détail de travaux trouvé
                </div>
              )}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label className="font-semibold">Status:</label>
          <select
            name="status"
            defaultValue={bon?.status || ''}
            className="border p-2 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          >
            <option value="">Choisir un status</option>
            {status.map((st, index) => (
              <option key={index} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Validity */}
        <div className="flex flex-col">
          <label className="font-semibold text-[#007e0a]">Validity:</label>
          <div className="flex gap-4 mt-1">
            {validity.map((option, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="validity"
                  value={option}
                  defaultChecked={option === (bon?.validity || '')}
                  className="mr-2 focus:ring focus:ring-green-300"
                  required             
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col">
          <label className="font-semibold">Date:</label>
          <input
            type="date"
            name="date"
            defaultValue={bon?.date || ''}
            className="border p-2 rounded focus:outline-none focus:ring focus:ring-green-300"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
        <button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-[#287737] via-[#6fc22e] to-[#37ad3f] text-white font-semibold py-2 rounded-md shadow-md hover:scale-105 transition-transform duration-200 hover:shadow-lg flex justify-center items-center"
      >
        {isPending ? (
          <>
            <Loader2 size={20} className="animate-spin mr-2" />
            Chargement...
          </>
        ) : (
          'Modifier'
        )}
      </button>
        </div>
      </form>
    </div>
  )
}