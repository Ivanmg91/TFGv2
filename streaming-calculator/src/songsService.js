import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const SONGS_COLLECTION = "songs";

/**
 * Fetch all songs from Firestore, ordered by uploadedAt descending.
 * @returns {Promise<Array>} Array of song objects.
 */
export async function getAllSongs() {
  const q = query(
    collection(db, SONGS_COLLECTION),
    orderBy("uploadedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
}

/**
 * Fetch a single song by its Firestore document ID.
 * @param {string} songId
 * @returns {Promise<Object|null>} Song object or null if not found.
 */
export async function getSongById(songId) {
  const docRef = doc(db, SONGS_COLLECTION, songId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { ...docSnap.data(), id: docSnap.id };
  }
  return null;
}

/**
 * Fetch all songs uploaded by a specific artist.
 * @param {string} artistId
 * @returns {Promise<Array>} Array of song objects.
 */
export async function getSongsByArtist(artistId) {
  const q = query(
    collection(db, SONGS_COLLECTION),
    where("artistId", "==", artistId),
    orderBy("uploadedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({ ...docSnap.data(), id: docSnap.id }));
}

/**
 * Add a new song document to Firestore.
 * @param {Object} songData - Fields: title, artistId, artistName, artistEmail,
 *   audioUrl, imageUrl, lyrics, presetUrl.
 * @returns {Promise<string>} The new document ID.
 */
export async function addSong(songData) {
  const docRef = await addDoc(collection(db, SONGS_COLLECTION), {
    title: songData.title || "",
    artistId: songData.artistId || "",
    artistName: songData.artistName || "",
    artistEmail: songData.artistEmail || "",
    audioUrl: songData.audioUrl || "",
    imageUrl: songData.imageUrl || "",
    lyrics: songData.lyrics || "",
    presetUrl: songData.presetUrl || "",
    likes: 0,
    likedBy: [],
    uploadedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update editable fields of an existing song.
 * @param {string} songId
 * @param {Object} updates - Any subset of: title, lyrics, presetUrl, imageUrl, audioUrl.
 */
export async function updateSong(songId, updates) {
  const docRef = doc(db, SONGS_COLLECTION, songId);
  await updateDoc(docRef, updates);
}

/**
 * Delete a song document from Firestore.
 * @param {string} songId
 */
export async function deleteSong(songId) {
  const docRef = doc(db, SONGS_COLLECTION, songId);
  await deleteDoc(docRef);
}

/**
 * Toggle a like on a song for the current user.
 * Adds or removes the userId from the likedBy array and increments/decrements likes.
 * @param {string} songId
 * @param {string} userId
 * @param {boolean} isLiked - true if the user currently likes the song (will unlike), false to like.
 */
export async function toggleLikeSong(songId, userId, isLiked) {
  const docRef = doc(db, SONGS_COLLECTION, songId);
  if (isLiked) {
    await updateDoc(docRef, {
      likedBy: arrayRemove(userId),
      likes: increment(-1),
    });
  } else {
    await updateDoc(docRef, {
      likedBy: arrayUnion(userId),
      likes: increment(1),
    });
  }
}

/**
 * Check whether a user has liked a song.
 * @param {Array} likedBy - The likedBy array from the song document.
 * @param {string} userId
 * @returns {boolean}
 */
export function isLikedByUser(likedBy, userId) {
  if (!likedBy || !userId) return false;
  return likedBy.includes(userId);
}
