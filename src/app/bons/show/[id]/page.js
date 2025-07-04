import { BON_BY_ID_QUERY } from '@/sanity/lib/queries';
import React from 'react'
import { auth } from '../../../../../auth';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import { ArrowBigLeftIcon } from 'lucide-react';
import BonDetails from '@/app/components/BonDetails';

const page = async({params}) => {
    const session = await auth();
    if (!session) redirect('/');
        
    const id = (await params).id;
    const bon = await client.fetch(BON_BY_ID_QUERY, {id})
    console.log(bon)

   
    
    return <>
        <Link
            href="/bons"
            className="pl-3 flex items-center text-lg text-[#287737] hover:text-[#37ad3f] font-medium gap-2 mt-4 transition-all duration-300"
          >
            <ArrowBigLeftIcon size={24} />
            <span>Retourner au tableau des bons</span>
            </Link>
        <BonDetails id={id} bon={bon} />
        
        </>
}

export default page