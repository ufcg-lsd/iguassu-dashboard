/**
 * Manage the how Access Tokens are being stored and retrieved from storage.
 *
 * Current implementation stores to localStorage. Local Storage should always be
 * accessed through this instance.
 **/
const StorageService = {
  get(key) {
    return localStorage.getItem(key);
  },

  put(key, payload) {
    localStorage.setItem(key, payload);
  },

  remove(key) {
    localStorage.removeItem(key);
  }
};

export default StorageService;
