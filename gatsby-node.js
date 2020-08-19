const path = require("path")

exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions

    console.log("Page -", page.path)
    if (page.path.match(/^\/options/)){
        page.matchPath = "/options/*"
        createPage(page)
    }
}