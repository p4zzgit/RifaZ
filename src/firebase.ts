
import { db, seedInitialData } from './lib/localStorageDB';

// Force 100% Client-Side LocalStorage mode
let firebaseEnabled = true;

export async function initializeFirebaseClient(): Promise<boolean> {
  seedInitialData();
  return true;
}

export function isFirebaseEnabled(): boolean {
  return true;
}

export async function fsGetDocument(collection: string, id: string): Promise<any> {
  return db.getDocument(collection, id);
}

export async function fsSetDocument(collection: string, id: string, data: any): Promise<boolean> {
  await db.setDocument(collection, id, data);
  return true;
}

export async function fsDeleteDocument(collection: string, id: string): Promise<boolean> {
  await db.deleteDocument(collection, id);
  return true;
}

export async function fsGetCollection(collection: string): Promise<any[]> {
  return db.getCollection(collection);
}

export async function fsQueryCollection(collection: string, field: string, operator: any, value: any): Promise<any[]> {
  return db.queryCollection(collection, field, operator, value);
}

export async function fsGetGlobalConfig(): Promise<any> {
  return db.getDocument('config', 'main');
}
