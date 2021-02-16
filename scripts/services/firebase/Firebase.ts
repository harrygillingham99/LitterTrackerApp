/* 
  Firebase.ts
  Houses the firebaseConfig for the application and all of the methods used to handle user account actions.
*/

import firebase from "firebase";

export const firebaseConfig = {

};

export const signInWithEmailPassword = async (
  email: string,
  password: string
) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password);
};

export const signInAnon = async () => {
  return await firebase.auth().signInAnonymously();
};

export const createEmailAccount = async (email: string, password: string) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password);
};
export const signOut = async () => {
  await firebase.auth().signOut();
};
