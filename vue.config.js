module.exports = {
  lintOnSave: false,
  chainWebpack: config=>{
    // 发布模式
    config.when(process.env.NODE_ENV === 'production',config =>{
      config.entry('app').clear().add('./src/main-prod.js')

      config.plugin('html').tap(args=>{
        args[0].isProd = true
        return args
      })

      config.set('externals',{
        vue:"Vue",
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash:'_',
        echarts : 'echarts',
        // nprogress:'Nprogress',
        'vue-quill-editor':  'VueQuillEditor'
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config=>{
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args=>{
        args[0].isProd = false
        return args
      })
    })
  }
}