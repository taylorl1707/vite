const fs = require('fs')
const path = require('path')
const legacy = require('@vitejs/plugin-legacy').default

module.exports = {
  base: './',
  plugins: [
    legacy({
      targets: 'IE 11'
    })
  ],

  build: {
    cssCodeSplit: false,
    manifest: true,
    rollupOptions: {
      output: {
        chunkFileNames(chunkInfo) {
          if (chunkInfo.name === 'immutable-chunk') {
            return `assets/${chunkInfo.name}.js`
          }

          return `assets/chunk-[name].[hash].js`
        }
      }
    }
  },

  // special test only hook
  // for tests, remove `<script type="module">` tags and remove `nomodule`
  // attrs so that we run the legacy bundle instead.
  __test__() {
    const indexPath = path.resolve(__dirname, './dist/index.html')
    let index = fs.readFileSync(indexPath, 'utf-8')
    index = index
      .replace(/<script type="module".*?<\/script>/g, '')
      .replace(/<script nomodule/g, '<script')
    fs.writeFileSync(indexPath, index)
  }
}
