module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    // proxy: 'http://127.0.0.1:3000'
    proxy: 'http://flanb.msharebox.com:3001/'
  }
}
