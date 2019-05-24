### App Notify 应用消息通知

应用消息通知组件。

## 使用说明
<ul>
  <li>该组件为函数调用，目的在于以后兼容非 React 项目；</li>
</ul>

## 代码演示
直接调用。
```jsx
import React from 'react'
import { Button } from 'igroot'
import notify from 'igroot-app-notify'

notify({
  url: 'http://test.com',
  user: 100,
  app: 200
})
```

包裹组件用法。
```jsx
import React from 'react'
import { Button } from 'igroot'
import notify from 'igroot-app-notify'

const notifyElement = notify({
  url: 'http://test.com',
  user: 100,
  app: 200
}, (
  <Button
    draggable
    shape="circle"
    type="primary"
    icon="sound"
  />
))

ReactDOM.render(notifyElement, mountNode)
```