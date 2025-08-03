// CHEMIN : src/app/components/NavbarClient.js
// VERSION FINALE SIMPLIFIÉE

"use client";

import Image from "next/image";
import Notification from "./Notification";
import Link from "next/link";
import { motion } from "framer-motion";
import { handleSignIn, handleSignOut } from "../lib/AuthActions";

// On renomme pour plus de clarté
export default function NavbarContents({ session, actualUser }) {

  const SignIn = () => {
    handleSignIn();
  };

  const SignOut = () => {
    handleSignOut();
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative shadow-lg fixed top-0 left-0 w-full z-50 bg-white py-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Toujours visible */}
          <Link href="/">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              className="flex-shrink-0 cursor-pointer p-2"
            >
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/OCP_Group.svg/1200px-OCP_Group.svg.png"
                alt="logo ocp"
                height={40}
                width={40}
                className="h-8 w-8 sm:h-10 sm:w-10"
              />
            </motion.div>
          </Link>

          {/* Section droite des boutons */}
          <div className="flex items-center gap-4">

            {/* Affiche "Tableau de bord" et "Déconnexion" si l'utilisateur est connecté */}
            {session?.user ? (
              <>
                <motion.div className="hidden sm:block">
                  <p className="text-[#2e8840] font-bold text-lg">
                    Bienvenue {session.user.name.split(' ')[0]}
                  </p>
                </motion.div>
                
                {/* Affiche le tableau de bord uniquement si l'utilisateur est un admin */}
                {actualUser?.role === "admin" && (
                  <Link href='/admin/dashboard'>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                    >
                      Tableau de bord
                    </motion.button>
                  </Link>
                )}
                
                <Link href='/bons/documentation'>
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                   >
                     Documentation
                   </motion.button>
                </Link>

                <motion.button
                  onClick={SignOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                >
                  Déconnexion
                </motion.button>

                <motion.div whileHover={{ scale: 1.1 }} className="ml-2">
                  <Notification session={session} />
                </motion.div>
              </>
            ) : (
              // Affiche "Documentation" et "Se connecter" si l'utilisateur est un visiteur
              <>
                <Link href='/bons/documentation'>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                  >
                    Documentation
                  </motion.button>
                </Link>

                <motion.button
                  onClick={SignIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#6fc22e] to-[#73c42c] text-white font-semibold py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                >
                  Se connecter
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}