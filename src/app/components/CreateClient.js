'use client'
import { createClient } from '@/sanity/lib/actions'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useTransition } from 'react'
import { toast } from 'sonner'

const CreateClient = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData) => {
        startTransition(async () => {
      const client = formData.get('client');
      const dataToSubmit = {
        identite: client
      };
    
        console.log(dataToSubmit)
    
        try {
          const result = await createClient(dataToSubmit)

          if (result) {
            router.push('/bons')
            toast("client a été créé avec succès")
          }
        } catch (error) {
          console.error(error)
          toast("La création du client a échoué")
        }
    })
      }

      
  return <form action={handleSubmit} className="flex flex-col gap-3 w-full">
      <label className="text-gray-700 font-medium">Client:</label>
      
      <input
        type="text"
        name="client"
        placeholder="Enter un client..."
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#6fc22e] transition-all"
        disabled={isPending}
      />
      
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
          'Valider'
        )}
      </button>
    </form>


}

export default CreateClient