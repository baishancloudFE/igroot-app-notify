### 示例文档

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