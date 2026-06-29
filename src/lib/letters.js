// src/lib/letters.js
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, getDoc, orderBy, query, serverTimestamp,
} from 'firebase/firestore';

import { db } from './firebase';

const COL = 'letters';

// ── Fetch all letters ordered by date desc ──────────────────────────────────
export async function getLetters() {
  const q   = query(collection(db, COL), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Fetch single letter ──────────────────────────────────────────────────────
export async function getLetter(id) {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) throw new Error('Letter not found');
  return { id: snap.id, ...snap.data() };
}

// ── Create letter ────────────────────────────────────────────────────────────
export async function createLetter(data) {
  return addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

// ── Update letter ────────────────────────────────────────────────────────────
export async function updateLetter(id, data) {
  return updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

// ── Delete letter ────────────────────────────────────────────────────────────
export async function deleteLetter(id) {
  await deleteDoc(doc(db, COL, id));
}

// ── Upload file with progress callback ──────────────────────────────────────
export async function uploadFile(file, folder, onProgress) {

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", preset);
  formData.append("folder", folder);

  return new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`
    );

    xhr.upload.onprogress = (e) => {

      if (e.lengthComputable && onProgress) {

        onProgress(
          Math.round((e.loaded / e.total) * 100)
        );

      }

    };

    xhr.onload = () => {

      if (xhr.status === 200) {

        const data = JSON.parse(xhr.responseText);

        resolve(data.secure_url);

      } else {

        reject(new Error(xhr.responseText));

      }

    };

    xhr.onerror = () => reject(new Error("Upload failed"));

    xhr.send(formData);

  });

}
