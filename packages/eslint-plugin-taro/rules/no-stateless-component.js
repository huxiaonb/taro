const { buildDocsMeta } = require('../utils/utils')

const ERROR_MESSAGE = '暂不支持无状态组件（stateless component）'

module.exports = {
  meta: {
    docs: buildDocsMeta(ERROR_MESSAGE, 'no-stateless-component')
  },

  create (context) {
    return {
      JSXElement (node) {
        const parents = context.getAncestors(node)
        const funcDecl = parents.find(p => p.type === 'FunctionDeclaration')
        if (funcDecl) {
          context.report({
            message: ERROR_MESSAGE,
            node: funcDecl
          })
        }

        const funcExpression = parents.find(p => p.type === 'ArrowFunctionExpression' || p.type === 'FunctionExpression')

        if (funcExpression) {
          const arrowFuncParents = context.getAncestors(funcExpression)
          const isMapCallExpr = arrowFuncParents.some(p =>
            p.type === 'CallExpression' &&
            p.callee.type === 'MemberExpression' &&
            p.callee.property.type === 'Identifier' &&
            p.callee.property.name === 'map'
          )
          // console.log(mapCallExpr, 'mapCallExpr')
          const varDecl = arrowFuncParents.some(p => p.type === 'VariableDeclaration')
          if (varDecl && !isMapCallExpr) {
            context.report({
              message: ERROR_MESSAGE,
              node: funcExpression
            })
          }
        }
      }
    }
  }
}
