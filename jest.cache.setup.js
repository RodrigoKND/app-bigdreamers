jest.mock('@react-native-async-storage/async-storage', () => {
  const mockStorage = {};
  return {
    __esModule: true,
    default: {
      setItem: jest.fn(async (key, value) => { mockStorage[key] = value; }),
      getItem: jest.fn(async (key) => mockStorage[key] ?? null),
      removeItem: jest.fn(async (key) => { delete mockStorage[key]; }),
      getAllKeys: jest.fn(async () => Object.keys(mockStorage)),
      multiRemove: jest.fn(async (keys) => { for (const k of keys) delete mockStorage[k]; }),
      clear: jest.fn(async () => { Object.keys(mockStorage).forEach(function(k) { delete mockStorage[k]; }); }),
    },
  };
});
