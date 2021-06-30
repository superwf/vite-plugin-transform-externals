# vite-plugin-externals

transform simple webpack externals configuration for vite.

## Install

```sh
yarn add -D vite-plugin-transform-externals
```

## Usage

in your `vite.config.ts`

```
import TransformExternals from 'vite-plugin-transform-externals'

const externals = {
  react: 'React',
  '@ant-design/icons': 'AntDesignIcons',
  'antd/lib/locale-provider/zh_CN': ['antd', 'locales', 'zh_CN'],
  'rc-queue-anim': "window['rc-queue-anim']",
}

export default defineConfig({
  plugins: [
    TransformExternals({
      externals,
      // globalName: 'globalThis', // optional, default is window
    }),
  ]
})

```

## Examples

* default import

```ts
import antd from 'antd'
```
⬇️ ⬇️ ⬇️
```ts
const antd = window['antd']
```

* named import

```ts
import { Spin as AntSpin, Button } from "antd"
```
⬇️ ⬇️ ⬇️
```ts
const {
  US: US
} = window['antd']['locales']['en_US'];
```

* as default import

```ts
import * as React from 'react'
```
⬇️ ⬇️ ⬇️
```ts
const React = window['React']
```

* type import

```ts
import type { ReactComponent } from 'react'
```
⬇️ ⬇️ ⬇️
```ts
// empty string
```

* decect the external global variable format, for example `{ 'rc-queue-anim': window["rc-queue-anim"]'' }`

```ts
import QueueAnim from 'rc-queue-anim'
```
⬇️ ⬇️ ⬇️
```ts
const QueueAnim = window['rc-queue-anim'];
```

* decect the external global variable format, for example `{ events: 'global.events' }`

```ts
import Events from 'events'
```
⬇️ ⬇️ ⬇️
```ts
const Events = global.events;
```

* configurable global variable, default "window", can be `window`, `global` or `globalThis`.
