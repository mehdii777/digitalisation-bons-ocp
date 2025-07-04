import React from 'react'
import { BookOpen, Lock, FileEdit, ListOrdered, Printer, Download, Bell, LogOut } from 'lucide-react'

const page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800 mb-4">Documentation Utilisateur</h1>
          <p className="text-xl text-green-600">
            Guide complet pour utiliser l'application OCP Bons de Travaux
          </p>
          <div className="mt-6 h-1 w-24 bg-gradient-to-r from-green-400 to-green-600 mx-auto rounded-full"></div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12 border border-green-100">
          <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
            <BookOpen className="mr-2" /> Table des Matières
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-green-800">
            <li><a href="#connexion" className="hover:text-green-600 hover:underline">Connexion à l'application</a></li>
            <li><a href="#navigation" className="hover:text-green-600 hover:underline">Navigation dans l'interface</a></li>
            <li><a href="#creation-bon" className="hover:text-green-600 hover:underline">Création d'un bon de travaux</a></li>
            <li><a href="#consultation-bons" className="hover:text-green-600 hover:underline">Consultation des bons</a></li>
            <li><a href="#modification-bon" className="hover:text-green-600 hover:underline">Modification d'un bon</a></li>
            <li><a href="#impression-bon" className="hover:text-green-600 hover:underline">Impression d'un bon</a></li>
            <li><a href="#export-donnees" className="hover:text-green-600 hover:underline">Export des données</a></li>
            <li><a href="#notifications" className="hover:text-green-600 hover:underline">Notifications</a></li>
            <li><a href="#deconnexion" className="hover:text-green-600 hover:underline">Déconnexion</a></li>
          </ol>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Connexion */}
          <section id="connexion" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
  <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
    <Lock className="mr-2" /> 1. Connexion à l'application
  </h2>
  <div className="prose prose-green max-w-none">
    <ol className="list-decimal list-inside space-y-2">
      <li>Accédez à l'URL de l'application</li>
      <li>Cliquez sur "Se connecter avec Google"</li>
      <li>Sélectionnez votre compte Google professionnel</li>
      <li>Autorisez l'accès à l'application</li>
    </ol>
    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
      <p><strong>Note :</strong> L'application utilise l'authentification sécurisée Google. Vous devez utiliser votre compte professionnel autorisé.</p>
    </div>
  </div>
</section>

          {/* Navigation */}
          <section id="navigation" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">2. Navigation dans l'interface</h2>
            <div className="prose prose-green max-w-none">
              <p>L'interface principale comprend :</p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Une barre de navigation en haut</strong> avec :
                  <ul className="list-[circle] list-inside ml-5">
                    <li>Logo OCP (retour à l'accueil)</li>
                    <li>Message de bienvenue</li>
                    <li>Bouton Documentation</li>
                    <li>Bouton Déconnexion</li>
                    <li>Icône de notifications</li>
                  </ul>
                </li>
                <li><strong>Le contenu principal</strong> qui change selon la page consultée</li>
              </ul>
            </div>
          </section>

          {/* Création bon */}
          <section id="creation-bon" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
  <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
    <FileEdit className="mr-2" /> 3. Création d'un bon de travaux
  </h2>
  <div className="prose prose-green max-w-none">
    <ol className="list-decimal list-inside space-y-2">
      <li>Cliquez sur "Créer un bon" (bouton vert en haut)</li>
      <li>Remplissez le formulaire :
        <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
          <li><strong>Numéro</strong> : Saisissez le numéro du bon</li>
          <li><strong>Client</strong> : Sélectionnez dans la liste existante</li>
          <li><strong>Type de bon</strong> : Sélectionnez dans la liste existante</li>
          <li><strong>Détails des travaux</strong> : Sélectionnez une ou plusieurs analyses existantes</li>
          <li><strong>Statut</strong> : "en cours" ou "traité"</li>
          <li><strong>Validité</strong> : "permanent" ou "non permanent"</li>
          <li><strong>Date</strong> : Sélectionnez la date</li>
          <li><strong>Signature</strong> : Importez l'image de signature</li>
        </ul>
      </li>
      <li>Cliquez sur "Valider"</li>
    </ol>
    <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                <p><strong>Note :</strong> Toute création déclenche une notification visible par tous les utilisateurs.</p>
              </div>
  </div>
</section>

          {/* Consultation */}
          <section id="consultation-bons" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
  <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
    <ListOrdered className="mr-2" /> 4. Consultation et Filtrage des bons
  </h2>
  <div className="prose prose-green max-w-none">
    <p>La table des bons vous permet de :</p>
    <ul className="list-disc list-inside space-y-2">
      <li>
        <strong>Filtrer les données</strong> avec les options en haut du tableau :
        <ul className="list-[circle] list-inside ml-5 mt-1">
          <li>Par numéro de bon</li>
          <li>Par client (sélection dans liste)</li>
          <li>Par type de bon (sélection dans liste)</li>
          <li>Par détails des travaux (sélection dans liste)</li>
          <li>Par statut</li>
          <li>Par validité</li>
          <li>Par date</li>
        </ul>
      </li>
      <li>
        <strong>Ajouter de nouveaux éléments</strong> via les icônes <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-800">+</span> à côté de chaque filtre :
        <ul className="list-[circle] list-inside ml-5 mt-1">
          <li>Nouveau client</li>
          <li>Nouveau type de bon</li>
          <li>Nouvelle analyse</li>
        </ul>
      </li>
      <li><strong>Exporter les données</strong> au format Excel</li>
      <li><strong>Consulter ou modifier</strong> un bon existant</li>
    </ul>
  </div>
</section>

          {/* Modification */}
          <section id="modification-bon" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <FileEdit className="mr-2" /> 5. Modification d'un bon
            </h2>
            <div className="prose prose-green max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>Dans le tableau des bons, localisez le bon à modifier</li>
                <li>Cliquez sur l'icône <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800">✏️</span> dans la colonne "Actions"</li>
                <li>Modifiez les champs nécessaires :
                  <ul className="list-disc list-inside ml-5 mt-2 space-y-1">
                    <li>Tous les champs sont modifiables sauf la signature du bon</li>
                    <li>Utilisez les mêmes listes de sélection que pour la création</li>
                  </ul>
                </li>
                <li>Cliquez sur "Modifier" pour enregistrer les changements</li>
              </ol>
              
              <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-700">
                <p><strong>Note :</strong> Toute modification déclenche une notification visible par tous les utilisateurs.</p>
              </div>

              
            </div>
          </section>
          {/* Impression */}
          <section id="impression-bon" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <Printer className="mr-2" /> 6. Impression d'un bon
            </h2>
            <div className="prose prose-green max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>Consultez un bon (icône œil 👁️)</li>
                <li>Cliquez sur l'icône imprimante (🖨️)</li>
                <li>Configurez l'impression dans le dialogue navigateur</li>
                <li>Imprimez ou sauvegardez en PDF</li>
              </ol>
            </div>
          </section>

          {/* Export */}
          <section id="export-donnees" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <Download className="mr-2" /> 7. Export des données
            </h2>
            <div className="prose prose-green max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>Appliquez des filtres si nécessaire</li>
                <li>Cliquez sur "Export" (bouton vert)</li>
                <li>Un fichier Excel est généré avec tous les bons visibles</li>
              </ol>
            </div>
          </section>

          {/* Notifications */}
          <section id="notifications" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <Bell className="mr-2" /> 8. Notifications
            </h2>
            <div className="prose prose-green max-w-none">
              <p>L'icône cloche (🔔) affiche :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Un compteur de nouvelles notifications</li>
                <li>Une notification s'affiche lorsqu'un utilisateur crée ou modifie un bon, indiquant le nom du bon et l'utilisateur concerné (ex: "Utilisateur: Mehdi El Filali a modifié un bon n° : BT-2024-567")</li>                <li>Option pour effacer les notifications</li>
              </ul>
            </div>
          </section>

          {/* Déconnexion */}
          <section id="deconnexion" className="bg-white rounded-xl shadow-lg p-6 border border-green-100">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <LogOut className="mr-2" /> 9. Déconnexion
            </h2>
            <div className="prose prose-green max-w-none">
              <ol className="list-decimal list-inside space-y-2">
                <li>Cliquez sur "Déconnexion" en haut à droite</li>
                <li>Vous êtes redirigé vers la page de connexion</li>
              </ol>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-green-600 border-t border-green-200 pt-8">
          <p>Pour toute question ou problème, contactez le support technique OCP.</p>
          <p className="mt-2 text-sm">© {new Date().getFullYear()} OCP - Tous droits réservés</p>
        </div>
      </div>
    </div>
  )
}

export default page