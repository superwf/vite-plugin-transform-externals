import type { Plugin } from 'vite'
import { transformExternals } from './transformExternals'
import type { PluginOption } from './type'

export default (option: PluginOption) => {
  const { externals } = option
  const globalName = option.globalName || 'window'
  const externalKeys = Object.keys(externals)

  const plugin: Plugin = {
    name: 'vite-plugin-externals',
    enforce: 'pre',

    /**
     * transform
     * `import { ... } from '...'`
     *            ⬇️
     * `const { ... } = window.xxx`
     * */
    transform(code: string, id: string) {
      if (/[tj]sx?$/.test(id)) {
        const lines = code.split('\n').map(line => {
          if (line.startsWith('import ')) {
            if (externalKeys.some(key => line.replace('"', "'").match(new RegExp(`'${key}'\\s*;?\\s*\r?$`)))) {
              return transformExternals({ code: line, externals, globalName })
            }
          }
          return line
        })
        return {
          code: lines.join('\n'),
        }
      }
      return code
    },
  }
  return plugin
}
