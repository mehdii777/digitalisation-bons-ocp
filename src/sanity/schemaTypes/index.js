import {client} from "@/sanity/schemaTypes/client";
import {bon} from "@/sanity/schemaTypes/bon";
import {type} from "@/sanity/schemaTypes/type";
import {analyse} from "@/sanity/schemaTypes/analyse";
import {user} from "@/sanity/schemaTypes/user";


export const schema = {
  types: [client, bon, type, analyse, user],
}
