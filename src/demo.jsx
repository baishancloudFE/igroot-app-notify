import React from 'react'
import { Button } from 'igroot'
import notify from './index'

// @notify({
//   url: 'http://test.com',
//   user: 100,
//   app: 200
// })
// class MyApp extends React.Component {
//   render() {
//     return (
//       <Button
//         draggable
//         shape="circle"
//         type="primary"
//         icon="sound"
//       />
//     )
//   }
// }

export default () => notify({
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
// })
