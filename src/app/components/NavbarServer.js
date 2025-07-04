// Navbar.jsx (server component)
import { GET_USER_BY_EMAIL, USERS_QUERY } from "@/sanity/lib/queries";
import { auth } from "../../../auth";
import NavbarClient from "./NavbarClient";
import { client } from "@/sanity/lib/client";

export default async function NavbarServer() {
  const session = await auth();
  const email = session?.user?.email;
  const users = await client.fetch(USERS_QUERY)
  console.log(users)
  if (!email) {
    return <NavbarClient session={session} actualUser={null} />;

  }
  const actualUser = await client.fetch(GET_USER_BY_EMAIL, { email });
  
  return <NavbarClient session={session} actualUser = {actualUser} users={users}/>;

}