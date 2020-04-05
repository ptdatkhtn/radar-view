#!/usr/bin/env node
const replace = require('replace')
const assetManifest = require('../build/asset-manifest.json')

replace({
    regex: /MAIN_JS_HASHED/g,
    replacement: `'` + assetManifest.files['main.js'] + `'`,
    paths: ['build/loader.js'],
    recursive: false,
    silent: false
})

replace({
    regex: /MAIN_CSS_HASHED/g,
    replacement: `'` + assetManifest.files['main.css'] + `'`,
    paths: ['build/loader.js'],
    recursive: false,
    silent: false
})

replace({
    regex: /\n/g,
    replacement: '',
    paths: ['build/loader.js'],
    recursive: false,
    silent: false
})
