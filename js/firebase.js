
import { db, seedInitialData } from './db.js';

export const initializeFirebaseClient = async () => {
  seedInitialData();
  return true;
};

export const isFirebaseEnabled = () => true;

export const fsGetCollection = db.getCollection;
export const fsGetDocument = db.getDocument;
export const fsSetDocument = db.setDocument;
export const fsDeleteDocument = db.deleteDocument;
export const fsQueryCollection = db.queryCollection;

export const fsGetGlobalConfig = async () => {
  return await db.getDocument('config', 'main');
};
