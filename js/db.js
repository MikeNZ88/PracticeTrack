// js/db.js - IndexedDB Helper Functions

const DB_NAME = 'practiceTrackDB';
const DB_VERSION = 1;
const STORE_NAME = 'mediaFiles';

let db = null; // Hold the database connection

/**
 * Opens and initializes the IndexedDB database.
 * Returns a promise that resolves with the DB connection.
 */
function openDB() {
    return new Promise((resolve, reject) => {
        if (db) {
            // If connection already exists, resolve with it
            resolve(db);
            return;
        }

        // Check if IndexedDB is supported
        if (!window.indexedDB) {
            console.error("Your browser doesn't support IndexedDB. Media storage will not work.");
            reject("IndexedDB not supported");
            return;
        }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error('IndexedDB error:', event.target.error);
            reject('Error opening IndexedDB');
        };

        request.onsuccess = (event) => {
            db = event.target.result;
            console.log('IndexedDB opened successfully');
            resolve(db);
        };

        // This event only runs if the version number changes
        // or if the database is created for the first time.
        request.onupgradeneeded = (event) => {
            const tempDb = event.target.result;
            console.log('Upgrading IndexedDB...');

            // Create the object store if it doesn't exist
            if (!tempDb.objectStoreNames.contains(STORE_NAME)) {
                tempDb.createObjectStore(STORE_NAME); // Using media ID as the key directly
                console.log(`Object store "${STORE_NAME}" created.`);
            }
            // If you need to add indexes later, do it here:
            // store.createIndex('name', 'name', { unique: false });
        };
    });
}

/**
 * Saves a file (Blob/File object) to the IndexedDB store.
 * @param {string} key - The media ID to use as the key.
 * @param {File|Blob} file - The File or Blob object to save.
 * @returns {Promise<void>}
 */
function saveMediaFile(key, file) {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDb = await openDB(); // Ensure DB is open
            const transaction = currentDb.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            
            // Log file details before saving
            console.log(`Attempting to save file to IndexedDB. Key: ${key}, Name: ${file.name}, Size: ${file.size}, Type: ${file.type}`);
            
            const request = store.put(file, key); // Use key as the explicit key

            request.onsuccess = () => {
                console.log(`File saved successfully to IndexedDB with key: ${key}`);
                resolve();
            };

            request.onerror = (event) => {
                const error = event.target.error;
                console.error('IndexedDB save request error:', error);
                // Log specific properties if they exist
                console.error(`Error Name: ${error?.name}, Message: ${error?.message}`); 
                // Try to get more details from the event or error object
                console.error('Complete error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                reject(error); // Reject with the specific error
            };
            
            transaction.onerror = (event) => { // Add transaction error handler
                 const error = event.target.error;
                 console.error('IndexedDB save transaction error:', error);
                 console.error(`Transaction Error Name: ${error?.name}, Message: ${error?.message}`);
                 console.error('Complete transaction error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                 // Don't reject here again if request.onerror already did
            };
            
             transaction.onabort = (event) => { // Add transaction abort handler
                 console.error('IndexedDB save transaction aborted:', event.target.error); // Error might be null
                 console.error('Abort Event:', event);
                 // Maybe reject here if not already rejected?
             };

        } catch (error) {
            console.error('Failed to open DB or initiate transaction for saving:', error);
            reject(error);
        }
    });
}

/**
 * Retrieves a file (Blob/File object) from the IndexedDB store.
 * @param {string} key - The media ID (key) of the file to retrieve.
 * @returns {Promise<File|Blob|null>}\
 */
function getMediaFile(key) {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDb = await openDB(); // Ensure DB is open
            const transaction = currentDb.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.get(key);

            request.onsuccess = (event) => {
                if (event.target.result) {
                    // console.log(`File retrieved from IndexedDB for key: ${key}`);
                    resolve(event.target.result);
                } else {
                    console.warn(`No file found in IndexedDB for key: ${key}`);
                    resolve(null); // Resolve with null if not found
                }
            };

            request.onerror = (event) => {
                console.error('Error retrieving file from IndexedDB:', event.target.error);
                reject(event.target.error);
            };

        } catch (error) {
            console.error('Failed to open DB for retrieving:', error);
            reject(error);
        }
    });
}

/**
 * Deletes a file from the IndexedDB store.
 * @param {string} key - The media ID (key) of the file to delete.
 * @returns {Promise<void>}
 */
function deleteMediaFile(key) {
    return new Promise(async (resolve, reject) => {
        try {
            const currentDb = await openDB(); // Ensure DB is open
            const transaction = currentDb.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.delete(key);

            request.onsuccess = () => {
                console.log(`File deleted from IndexedDB with key: ${key}`);
                resolve();
            };

            request.onerror = (event) => {
                console.error('Error deleting file from IndexedDB:', event.target.error);
                reject(event.target.error);
            };

        } catch (error) {
            console.error('Failed to open DB for deleting:', error);
            reject(error);
        }
    });
}

// Expose functions globally or use module pattern if preferred
window.practiceTrackDB = {
    openDB,
    saveMediaFile,
    getMediaFile,
    deleteMediaFile
};

// Try to open the DB connection when the script loads
openDB().catch(err => console.error("Initial DB open failed:", err));
