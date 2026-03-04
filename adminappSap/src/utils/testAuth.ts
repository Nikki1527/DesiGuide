// Test authentication utility
export const createTestAuthToken = (userId: number) => {
  // Simple base64 encoding for testing
  const payload = `${userId}:test`;
  return Buffer.from(payload).toString('base64');
};

export const setTestAuthToken = (userId: number = 1) => {
  const token = createTestAuthToken(userId);
  localStorage.setItem('adminToken', token);
  return token;
};

export const clearTestAuthToken = () => {
  localStorage.removeItem('adminToken');
};

// For testing purposes, you can call this function in the browser console:
// setTestAuthToken(1) to simulate being logged in as user ID 1
