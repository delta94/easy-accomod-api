import admin from 'firebase-admin'

var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://easy-accomod-57b04.firebaseio.com"
});

export const firestore = admin.firestore();