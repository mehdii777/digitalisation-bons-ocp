import { defineQuery } from "next-sanity";

export const BONS_QUERY = defineQuery(`*[_type=="bon"] | order(_createdAt desc) {
  _id,
  num,
  idClient->{
  _id,
    identite
  },
  typeBon->{
  _id,
    typeBon
  },
  "analyses": analyses[]->{
  _id,
    analyse
  },
  status,
  validity,
  date
}`)

export const CLIENTS_QUERY = defineQuery(`*[_type=="client"] | order(identite asc) { 
    _id,
    identite
}`)

export const TYPES_QUERY = defineQuery(`*[_type=="typeBon"] | order(typeBon asc) {
  _id,
  typeBon
}`)

export const ANALYSES_QUERY = defineQuery(`*[_type=="analyse"] | order(analyse asc) {
    _id,
    analyse
}`)

export const BON_BY_ID_QUERY = defineQuery(`*[ _type == "bon" && _id == $id][0] {
  _id,
  num,
  idClient->{
    _id,
    identite
  },
  typeBon->{
    _id,
    typeBon
  },
  "analyses": analyses[]->{
    _id,
    analyse
  },
  status,
  validity,
  date,
chefServiceSignature {
    asset->
}}`)

export const GET_USER_BY_EMAIL = defineQuery(`*[_type == "user" && email == $email][0] {
  _id,
  email,
  role
}`)

export const USERS_QUERY = defineQuery(`*[_type == "user"] | order(_createdAt desc) {
  _id,
  email,
  role
}`)