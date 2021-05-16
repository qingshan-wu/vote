



import { createContext, useContext } from 'react'

const UserContext = createContext()

UserContext.displayName = "UserContext"

export default  UserContext


// 自定义hook
export  function useUserInfo() {
  var userCtx = useContext(UserContext)
  return userCtx.userInfo
}