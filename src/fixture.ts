export const externals = {
  'regenerator-runtime': 'regeneratorRuntime',
  'core-js': 'core',
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router-dom': 'ReactRouterDOM',
  moment: 'moment',
  lodash: '_',
  '@ant-design/icons/lib/dist': 'AntDesignIcons',
  '@ant-design/icons': 'AntDesignIcons',
  'react-transition-group': 'ReactTransitionGroup',
  '@sentry/browser': 'Sentry',
  'antd/lib/locale-provider/zh_CN': ['antd', 'locales', 'zh_CN'],
  'antd/lib/locale-provider/en_US': ['antd', 'locales', 'en_US'],
  antd: 'antd',
  echarts: 'echarts',
  events: 'global.events',
  'rc-queue-anim': "window['rc-queue-anim']",
}

export const cases = {
  namedImport: {
    input: `import { Spin as AntSpin, Button } from "antd";
import { US } from "antd/lib/locale-provider/en_US";
import { render } from "other";
render(<Spin />, document.getElementById("root"));`,
    output: `const {
  Spin: AntSpin,
  Button: Button
} = window['antd'];
const {
  US: US
} = window['antd']['locales']['en_US'];
import { render } from "other";
render(<Spin />, document.getElementById("root"));`,
  },
}
