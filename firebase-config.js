const firebaseConfig = {
  apiKey: "AIzaSyB-tBurz5gMYTB2VfU_KvAgO_54lOke9hQ",
  authDomain: "project-d8beb.firebaseapp.com",
  projectId: "project-d8beb",
  storageBucket: "project-d8beb.firebasestorage.app",
  messagingSenderId: "367976119507",
  appId: "1:367976119507:web:ef78fe848b4ad45cb6a826",
  measurementId: "G-ZDNSN02HW8",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
