
import axios from 'axios'
import { useState } from 'react'

import { useInput } from './hooks'






function Register() {
  let name = useInput()
  let password = useInput()
  let gender = useInput()
  let email = useInput()
  let [ previewUrl, setPreviewUrl ] = useState(null)

  async function register() {

    await axios.post('/account/register', {
      name: name.value,
      password: password.value,
      gender: gender.value,
      email: email.value,
      avatar: previewUrl,
    })
    alert('ok')
  }

  async function upload(e) {
    var fd = new FormData()
    fd.set('avatar', e.target.files[0])
    console.log(e.target.files)
    var res = await axios.post('/upload', fd)
    console.log(res.data.url)
    setPreviewUrl(res.data.url)
  }


  return (
    <div>
      <div>用户名: <input type="text" {...name}/></div>
      <div>密码: <input type="password" {...password}/></div>
      <div>性别: <input type="text" {...gender}/></div>
      <div>邮箱: <input type="text" {...email}/></div>
      <div>头像: <input type="file" onChange={upload}/></div>
      <img src={previewUrl}/>
      {/* <input type='radio' name="gender" value="m"/> 男
      <input type='radio' name="gender" value="f"/> 女 */}
      <br/>
      <button onClick={register}>注册</button>
    </div>
  )
}

export default Register