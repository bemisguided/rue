module.exports = {
  "extends": [
    "fbjs/strict"
  ],
  "rules": {
    // Code rules
    "no-cond-assign": ["error", "always"],
    "no-var": "error",
    "one-var": ["error", "never"],

    // Stylistic rules
    "comma-dangle": ["error", "always-multiline"],
    "eol-last": ["error", "always"],
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "max-len": ["off"],
    "quotes": ["error", "single"],
    "space-before-function-paren": ["error", "never"],

    // // Flow configurations
    "flowtype/semi": ["error", "always"],
    "flowtype/delimiter-dangle": ["error", "always"],

  }
};
