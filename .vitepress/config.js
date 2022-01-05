const { getPosts, generatePaginationPages } = require('./theme/serverUtils')
console.log(getPosts())
async function config() {
    const pageSize = 100
    await generatePaginationPages(pageSize)
    return {
        title: 'KLWF的技术博客',
        base:'/',
        description: 'vitepress赛高',
        themeConfig: {
            posts: await getPosts(),
            pageSize: pageSize,
            // website: 'https://github.com/airene/vitepress-blog-pure', //copyright link
            comment: {
                repo: 'airene/vitepress-blog-pure',
                themes: 'github-light',
                issueTerm: 'pathname'
            },
            nav: [
                { text: 'Home', link: '/' },
                { text: 'Archives', link: '/pages/archives' },
                { text: 'Tags', link: '/pages/tags' },
                { text: 'About', link: '/pages/about' }
                // { text: 'Airene', link: 'http://airene.net' }  -- External link test
            ]
        },
        srcExclude: ['README.md'] // exclude the README.md , needn't to compiler
        /*
        vite: {
            build: { minify: false }
        },
        optimizeDeps: {
            keepNames: true
        }
        */
    }
}

module.exports = config()
