module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: {

      }
    }
  },
  "roots": [
    "<rootDir>/tests/unit",
    "<rootDir>/tests/e2e",
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
}