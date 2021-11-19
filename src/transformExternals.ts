import { parse } from '@babel/parser'
import generate from '@babel/generator'
import template from '@babel/template'
import traverse from '@babel/traverse'
import type { Node } from '@babel/types'
import type { PluginOption } from './type'
// import * as t from '@babel/types'

/**
 * 配合vite，在vite plugin中使用
 *
 * 将源码中的
 * ```
 * import React from 'react'
 * import React, { useEffect } from 'react'
 * import * as React from 'react'
 *
 * 都转换为
 * const React = window['React']
 * const { useEffect: useEffect } = window['React']
 * 这种格式，从externals中全局变量获取
 * ```
 * */
export const transformExternals = ({
  code,
  externals,
  globalName,
}: {
  code: string
  externals: Record<string, string | string[]>
  globalName?: PluginOption['globalName']
}) => {
  globalName = globalName || 'window'
  const externalKeys = Object.keys(externals)
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
  })
  let shouldTransform = false

  traverse(ast, {
    CallExpression(path) {
      const { node } = path
      if ('name' in node.callee && node.callee.name === 'require' && node.arguments.length === 1) {
        if ('value' in node.arguments[0] && node.arguments[0].value) {
          const externalName = String(node.arguments[0].value)
          if (externalKeys.includes(externalName)) {
            shouldTransform = true
            const externalValue = externals[externalName]
            const externalGlobalName = Array.isArray(externalValue) ? externalValue.join("']['") : externalValue
            const externalGlobalVariable = /^(window|global|globalThis)[[.]/.test(externalGlobalName)
              ? externalGlobalName
              : `${globalName}['${externalGlobalName}']`
            const newNode: Node = template.statement.ast(externalGlobalVariable)
            path.replaceWith(newNode)
          }
        }
      }
    },
    ImportDeclaration(path) {
      if (path.node.source.type === 'StringLiteral' && externalKeys.includes(path.node.source.value)) {
        shouldTransform = true

        // remove type node
        if (path.node.importKind === 'type') {
          path.remove()
          return
        }
        /** 处理named 与 default 两种import模式 */
        const imports = path.node.specifiers.reduce<{
          namedImport: string[]
          defaultImport: string
        }>(
          (r, s) => {
            if (s.type === 'ImportSpecifier') {
              if (s.imported.type === 'Identifier' && s.local.type === 'Identifier') {
                r.namedImport.push(`${s.imported.name}: ${s.local.name}`)
              }
            } else if (s.type === 'ImportDefaultSpecifier') {
              r.defaultImport = s.local.name
            } else if (s.type === 'ImportNamespaceSpecifier') {
              r.defaultImport = s.local.name
            }
            return r
          },
          {
            namedImport: [],
            defaultImport: '',
          },
        )
        const externalValue = externals[path.node.source.value]
        const externalGlobalName = Array.isArray(externalValue) ? externalValue.join("']['") : externalValue
        const externalGlobalVariable = /^(window|global|globalThis)[[.]/.test(externalGlobalName)
          ? externalGlobalName
          : `${globalName}['${externalGlobalName}']`
        const nodes: Node[] = []
        if (imports.defaultImport) {
          nodes.push(template.statement.ast(`const ${imports.defaultImport} = ${externalGlobalVariable};`))
        }
        if (imports.namedImport.length > 0) {
          nodes.push(template.statement.ast(`const { ${imports.namedImport.join(', ')} } = ${externalGlobalVariable};`))
        }
        path.replaceWithMultiple(nodes)
      }
    },
  })
  // const result = generate(ast, { sourceMaps: true, sourceFileName: filename, filename, sourceRoot: '/' }, code)
  if (shouldTransform) {
    return generate(ast, {}, code).code
  }
  return code
}
