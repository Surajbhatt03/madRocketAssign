

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, CACHE_SIZE_UNLIMITED  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQWwZKD-q34OjS6a5T9oMhoE35ZXmJv4I",
  authDomain: "madrocketfrontendassign.firebaseapp.com",
  projectId: "madrocketfrontendassign",
  storageBucket: "madrocketfrontendassign.appspot.com",
  messagingSenderId: "186083073773",
  appId: "1:186083073773:web:3415e09628f8eb19f3f6e4"
};

const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  localCache: persistentLocalCache({
    cacheSizeBytes: CACHE_SIZE_UNLIMITED
  })
});
const auth = getAuth(app);
export { db, auth };

