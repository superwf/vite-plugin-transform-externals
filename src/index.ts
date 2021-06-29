import type { Plugin } from 'vite'
import { transformExternals } from './transformExternals'
import type { Option } from './type'

export default (option: Option) => {
  const { externals } = option
  // const externalKeys = Object.keys(externals)

  const plugin: Plugin = {
    name: 'vite-plugin-externals',
    enforce: 'pre',
    // resolveId(id: string) {
    //   if (id in externals) {
    //     return id
    //   }
    //   return null
    // },
    // load(id) {
    //   if (id in externals) {
    //     return `const mod = window.${(externals as any)[id]};
    //   export default mod`
    //   }
    //   return null
    // },

    /**
     * transform
     * `import { ... } from '...'`
     *            ⬇️
     * `const { ... } = window.xxx`
     * */
    transform(code, id) {
      return transformExternals({ code, externals, filename: id })
    },
  }
  return plugin
}
