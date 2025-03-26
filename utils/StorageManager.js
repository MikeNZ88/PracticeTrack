// utils/StorageManager.js
// This file handles all data persistence across the app

class StorageManager {
  constructor() {
    this.dbName = 'PracticeTrackDB';
    this.dbVersion = 1;
    this.localStorageKey = 'practicetrack_backup';
    this.db = null;
    this.isIndexedDBSupported = 'indexedDB' in window;
  }

  // Initialize database
  async init() {
    if (!this.isIndexedDBSupported) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return this._loadFromLocalStorage();
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoryStore.createIndex('name', 'name', { unique: true });
        }
        
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          sessionStore.createIndex('date', 'date', { unique: false });
          sessionStore.createIndex('categoryId', 'categoryId', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('media')) {
          db.createObjectStore('media', { keyPath: 'id' });
        }
        
        // Create settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('Database initialized successfully');
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error opening database:', event.target.error);
        reject(`IndexedDB error: ${event.target.error}`);
        
        // Try to load from localStorage as fallback
        this._loadFromLocalStorage();
      };
    });
  }

  // Backup data to localStorage
  async _backupToLocalStorage(data) {
    try {
      // Don't include media blobs in the backup to avoid localStorage size limits
      const backupData = {
        categories: data.categories || [],
        sessions: data.sessions ? data.sessions.map(session => {
          const sessionCopy = {...session};
          if (sessionCopy.media && sessionCopy.media.blob) {
            // Keep media type and id, but remove blob
            sessionCopy.media = {
              id: sessionCopy.media.id,
              type: sessionCopy.media.type
            };
          }
          return sessionCopy;
        }) : [],
        settings: data.settings || {}
      };
      
      localStorage.setItem(this.localStorageKey, JSON.stringify(backupData));
      console.log('Data backed up to localStorage');
    } catch (error) {
      console.error('Error backing up to localStorage:', error);
    }
  }

  // Load data from localStorage
  _loadFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : { categories: [], sessions: [], settings: {} };
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return { categories: [], sessions: [], settings: {} };
    }
  }

  // Get all categories
  async getCategories() {
    if (!this.isIndexedDBSupported || !this.db) {
      const data = this._loadFromLocalStorage();
      return data.categories || [];
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['categories'], 'readonly');
      const store = transaction.objectStore('categories');
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error fetching categories:', event.target.error);
        reject(`Error fetching categories: ${event.target.error}`);
      };
    });
  }

  // Additional methods from practice-track-persistent.js would go here
  // For brevity, I've included just the core methods
  
  // Get all sessions
  async getSessions() {
    if (!this.isIndexedDBSupported || !this.db) {
      const data = this._loadFromLocalStorage();
      return data.sessions || [];
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['sessions'], 'readonly');
      const store = transaction.objectStore('sessions');
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error('Error fetching sessions:', event.target.error);
        reject(`Error fetching sessions: ${event.target.error}`);
      };
    });
  }

  // Get sessions with media
  async getSessionsWithMedia() {
    try {
      const sessions = await this.getSessions();
      
      if (!this.isIndexedDBSupported || !this.db) {
        return sessions; // No media blobs in localStorage
      }
      
      // Sort sessions by date (newest first)
      return sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
      console.error('Error loading sessions with media:', error);
      throw error;
    }
  }
}

// Export a singleton instance
const storageManager = new StorageManager();
export default storageManager;
