'use client'
import { ArrowLeftCircle } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import CreateAnalyse from '@/app/components/CreateAnalyse'



const page = () => {
     
  return <>
      <Link
    href="/bons"
    className="pl-3 flex items-center text-lg text-[#287737] hover:text-[#37ad3f] font-medium gap-2 mt-4 transition-all duration-300"
  >
    <ArrowLeftCircle size={24} />
    <span>Retourner au tableau des bons</span>
    </Link>
<div className="flex flex-col items-center justify-center min-h-screen">
  
  <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md mx-auto">
    <h1 className="text-2xl font-bold bg-gradient-to-r from-[#287737] via-[#6fc22e] to-[#37ad3f] bg-clip-text text-transparent">
      Ajouter une analyse
    </h1>

    <CreateAnalyse />

  </div>
</div>

  </>
}

export default page