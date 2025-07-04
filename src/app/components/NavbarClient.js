"use client";

import Image from "next/image";
import Notification from "./Notification";
import Link from "next/link";
import { motion } from "framer-motion";
import { handleSignIn, handleSignOut } from "../lib/AuthActions";
import { useEffect, useState } from "react";

export default function NavbarClient({ session, actualUser, users }) {
  console.log(users)
  const colors = {
    darkGreen: "#287737",
    mediumGreen: "#2b843d",
    lightGreen: "#6fc22e",
    hoverDark: "#2e8840",
    hoverMedium: "#37ad3f",
    hoverLight: "#7ad435",
    accent: "#73c42c"
  };

  const [authStatus, setAuthStatus] = useState(session?.user ? 'checking' : 'unauthorized');

  // Simplified authorization check
  useEffect(() => {
    if (!session?.user?.email) {
      setAuthStatus('unauthorized');
      return;
    }

    const email = session.user.email.toLowerCase();
    const isAllowed = users?.some(user => user.email.toLowerCase() === email);
    
    if (isAllowed) {
      setAuthStatus('authorized');
    } else if (users) { // Only reject if users data is loaded
      console.log("Unauthorized access attempt:", email);
      handleSignOut();
      setAuthStatus('unauthorized');
    }
  }, [session, users]);

  const SignIn = () => {
    handleSignIn();
  };

  // Don't show any auth-dependent UI while checking
  if (authStatus === 'checking') {
    return (
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative shadow-lg fixed top-0 left-0 w-full z-50 bg-white py-2"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Just show logo while checking */}
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
            <div className="text-gray-500">Vérification en cours...</div>
          </div>
        </div>
      </motion.nav>
    );
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative shadow-lg fixed top-0 left-0 w-full z-50 bg-white py-2"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
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

          {/* Right side - Auth & User Info */}
          <div className="flex items-center gap-4">
            {authStatus === 'authorized' ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  className="hidden sm:block"
                >
                  <p className="text-[#2e8840] font-bold text-lg">
                    Bienvenue {session?.user?.name.split(' ')[0]}
                  </p>
                </motion.div>
                {actualUser?.role == "admin" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                    type="submit"
                  >
                    <Link href='/admin/dashboard'>Tableau de bord</Link>
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                  type="submit"
                >
                  <Link href='/bons/documentation'>Documentation</Link>
                </motion.button>

                <motion.button
                  onClick={handleSignOut}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                  type="submit"
                >
                  Déconnexion
                </motion.button>

                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="ml-2"
                >
                  <Notification session={session} />
                </motion.div>
              </>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white font-medium py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                  type="submit"
                >
                  <Link href='/bons/documentation'>Documentation</Link>
                </motion.button>
                <motion.button
                  onClick={SignIn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#6fc22e] to-[#73c42c] text-white font-semibold py-2 px-4 rounded-md text-sm sm:text-base shadow-md hover:shadow-lg"
                  type="button"
                >
                  <span className="hidden sm:inline">Se connecter</span>
                  <span className="sm:hidden">Connexion</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}