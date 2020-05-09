import 'firebase/auth';
import 'firebase/firestore';
import firebase from './setup';
import {
  signInWithGoogle
} from './signIn';

const auth = firebase.auth();
const firestore = firebase.firestore();

// subscribedListeners = Array of .onSnapshot listeners registered by firestore in collection.js and document.js.
// Can be imported and used to unsubscribe upon onmounting component / sigining out of firebase
let subscribedListeners = [];

export {
  subscribedListeners,
  firebase,
  auth,
  firestore,
  signInWithGoogle
};

export * from './collection';
export * from './document';