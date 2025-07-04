import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import Link from "next/link";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { BONS_QUERY } from "@/sanity/lib/queries";
import BonsTable from "../components/BonsTable";
import { ANALYSES_QUERY, CLIENTS_QUERY, TYPES_QUERY } from '@/sanity/lib/queries'
import { PlusCircle } from "lucide-react";


const ShowBon = async () => {
    const session = await auth();
    if (!session) return redirect('/');

    const {data: bons} = await sanityFetch({query: BONS_QUERY}) 
    const {data: clients} = await sanityFetch({query: CLIENTS_QUERY});
    const {data: types} = await sanityFetch({query: TYPES_QUERY});
    const {data: analyses} = await sanityFetch({query: ANALYSES_QUERY});

    return <>
        <Link
            href="/bons/create"
            className="flex items-center gap-2 text-white font-semibold bg-gradient-to-r from-[#287737] via-[#6fc22e] to-[#37ad3f] px-4 py-2 rounded-full shadow-lg hover:scale-102 transition-transform duration-300 hover:shadow-xl mt-4 mx-5"
        >
            <PlusCircle size={20} />
            Créer un bon
        </Link>

        <h1 className="text-4xl m-4 font-bold bg-gradient-to-r from-[#287737] via-[#6fc22e] to-[#37ad3f] bg-clip-text text-transparent">
          Table des Bons
        </h1>

        {bons?.length > 0 ? (
          <BonsTable bons={bons} clients={clients} types={types} analyses={analyses} />
        ) : (
          <p className="text-lg font-semibold text-red-600 animate-pulse pl-3">Aucun resultats trouvé</p>
        )}
        <SanityLive />
    </>
}
export default ShowBon