import * as firebase from "firebase";

export const firebaseConfig = {
  apiKey: "AIzaSyAHpIYiiYbSe5vpXBJxC3-RIYnRxk6Oyy8",
  authDomain: "litter-tracker.firebaseapp.com",
  projectId: "litter-tracker",
  storageBucket: "litter-tracker.appspot.com",
  messagingSenderId: "399869966067",
  appId: "1:399869966067:web:6bc44af577f6151b756986",
  databaseURL: "",
};

export const SignInWithEmailPassword = async (
  email: string,
  password: string
) => {
  return await firebase.default.auth().signInWithEmailAndPassword(email, password);
};

export const SignInAnon = async () => {
  return await firebase.default.auth().signInAnonymously();
};

export const CreateEmailAccount = async (email: string, password: string) => {
  return await firebase.default.auth().createUserWithEmailAndPassword(email, password);
};
export const SignOut = () => {
  firebase.default.auth().signOut();
};
