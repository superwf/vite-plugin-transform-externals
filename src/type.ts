/** Plugin Option */
export type PluginOption = {
  externals: Record<string, string | string[]>
  globalName?: 'window' | 'global' | 'globalThis'
}
