// CHEMIN : src/app/bons-permanents/page.js

import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import Link from "next/link";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { BONS_QUERY } from "@/sanity/lib/queries";
import BonsTable from "../components/BonsTable"; // Le chemin vers le composant
import { ANALYSES_QUERY, CLIENTS_QUERY, TYPES_QUERY } from '@/sanity/lib/queries'
import { PlusCircle } from "lucide-react";

// On renomme la fonction pour plus de clarté
const ShowBonsPermanents = async () => {
    const session = await auth();
    if (!session) return redirect('/');

    // 1. On récupère TOUS les bons de la base de données
    const {data: bons} = await sanityFetch({query: BONS_QUERY}) 
    const {data: clients} = await sanityFetch({query: CLIENTS_QUERY});
    const {data: types} = await sanityFetch({query: TYPES_QUERY});
    const {data: analyses} = await sanityFetch({query: ANALYSES_QUERY});

    // 2. MODIFICATION : On filtre la liste pour ne garder que les bons "permanent"
    // Grâce à votre fichier queries.js, je sais que le champ s'appelle 'validity'
    const bonsPermanents = bons?.filter(bon => bon.validity === 'permanent') || [];

    return <>
        <Link
            href="/bons/create"
            className="flex items-center gap-2 text-white font-semibold bg-gradient-to-r from-[#287737] via-[#6fc22e] to-[#37ad3f] px-4 py-2 rounded-full shadow-lg hover:scale-102 transition-transform duration-300 hover:shadow-xl mt-4 mx-5"
        >
            <PlusCircle size={20} />
            Créer un bon
        </Link>

        {/* 3. MODIFICATION : On change le titre de la page */}
        <h1 className="text-4xl m-4 font-bold bg-gradient-to-r from-[#287737] via-[#6fc22e] to-[#37ad3f] bg-clip-text text-transparent">
          Table des Bons Permanents
        </h1>

        {/* 4. MODIFICATION : On utilise la liste filtrée et on ajoute une nouvelle propriété `isPermanentPage` */}
        {bonsPermanents?.length > 0 ? (
          <BonsTable 
            bons={bonsPermanents} 
            clients={clients} 
            types={types} 
            analyses={analyses} 
            isPermanentPage={true} // <-- C'est la clé de notre logique !
          />
        ) : (
          <p className="text-lg font-semibold text-red-600 animate-pulse pl-3">Aucun bon permanent trouvé.</p>
        )}
        <SanityLive />
    </>
}

// On exporte le composant renommé
export default ShowBonsPermanents;