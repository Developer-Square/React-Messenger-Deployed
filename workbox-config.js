module.exports = {
  "globDirectory": "./",
  "globPatterns": [
    "**/*.{json,jsx,css,html,js,scss}"
  ],
  "swSrc": "src/sw.js",
  "swDest": "dist/sw.js",
  clientsClaim: true,
  skipWaiting: true
};