import { getThemeConfig, defineConfig } from '@sugarat/theme/node'

const blogTheme = getThemeConfig({
  // 文章默认作者
  author: 'klwfwdk',
  // 友链
  friend: [
    {
      nickname: '粥里有勺糖',
      des: '主题作者',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTE2NzAzMA==674995167030',
      url: 'https://sugarat.top'
    },
    {
      nickname: 'Vitepress',
      des: 'Vite & Vue Powered Static Site Generator',
      avatar:
        'https://img.cdn.sugarat.top/mdImg/MTY3NDk5NTI2NzY1Ng==674995267656',
      url: 'https://vitepress.vuejs.org/'
    }
  ],
  recommend: {
    showSelf: false
  },
  // 开启离线的全文搜索支持（如构建报错可注释下面的配置再次尝试）
  search: 'pagefind'
})

export default defineConfig({
  extends: blogTheme,
  lang: 'zh-cn',
  title: 'klwf的技术博客',
  description: 'klwf的技术博客',
  vite: {
    optimizeDeps: {
      include: ['element-plus'],
      exclude: ['@sugarat/theme']
    }
  },
  lastUpdated: true,
  themeConfig: {
    lastUpdatedText: '上次更新于',
    // footer: {
    //   message: '自定义底部内容',
    //   copyright:
    //     'MIT Licensed | <a target="_blank" href="https://theme.sugarat.top/"> @sugarat/theme </a>'
    // },
    logo: '/logo.webp',
    // editLink: {
    //   pattern:
    //     'https://github.com/ATQQ/sugar-blog/tree/master/packages/blogpress/:path',
    //   text: '去 GitHub 上编辑内容'
    // },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/klwfwdk'
      }
    ]
  }
})
