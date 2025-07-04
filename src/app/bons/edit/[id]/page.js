import React from 'react'
import { redirect } from 'next/navigation';
import BonsFormEdit from '@/app/components/BonsFormEdit';
import { auth } from '../../../../../auth';
import { BON_BY_ID_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { sanityFetch } from '@/sanity/lib/live';
import { ANALYSES_QUERY, CLIENTS_QUERY, TYPES_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link';
import { ArrowLeftCircle } from 'lucide-react';


const page = async({params}) => {
    const session = await auth();
    if (!session) redirect('/');
    
    const id = (await params).id;
    console.log(id) 
    const bon = await client.fetch(BON_BY_ID_QUERY, {id})
    const {data: clients} = await sanityFetch({query: CLIENTS_QUERY});
    const {data: types} = await sanityFetch({query: TYPES_QUERY});
    const {data: analyses} = await sanityFetch({query: ANALYSES_QUERY});
    const status = ['en cours', 'traité'];
    const validity = ['permanent', 'non permanent'];

  return <>
  <Link
    href="/bons"
    className="pl-3 flex items-center text-lg text-[#287737] hover:text-[#37ad3f] font-medium gap-2 mt-4 transition-all duration-300"
  >
    <ArrowLeftCircle size={24} />
    <span>Retourner au tableau des bons</span>
  </Link>
  <BonsFormEdit bon={bon} clients={clients} types={types} analyses={analyses} status={status} validity={validity}/>
  </>
}

export default page