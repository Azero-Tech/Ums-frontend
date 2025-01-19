import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import { getTailorByToken } from "../../apis/authApi"
 
const AuthContext = createContext()

const AuthProvider = ({children}) => {
  const [isLogin,setLogin] = useState(false)
  const [user,setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    getTailorByToken().then((res)=>{
      setUser(res.data)
      setLogin(true)
    }).catch((err)=>{
      console.log(err.message)
      setUser(null)
      setLogin(false)
    })
  },[])
  return ( 
    <AuthContext.Provider value={{isLogin,setLogin,user,setUser,isLoading,setIsLoading}}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = ()=>{
  return useContext(AuthContext)
}

export default AuthProvider