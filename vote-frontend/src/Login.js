import { useRef, useContext} from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import UserContext from './UserContext'


function Login() {
  var usernameRef = useRef()
  var passwordRef = useRef()
  var userCtx = useContext(UserContext)
  var history = useHistory()


  async function login() {
    try {
      const userInfo = (await axios.post('/account/login', {
        name: usernameRef.current.value,
        password: passwordRef.current.value,
      })).data
      userCtx.setUserInfo(userInfo)
      history.go(-1)
    } catch (e) {
      alert(e.toString())
    }
  }

  return (
    <div>
      用户名: <input type="text" ref={usernameRef}/><br/>
      密码: <input type="password" ref={passwordRef}/><br/>
      <button onClick={login}>登陆</button>
    </div>
  )
}

export default Login