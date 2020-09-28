import firebase from 'firebase/app';

// TODO: We might want to import functions/hosting/analytics etc and initialize it..

const firebaseConfig = {
  apiKey: 'AIzaSyDJ2trHBRikQAdynEjwocPUjoSHd7CpN1E',
  authDomain: 'gamedoodle-5c190.firebaseapp.com',
  databaseURL: 'https://gamedoodle-5c190.firebaseio.com',
  projectId: 'gamedoodle-5c190',
  storageBucket: 'gamedoodle-5c190.appspot.com',
  messagingSenderId: '232939664689',
  appId: '1:232939664689:web:6d3160081614590baaec10',
  measurementId: 'G-8GXDXX45VK',
};

firebase.initializeApp(firebaseConfig);

export default firebase;