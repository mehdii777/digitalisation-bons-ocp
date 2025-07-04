'use server';

import { writeClient } from "@/sanity/lib/write-client";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { client } from "./client";
import { GET_USER_BY_EMAIL } from "./queries";

export const createBon = async (formData) => {
    const session = await auth();
    const username = session?.user?.name;
    
    if (!session) redirect('/');
    if (!formData) {
      return { error: "No form data received!" };
    }
  
    try {
      // Extract form fields
      const num = formData.get('num');
      const identite = formData.get('identite');
      const type = formData.get('type');
      const status = formData.get('status');
      const validity = formData.get('validity');
      const date = formData.get('date');
      
      // Handle analyses array
      const analyseValues = formData.getAll('analyse');
      const analyses = analyseValues.map(id => ({
        _type: 'reference',
        _ref: id
      }));
  
      // Handle the signature file upload
      const signatureFile = formData.get('signatureFile');
      let signature;
      
      if (signatureFile && signatureFile.size > 0) {
        // Upload the image to Sanity
        signature = await writeClient.assets.upload('image', signatureFile, {
          filename: signatureFile.name
        });
      }
  
      // Create the bon object
      const bon = {
        num,
        idClient: {
          _type: 'reference',
          _ref: identite,
        },
        typeBon: {
          _type: 'reference',
          _ref: type,
        },
        analyses,
        status,
        validity,
        date,
        chefServiceSignature: signature ? {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: signature._id
          }
        } : undefined,
        user: username
      };
  
      // Create the bon in Sanity
      const result = await writeClient.create({
        _type: 'bon',
        ...bon
      });
  
      return result;
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  }


export const updateBon = async (bonId, form) => {
    const session = await auth();
    const username = session.user.name

    if (!session) redirect('/');

    if (!form) {
        return { error: "No form data received!" };
    }

    console.log("server update", form)

    const {num, identite, type, analyse, status, validity, date} = form
    
    try {
        const bon = {
            num,
            idClient: {
                _type: 'reference',
                _ref: identite,
            }, 
            typeBon: {
                _type: 'reference',
                _ref: type,
            },  
            analyses: analyse.map(id => ({_type: 'reference', _ref: id})),
            status, 
            validity,
            date, 
            user: username
        };

        const result = await writeClient
        .patch(bonId)
        .set(bon)
        .commit();

        return result;

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

export const deleteBon = async (bonId) => {
  const session = await auth();

  if (!session) redirect('/');

  if (!bonId) {
    return { error: "No bon ID provided!" };
  }

  try {
    const result = await writeClient
      .delete(bonId);

    return { success: true, result };
  } catch (error) {
    console.error("Failed to delete bon:", error);
    return { success: false, error: error.message };
  }
};


export const createType = async (Type) => {
    const session = await auth();
    if (!session) redirect('/');

    if (!Type) {
        return { error: "No type received!" };
    }
    
    try {

        const result = await writeClient.create({
            _type: 'typeBon',
            ...Type
        });

        return result;

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

export const createClient = async (Client) => {
    const session = await auth();
    if (!session) redirect('/');

    if (!Client) {
        return { error: "No client received!" };
    }
    
    try {

        const result = await writeClient.create({
            _type: 'client',
            ...Client
        });

        return result;

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

export const createAnalyse = async (Analyse) => {
    const session = await auth();
    if (!session) redirect('/');

    if (!Analyse) {
        return { error: "No type received!" };
    }
    
    try {

        const result = await writeClient.create({
            _type: 'analyse',
            ...Analyse
        });

        return result;

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

export const createUser = async (User) => {
  const session = await auth();
    if (!session) redirect('/');

    if (!User) {
        return { error: "No user received!" };
    }
    
    try {

        const result = await writeClient.create({
            _type: 'user',
            ...User
        });

        return result;

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

export const deleteUser = async (userId) => {
  const session = await auth();
    if (!session) redirect('/');

    if (!userId) {
        return { error: "No userId received!" };
    }
    
    try {

        return await writeClient.delete(userId)

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}

export const makeUserAdmin = async (email) => {
    const session = await auth();
      if (!session) redirect('/');
  
      if (!email) {
          return { error: "No user received!" };
      }

      const user = await client.fetch(GET_USER_BY_EMAIL, {email});

      if (!user) {
        return { error: "User not found!" };
      }
      
      try {

        const result = await writeClient
        .patch(user._id)
        .set({role: "admin"})
        .commit();
          
        return result;
  
      } catch (error) {
          console.log(error);
          return { success: false, error: error.message };
      }
}

export const revokeAdmin = async (email) => {
  const session = await auth();
    if (!session) redirect('/');

    if (!email) {
        return { error: "No user received!" };
    }

    const user = await client.fetch(GET_USER_BY_EMAIL, {email});

      if (!user) {
        return { error: "User not found!" };
      }
    
    try {

      const result = await writeClient
        .patch(user._id)
        .set({role: "user"})
        .commit();

      return result;

    } catch (error) {
        console.log(error);
        return { success: false, error: error.message };
    }
}