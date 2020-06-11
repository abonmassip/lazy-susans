import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyAoVf6bpDARe0TtJpSR22htr8u0lV9ay-o',
  authDomain: 'lazy-susans-db.firebaseapp.com',
  databaseURL: 'https://lazy-susans-db.firebaseio.com',
  projectId: 'lazy-susans-db',
  storageBucket: 'lazy-susans-db.appspot.com',
  messagingSenderId: '753030023424',
  appId: '1:753030023424:web:646359abc2fa0f7a9c0be5',
  measurementId: 'G-DKBLCY0LRN',
};

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  }

  return userRef;
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export default firebase;
