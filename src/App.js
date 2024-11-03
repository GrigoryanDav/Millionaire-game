import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { ROUTE_CONSTANTS, FIRESTORE_PATH_NAMES } from "./core/utils/constants";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./services/firebase";
import { doc, getDoc } from 'firebase/firestore'
import { AuthContext } from "./context/authContext";
import { useCallback, useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import LoadingWrapper from "./components/LoadingWrapper";
import MainGame from "./components/MainGame";
import MainLayout from "./components/MainLayout";
import Register from "./components/Register";
import './styles/global.css'


const App = () => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userInfo, setUserInfo] = useState([])

  const handleGetUserData = useCallback(async (uid) => {
    const docRef = doc(db, FIRESTORE_PATH_NAMES.REGISTERED_USERS, uid)
    const response = await getDoc(docRef)

    if (response.exists()) {
      setUserInfo(response.data())
    }
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user?.uid && handleGetUserData(user.uid)

      setLoading(false)
      setIsAuth(Boolean(user))
    })
  }, [handleGetUserData])

  return (
    <AuthContext.Provider value={{ isAuth, userInfo, handleGetUserData }}>
      <LoadingWrapper loading={loading}>
        <RouterProvider
          router={
            createBrowserRouter(
              createRoutesFromElements(
                <Route path="/" element={<MainLayout />} >
                  <Route path={ROUTE_CONSTANTS.LOGIN} element={isAuth ? <Navigate to={ROUTE_CONSTANTS.HOMEPAGE} /> : <Login />} />
                  <Route path={ROUTE_CONSTANTS.REGISTER} element={isAuth ? <Navigate to={ROUTE_CONSTANTS.HOMEPAGE} /> : <Register />} />
                  <Route path={ROUTE_CONSTANTS.HOMEPAGE} element={isAuth ? <HomePage userInfo={userInfo} /> : <Navigate to={ROUTE_CONSTANTS.LOGIN} />} />
                  <Route path={ROUTE_CONSTANTS.PLAY} element={isAuth ? <MainGame /> : <Navigate to={ROUTE_CONSTANTS.LOGIN} />} />
                </Route>
              )
            )
          }
        />
      </LoadingWrapper>
    </AuthContext.Provider>
  )
}

export default App;
