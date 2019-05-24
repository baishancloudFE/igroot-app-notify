# App Notify 组件
> 应用消息通知组件

notify 组件是一个函数，可用于 class 定义的 React 组件，或已被实例化的 React 组件

```jsx
import React from 'react'
import { Button } from 'igroot'
import notify from './index'

const notifyElement = notify({
  url: 'http://msg-post.k8s.bs58i.baishancloud.com',
  user: 100,
  app: 200
})(
  <Button
    draggable
    shape="circle"
    type="primary"
    icon="sound"
  />
)

ReactDOM.render(notifyElement, mountNode)
```