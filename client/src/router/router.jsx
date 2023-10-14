import Main from "../pages/Main/Main"
import Login from "../pages/Login/Login"
import Registration from "../pages/Registration/Registration"

export const publicRoutes = [
    {   path: "*", component: Login   },
    {   path: "/registration", component: Registration   },
]

export const privateRoutes = [
    {   path: "*", component:  Main   },
]