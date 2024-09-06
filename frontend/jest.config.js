export default {
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // Trasforma i file .js e .jsx usando babel-jest
    },
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'], // Aggiunge matchers personalizzati
    testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'], // Pattern per i file di test
  };