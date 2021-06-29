import { transformExternals } from './transformExternals'
import { externals, cases } from './fixture'

describe('transform', () => {
  const filename = './test.tsx'
  it('named import', () => {
    // const code = `import { render } from "other";`
    // console.log(transformExternals(code, externals).code)
    expect(transformExternals({ code: cases.namedImport.input, externals, filename }).code).toBe(
      cases.namedImport.output,
    )
  })

  it('default import', () => {
    const code = `import antd from 'antd';`

    expect(transformExternals({ code, externals, filename }).code).toBe(`const antd = window['antd'];`)
  })

  it('named and default import', () => {
    const code = `import React, { useEffect } from 'react';`

    expect(transformExternals({ code, externals, filename }).code).toBe(
      `const React = window['React'];
const {
  useEffect: useEffect
} = window['React'];`,
    )
  })

  it('* as default import', () => {
    const code = `import * as React from 'react'`

    expect(transformExternals({ code, externals, filename }).code).toBe(`const React = window['React'];`)
  })

  it('type import', () => {
    const code = `import type { ReactComponent } from 'react'`

    expect(transformExternals({ code, externals, filename }).code).toBe('')
  })

  it('import global window["rc-queue-anim"]', () => {
    const code = `import QueueAnim from 'rc-queue-anim'`

    expect(transformExternals({ code, externals, filename }).code).toBe("const QueueAnim = window['rc-queue-anim'];")
  })

  it('global events', () => {
    const code = `import Events from 'events'`

    expect(transformExternals({ code, externals, filename }).code).toBe('const Events = global.events;')
  })
})
