const path = require('path')

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.module.rules.forEach(rule => {
        if (!rule.oneOf) {
          return
        }
        // 在这个位置找 babel-loader
        rule.oneOf.forEach(ruleItem => {
          const isBabelLoader = ruleItem.test?.source?.includes?.('ts')
          if (isBabelLoader) {
            ruleItem.include = [
              ...getAllWorkspaceDepPaths(),
              ruleItem.include
            ]
          }
        })
      })

      return webpackConfig
    },
  },
}

/**
 * 这个方法可以动态获取所有 package.json 里引用的其他子项目
 */
function getAllWorkspaceDepPaths() {

  const SCOPE_PREFIX = '@xiaolongbao'

  const pkg = require('./package.json')
  const depsObj = pkg.dependencies
  if (!depsObj) {
    return []
  }
  const depPaths = []
  Object.entries(depsObj).forEach(([name, version]) => {
    if (name.startsWith(SCOPE_PREFIX) && version.startsWith('workspace:')) {
      depPaths.push(path.resolve(`../${name.slice(SCOPE_PREFIX.length + 1)}`))
    }
  })
  return depPaths
}
