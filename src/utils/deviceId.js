/**
 * Generate a unique device identifier
 * This ensures each device/browser has a unique ID
 */
export const generateDeviceId = () => {
  return 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Get or create device ID from localStorage
 * @returns {string} Unique device ID
 */
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

/**
 * Clear device ID (used during logout)
 */
export const clearDeviceId = () => {
  localStorage.removeItem('deviceId');
};
