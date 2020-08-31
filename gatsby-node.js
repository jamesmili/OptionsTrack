const path = require("path")

exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions
    if (page.path.match(/^\/options/)){
        page.matchPath = "/options/*"
        createPage(page)
    }
}

exports.createPages = ({ graphql, actions }) => {
    const { createRedirect } = actions
    createRedirect({
        fromPath: '/',
        exactPath: true,
        isPermanent: false,
        redirectInBrowser: true,
        toPath: '/options/TSLA'
    });
  }