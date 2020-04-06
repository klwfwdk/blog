module.exports = {
  "title": "KLWF 技术博客",
  "description": "",
  "head": [
    [
      "link",
      {
        "rel": "icon",
        "href": "/favicon.ico"
      }
    ],
    [
      "meta",
      {
        "name": "viewport",
        "content": "width=device-width,initial-scale=1,user-scalable=no"
      }
    ],
    [
      "meta",
      {
         "name":"baidu-site-verification",
         "content":"u0k2IyUyN9"
      }
    ],
    ['script',{crossorigin:"anonymous",integrity:"sha384-8t+aLluUVnn5SPPG/NbeZCH6TWIvaXIm/gDbutRvtEeElzxxWaZN+G/ZIEdI/f+y",src:"//lib.baomitu.com/vue/2.6.10/vue.min.js"}],
    ['script',{crossorigin:"anonymous",integrity:"sha384-CFKP4mu2aEZDylNmi3T4nvSVvMIjfqDkz2rfskdOAkPkAIocK+cqVh+rLVAnonK5",src:"//lib.baomitu.com/vue-router/3.1.3/vue-router.min.js"}]
  ],
  "theme": "reco",
  "themeConfig": {
    "noFoundPageByTencent": false,
    "themePicker": false,
    "nav": [
      {
        "text": "Home",
        "link": "/",
        "icon": "reco-home"
      },
      {
        "text": "TimeLine",
        "link": "/timeLine/",
        "icon": "reco-date"
      },
      {
        "text": "Contact",
        "icon": "reco-message",
        "items": [
          {
            "text": "GitHub",
            "link": "https://github.com/klwfwdk",
            "icon": "reco-github"
          }
        ]
      }
    ],
    "type": "blog",
    "blogConfig": {
      "category": {
        "location": 2,
        "text": "Category"
      },
      "tag": {
        "location": 3,
        "text": "Tag"
      }
    },
    "logo": "/head.png",
    "search": true,
    "searchMaxSuggestions": 10,
    "sidebar": "auto",
    "lastUpdated": "Last Updated",
    "author": "klwf",
    "record": "github.io",
    "startYear": "2017"
  },
  "markdown": {
    "lineNumbers": true
  },
  configureWebpack: (config, isServer) => {
    if (!isServer) {
      config.externals= {
        vue: 'Vue',
        'vue-router': 'VueRouter',
      }
      // 修改客户端的 webpack 配置
    }
  }
}