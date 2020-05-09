import {
  firebase,
  auth,
  firestore,
  subscribedListeners
} from '.';
import 'firebase/auth';
import 'firebase/firestore';

const getUserDocument = (uid, callback) => {
  let data;
  const listener = firestore.doc(`users/${uid}`).onSnapshot((doc) => {
    data = doc.data();
    callback(data);
  });

  subscribedListeners.push(listener);
};

const signInWithGoogle = async () => {
  let user;
  await auth
    .signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then((result) => {
      user = getOrCreateUserDocument(result.user);
      return user;
    })
    .catch((error) => {
      console.log('firebase: signInWithGoogle - User sign-in failed: ', error);
    });
};

const getOrCreateUserDocument = async (user, additionalData = {}) => {
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const {
      email,
      displayName,
      photoURL,
      uid
    } = user;
    await userRef.set({
      displayName,
      email,
      photoURL,
      uid,
      ...additionalData,
      isAdmin: false,
    });
  }
  let userDocument;
  return getUserDocument(user.uid, (data) => {
    userDocument = {
      data,
    };
  });
};

export {
  signInWithGoogle
};