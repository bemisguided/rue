module.exports = {
  "extends": [
    "plugin:flowtype/recommended"
  ],
  "plugins": [
    "flowtype"
  ],
  "rules": {
    // Spacing rules
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "eol-last": ["error", "always"],
    
    // Quotes
    "quotes": ["error", "single"],

    // Flow configurations
    "flowtype/semi": ["error", "always"],
    "flowtype/delimiter-dangle": ["error", "always"],

    // override default options for rules from base configurations
    "no-cond-assign": ["error", "always"],

    // disable rules from base configurations
    "no-console": "error",

    // ES6
    "no-var": "error",
  }
};
