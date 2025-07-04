import { GET_USER_BY_EMAIL, USERS_QUERY } from '@/sanity/lib/queries';
import { client } from '@/sanity/lib/client';
import { auth } from '../../../../auth';
import UserActions from '../UserActions';

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email;

  const me = await client.fetch(GET_USER_BY_EMAIL, { email });

  if (!me || me.role !== 'admin') {
    return <div className="p-4 text-red-500">Accès refusé.</div>;
  }

  const users = await client.fetch(USERS_QUERY);
  console.log("all users", users)

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">Gestion des utilisateurs</h1>
      <UserActions users={users} currentEmail={me.email} />
    </div>
  );
}