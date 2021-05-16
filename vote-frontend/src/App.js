import { NavLink as Link, Switch, Route, Redirect, useHistory} from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import Home from './Home'
import CreateVote from './CreateVote'
import ViewVote from './ViewVote'
import Mine from './Mine'

import UserContext from './UserContext'
import { useState, Suspense, useEffect } from 'react'
import axios from 'axios'

import { TabBar, NavBar, Icon } from 'antd-mobile';


function App() {

  const [userInfo, setUserInfo] = useState(null)
  const history = useHistory()

  async function logout() {
    await axios.get('/account/logout')
    setUserInfo(null)
    history.push('/login')
  }



  useEffect(() => {
    (async () => {
      if (!userInfo) { //即未登录
        try {
          let info = (await axios.get('/account/userinfo')).data
          setUserInfo(info)
        } catch (e) {
          console.log('用户未登陆')
        }
      }
    })()
  }, [userInfo])

  return (
    <UserContext.Provider value={{userInfo, setUserInfo}}>
      <div className="App">
        {/* <Link to="/home">首页</Link>
        { userInfo ?
          <>
            <span>欢迎 {userInfo.name}</span>
            <Link to="/home">创建</Link>
            <Link to="/mine">我的</Link>
            <button onClick={ logout }>退出</button>
          </> :
          <>
            <Link to="/login">登陆</Link>
            <Link to="/register">注册</Link>
          </>
        } */}
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
          style={{backgroundColor: '#f2f3f6'}}
        >投票
        </NavBar>

        <Switch>
          <Route path="/" exact>
            <Redirect to="/home"></Redirect>
          </Route>
          <Route path="/home" component={Home}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/create" component={CreateVote}/>
          <Route path="/mine" component={Mine}/>
          <Route path="/vote/:id">
            <Suspense fallback={'loading...'}>
              <ViewVote />
            </Suspense>
          </Route>
        </Switch>
      </div>
    </UserContext.Provider>
  );
}

export default App;
