import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

let firebaseEnabled = false;
let dbInstance: any = null;

// Dynamically check and initialize Firebase client
export async function initializeFirebaseClient(): Promise<boolean> {
  try {
    const response = await fetch('firebase-config.json');
    if (!response.ok) {
      console.log("Firebase config file not loaded yet. Working in Fallback/Local storage API mode.");
      return false;
    }
    const config: FirebaseConfig = await response.json();
    
    // Check if any fields remain as placeholders
    if (
      !config.apiKey || 
      config.apiKey.includes('SUA_API_KEY') || 
      config.projectId.includes('SEU_PROJECT_ID')
    ) {
      console.log("Firebase client-side active mode: placeholders detected. Using local simulation.");
      return false;
    }

    const app = getApps().length === 0 ? initializeApp(config) : getApp();
    dbInstance = getFirestore(app);
    firebaseEnabled = true;
    console.log("🔥 Direct client-side Firebase (Firestore) Database initialized successfully!");
    return true;
  } catch (error) {
    console.warn("Client Firebase fallback trigger: ", error);
    return false;
  }
}

export function isFirebaseEnabled(): boolean {
  return firebaseEnabled;
}

// ----------------------------------------------------
// FIRESTORE GENERIC API WRAPPERS FOR STATIC GH-PAGES
// ----------------------------------------------------

export async function fsGetCollection(colName: string): Promise<any[]> {
  if (!firebaseEnabled || !dbInstance) return [];
  try {
    const colRef = collection(dbInstance, colName);
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error(`Error fetching collection ${colName}:`, e);
    return [];
  }
}

export async function fsGetDocument(colName: string, docId: string): Promise<any | null> {
  if (!firebaseEnabled || !dbInstance) return null;
  try {
    const docRef = doc(dbInstance, colName, docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return null;
  } catch (e) {
    console.error(`Error fetching document ${colName}/${docId}:`, e);
    return null;
  }
}

export async function fsSetDocument(colName: string, docId: string, data: any): Promise<boolean> {
  if (!firebaseEnabled || !dbInstance) return false;
  try {
    const docRef = doc(dbInstance, colName, docId);
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (e) {
    console.error(`Error setting document ${colName}/${docId}:`, e);
    return false;
  }
}

export async function fsDeleteDocument(colName: string, docId: string): Promise<boolean> {
  if (!firebaseEnabled || !dbInstance) return false;
  try {
    const docRef = doc(dbInstance, colName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (e) {
    console.error(`Error deleting document ${colName}/${docId}:`, e);
    return false;
  }
}

export async function fsQueryCollection(colName: string, field: string, operator: any, value: any): Promise<any[]> {
  if (!firebaseEnabled || !dbInstance) return [];
  try {
    const colRef = collection(dbInstance, colName);
    const q = query(colRef, where(field, operator, value));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.error(`Error querying collection ${colName}:`, e);
    return [];
  }
}

export async function fsGetGlobalConfig(): Promise<any | null> {
  // Try to get from 'config' collection, document 'main' to match blueprint
  return fsGetDocument('config', 'main');
}
