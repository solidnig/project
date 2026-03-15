// ════════════════════════════════════════════════
//  storage.js — Upload ảnh lên Firebase Storage
// ════════════════════════════════════════════════
import { storage, db } from "./firebase-config.js";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const PHOTOS_COLLECTION = "photos";
const MAX_SIZE_MB = 5;

/**
 * Upload file ảnh lên Firebase Storage + lưu metadata vào Firestore.
 *
 * @param {File}     file
 * @param {string}   uid          — user ID
 * @param {string}   photoType    — "avatar" | "project" | "cover" | "other"
 * @param {Function} onProgress   — callback(percent: number)
 * @returns {Promise<{url: string, docId: string}>}
 */
export async function uploadPhoto(
  file,
  uid,
  photoType = "other",
  onProgress = () => {},
) {
  // Validate kích thước
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File quá lớn. Tối đa ${MAX_SIZE_MB}MB.`);
  }

  // Validate loại file
  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ hỗ trợ file ảnh (JPG, PNG, GIF, WebP...).");
  }

  const ext = file.name.split(".").pop();
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
  const storagePath = `users/${uid}/${photoType}/${filename}`;
  const storageRef = ref(storage, storagePath);

  // Upload với theo dõi tiến trình
  const url = await new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        onProgress(pct);
      },
      reject,
      async () => {
        const downloadURL = await getDownloadURL(task.snapshot.ref);
        resolve(downloadURL);
      },
    );
  });

  // Lưu metadata vào Firestore (collection "photos")
  const docRef = await addDoc(collection(db, PHOTOS_COLLECTION), {
    uid,
    url,
    storagePath,
    photoType,
    name: file.name,
    size: file.size,
    createdAt: serverTimestamp(),
  });

  return { url, docId: docRef.id };
}

/**
 * Lấy danh sách ảnh của user từ Firestore.
 * @param {string} uid
 * @returns {Promise<Array>}
 */
export async function getUserPhotos(uid) {
  const q = query(
    collection(db, PHOTOS_COLLECTION),
    where("uid", "==", uid),
    orderBy("createdAt", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Xóa ảnh khỏi Storage và Firestore.
 * @param {string} docId       — Firestore document ID
 * @param {string} storagePath — đường dẫn trên Storage
 */
export async function deletePhoto(docId, storagePath) {
  // Xóa file trên Storage
  try {
    await deleteObject(ref(storage, storagePath));
  } catch (e) {
    console.warn("Storage delete failed (có thể đã bị xóa):", e.message);
  }
  // Xóa metadata trên Firestore
  await deleteDoc(doc(db, PHOTOS_COLLECTION, docId));
}
