// ════════════════════════════════════════════════
//  auth.js — Xử lý đăng nhập / đăng xuất Google
// ════════════════════════════════════════════════
import { auth, provider } from "./firebase-config.js";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/**
 * Đăng nhập bằng Google Popup.
 * @returns {Promise<import("firebase/auth").UserCredential>}
 */
export async function loginWithGoogle() {
  const credential = await signInWithPopup(auth, provider);
  return credential.user;
}

/**
 * Đăng xuất người dùng hiện tại.
 */
export async function logout() {
  await signOut(auth);
}

/**
 * Lắng nghe trạng thái đăng nhập.
 * @param {(user: import("firebase/auth").User | null) => void} callback
 */
export function onAuthChange(callback) {
  onAuthStateChanged(auth, callback);
}

/**
 * Trả về user hiện tại (hoặc null).
 */
export function getCurrentUser() {
  return auth.currentUser;
}
