'use client';

import { useState } from 'react';
import {
  createUser,
  deleteUser,
  makeUserAdmin,
  revokeAdmin,
} from '@/sanity/lib/actions';

export default function UserActions({ users, currentEmail }) {
  const [emailInput, setEmailInput] = useState('');
  const [roleInput, setRoleInput] = useState('user');
  const [allUsers, setAllUsers] = useState(users);

  const handleAdd = async () => {
    if (!emailInput) return;

    const res = await createUser({ email: emailInput.toLowerCase(), role: roleInput });
    if (!res.error) {
      setAllUsers([...allUsers, res]);
      setEmailInput('');
      setRoleInput('user');
    }
  };

  const handleDelete = async (userId) => {
    await deleteUser(userId);
    setAllUsers(allUsers.filter((u) => u._id !== userId));
  };

  const handleMakeAdmin = async (email) => {
    await makeUserAdmin(email);
    setAllUsers(
      allUsers.map((u) => (u.email === email ? { ...u, role: 'admin' } : u))
    );
  };

  const handleRevokeAdmin = async (email) => {
    await revokeAdmin(email);
    setAllUsers(
      allUsers.map((u) => (u.email === email ? { ...u, role: 'user' } : u))
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Add User Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-[#287737] mb-4">Ajouter un nouveau utilisateur</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            className="border border-gray-300 px-4 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#6fc22e]"
            placeholder="Entrer email address"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <select
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6fc22e]"
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-[#2b843d] to-[#6fc22e] text-white px-6 py-2 rounded-lg font-medium hover:from-[#287737] hover:to-[#5aa823] transition-all shadow-md"
          >
            Ajouter
          </button>
        </div>
      </div>
  
      {/* Users List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#2b843d] to-[#6fc22e] p-4">
          <h2 className="text-xl font-bold text-white">Gerer les utilisateurs</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {allUsers.map((user) => (
            <li
              key={user._id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <p className="font-semibold text-gray-800">{user.email}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' 
                        ? 'bg-[#2b843d] text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.role === 'user' && (
                    <button
                      onClick={() => handleMakeAdmin(user.email)}
                      className="bg-gradient-to-r from-[#2b843d] to-[#37ad3f] text-white px-3 py-1 rounded-md text-sm font-medium hover:from-[#287737] hover:to-[#2e8840] transition-all"
                    >
                      Donner accès admin
                    </button>
                  )}
                  {user.role === 'admin' && user.email !== currentEmail && (
                    <button
                      onClick={() => handleRevokeAdmin(user.email)}
                      className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] text-white px-3 py-1 rounded-md text-sm font-medium hover:from-[#d97706] hover:to-[#f59e0b] transition-all"
                    >
                      Retirer accès admin
                    </button>
                  )}
                  {user.email !== currentEmail && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-gradient-to-r from-[#ef4444] to-[#f87171] text-white px-3 py-1 rounded-md text-sm font-medium hover:from-[#dc2626] hover:to-[#ef4444] transition-all"
                    >
                      Suprimer
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
