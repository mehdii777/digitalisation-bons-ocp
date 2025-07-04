import Link from 'next/link'
import React from 'react'
import { auth } from '../../../../auth'
import { redirect } from 'next/navigation';
import BonsFormCreate from '@/app/components/BonsFormCreate';
import { sanityFetch } from '@/sanity/lib/live'
import { ANALYSES_QUERY, CLIENTS_QUERY, TYPES_QUERY } from '@/sanity/lib/queries'
import { ArrowLeftCircle } from 'lucide-react';


const page = async() => {
    const session = await auth();
    if (!session) redirect('/');

    const {data: clients} = await sanityFetch({query: CLIENTS_QUERY});
    const {data: types} = await sanityFetch({query: TYPES_QUERY});
    const {data: analyses} = await sanityFetch({query: ANALYSES_QUERY});
    const status = ['en cours', 'traité'];
    const validity = ['permanent', 'non permanent'];


  return <>
  <div className='p-3'>
  <h1 className="text-3xl font-bold text-green-800">Créer un bon</h1>

{/* Return Link with Icon */}
<Link
  href="/bons"
  className="flex items-center text-lg text-[#287737] hover:text-[#37ad3f] font-medium gap-2 mt-4 transition-all duration-300"
>
  <ArrowLeftCircle size={24} />
  <span>Retourner au tableau des bons</span>
</Link>
  </div>
  <BonsFormCreate clients={clients} types={types}  analyses={analyses} status={status} validity={validity}/>
  </>
}

export default page