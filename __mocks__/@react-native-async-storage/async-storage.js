const mockStorage: Record<string, string> = {};
const MockAsyncStorage = {
  setItem: jest.fn(async (key: string, value: string) => {
    mockStorage[key] = value;
  }),
  getItem: jest.fn(async (key: string) => {
    return mockStorage[key] ?? null;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete mockStorage[key];
  }),
  getAllKeys: jest.fn(async () => {
    return Object.keys(mockStorage);
  }),
  multiRemove: jest.fn(async (keys: string[]) => {
    for (const key of keys) {
      delete mockStorage[key];
    }
  }),
  clear: jest.fn(async () => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  }),
};

export default MockAsyncStorage;
