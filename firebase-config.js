// ════════════════════════════════════════════════════════════════
//  🔥 FIREBASE CONFIGURATION
//  Thay thế các giá trị bên dưới bằng config từ Firebase Console
//
//  Hướng dẫn:
//  1. Vào https://console.firebase.google.com
//  2. Tạo project mới (hoặc chọn project hiện có)
//  3. Project Settings → Your apps → Add app (Web)
//  4. Copy config object vào đây
//  5. Bật Authentication → Sign-in method → Google
//  6. Tạo Firestore Database (chế độ test để bắt đầu)
//  7. Tạo Storage bucket
// ════════════════════════════════════════════════════════════════

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3BCNxZMEQxLcgn9RQkYQU4BvbDF64c_4",
  authDomain: "meetme-918cd.firebaseapp.com",
  projectId: "meetme-918cd",
  storageBucket: "meetme-918cd.firebasestorage.app",
  messagingSenderId: "83399029367",
  appId: "1:83399029367:web:e91b867e01ea213e004c72",
  measurementId: "G-1PRVJCE9GW",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider };
