import React from 'react'
import { Button, Popover, Badge, Avatar, Tabs, List, Icon, Modal, notification } from 'igroot'
import io from 'socket.io-client'

const { TabPane } = Tabs
const { Item } = List

const SIGNAL = {
  NEW_USER_MSG: 'new_user_msg',
  NEW_APP_MSG: 'new_app_msg',
  CHECK_USER_MSG: 'check_user_msg',
  CHECK_APP_MSG: 'check_app_msg',
  READ_APP_MSG: 'read_app_msg',
  READ_USER_MSG: 'read_user_msg'
}

class NotifyPopover extends React.PureComponent {
  state = {
    appData: [],
    personData: [],
    disabled: true,

    data: {}
  }

  componentDidMount() {
    const { url, user, app } = this.props

    if (!url) return

    fetch(url + '/api/auth', {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        app_id: app,
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",//localStorage.getItem('jwtToken'),
        user_id: user
      })
    }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(({ code, data: token, msg }) => {
        console.log(token)
        if (code !== 0) return console.error('Error:', msg)

        const socket = this.socket = io(url + '/io', { query: {token} })
        const handleNewMsg = res => {
          const send = item => {
            const { title, describe } = item

            notification.open({
              message: title,
              description: describe,
              duration: 10
            })
          }

          const isArray = Array.isArray(res)
          const data = (isArray ? res[0] : res) || {}

          isArray ? res.forEach(send) : send(res)
          if (data.app_id) this.setState({ appData: Array.prototype.concat(res, this.state.appData) })
          if (data.user_id) this.setState({ personData: Array.prototype.concat(res, this.state.personData) })
        }

        socket.on('connect', () => {
          console.log('%csuccess', 'padding: 2px 5px; background: #099424; color: #fff; border-radius: 5px;', 'socket建连成功')

          this.setState({ disabled: false })
          socket.emit(SIGNAL.CHECK_USER_MSG)
          socket.emit(SIGNAL.CHECK_APP_MSG)
        })

        socket.on(SIGNAL.NEW_USER_MSG, handleNewMsg)
        socket.on(SIGNAL.NEW_APP_MSG, handleNewMsg)
        socket.on(SIGNAL.CHECK_USER_MSG, handleNewMsg)
        socket.on(SIGNAL.CHECK_APP_MSG, handleNewMsg)
      })
  }

  render() {
    const { appData, personData, disabled, data } = this.state
    const unreadLen = [...appData, ...personData]
      .filter(item => !item.read)
      .length

    return (
      <Popover
        overlayClassName="notify-popover"
        content={(
          <Tabs defaultActiveKey="app">
            <TabPane key="app" tab="应用">
              {this.renderList(appData, 'app')}
            </TabPane>

            <TabPane key="person" tab="个人">
              {this.renderList(personData, 'person')}
            </TabPane>
          </Tabs>
        )}
        trigger="click"
        {...this.props}
      >
        <Badge count={unreadLen}>
          {React.cloneElement(this.props.children, { disabled })}
        </Badge>

        <Modal
          title={data.title}
          visible={this.state.visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <p>{data.describe}</p>
          {data.data ? (
            <p>
              <h4>{data.data.version}</h4>
              {data.data.logs.map((info, i) => <p key={i}>{info}</p>)}
            </p>
          ) : null}
        </Modal>
      </Popover>
    )
  }

  renderList = (dataSource = [], type) => {
    return dataSource.length
      ? (
        <List
          style={{ overflow: 'auto', maxHeight: 380 }}
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={item => (
            <Item
              key={item._id}
              onClick={() => this.showDetail(item)}
              className={`list-item${item.read ? ' list-item-read' : ''}`}
            >
              <Item.Meta
                avatar={<Avatar style={{ backgroundColor: item.color }} icon={item.icon} />}
                title={(
                  <div style={{ position: 'relative' }}>
                    {item.title}
                    <Button
                      ghost
                      size="small"
                      type="primary"
                      disabled={item.read}
                      onClick={this.onRead(item, type)}
                      style={{ position: 'absolute', right: 0 }}
                    >已读</Button>
                  </div>
                )}

                description={
                  <div>
                    <div>{item.describe}</div>
                    <div>{item.lastTime}</div>
                  </div>
                }
              />
            </Item>
          )}
        />
      )

      : (
        <div className="list-null">
          <Icon type="bell" />
          <p>暂无新通知</p>
        </div>
      )
  }

  showDetail = item => {
    this.showModal(item)
  }

  showModal = data => this.setState({ visible: true, data })
  hideModal = () => this.setState({ visible: false })

  onRead = (item, type) => e => {
    e.stopPropagation()

    let data, signal
    if (type === 'app') {
      data = 'appData'
      signal = SIGNAL.READ_APP_MSG
    }

    if (type === 'person') {
      data = 'personData'
      signal = SIGNAL.READ_USER_MSG
    }

    item.read = true
    this.setState({ [data]: [...this.state[data]] })
    this.socket.emit(signal, item._id)
  }
}

export default (config = {}) => Component => {
  // 装饰器用法
  if (Component instanceof React.Component)
    return class NotifyWarp extends Component {
      state = {
        x: document.body.clientWidth - 40,
        y: 100,
      }

      render() {
        const { x, y } = this.state

        return (
          <React.Fragment>
            {super.render()}

            <NotifyPopover {...config}>
              <Button
                draggable
                size="large"
                type="primary"
                shape="circle"
                onDrag={this.onDrag}
                className="notify-btn"
                style={{
                  width: 50,
                  height: 50,
                  fontSize: 25,
                  top: y - 25,
                  left: x - 25
                }}
              ><Icon type="bell" /></Button>
            </NotifyPopover>
          </React.Fragment>
        )
      }

      onDrag = throttle(e => {
        clearTimeout(this.trim)
        this.trim = this.willTrim(e.pageX, e.pageY, 150)
      }, 100)

      willTrim = (x, y, wait) => setTimeout(() => this.setState({ x: document.body.clientWidth - 40, y }), wait)
    }

  // 组件用法
  if (React.isValidElement(Component))
    return (
      <NotifyPopover {...config}>
        {Component}
      </NotifyPopover>
    )

  throw new TypeError('Notify functions should be passed in a class or react component!')
}

// 函数节流
function throttle(fn, wait) {
  var start = Date.now()

  return function(...arg) {
    if (Date.now() - start < wait)
      return

    start = Date.now()
    fn(...arg)
  }
}