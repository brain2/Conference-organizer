import firebase from 'firebase';

export const appName = "club-6de03";

export const firebaseConfig = {
  apiKey: "AIzaSyA2P1AIfQI_tDr9hF5o5zBzXHny9D4Ibj8",
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `${appName}.appspot.com`,
  messagingSenderId: "1038501072317"
};

firebase.initializeApp(firebaseConfig);