import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from "react-router-dom";
import { ROUTE_CONSTANTS } from "./core/utils/constants";
import Login from "./components/Login";
import Register from "./components/Register";


const App = () => {
  return (
    <RouterProvider
      router={
        createBrowserRouter(
          createRoutesFromElements(
            <>
              <Route path="/" element={<Navigate to={ROUTE_CONSTANTS.LOGIN} />} />
              <Route path={ROUTE_CONSTANTS.LOGIN} element={<Login />} />
              <Route path={ROUTE_CONSTANTS.REGISTER} element={<Register />} />
            </>
          )
        )
      }
    />
  )
}

export default App;
