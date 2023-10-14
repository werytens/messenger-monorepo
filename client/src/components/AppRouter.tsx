import React, { useEffect, useContext } from 'react';
import { Context } from '../.';
import { observer } from 'mobx-react-lite';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router/router';

const AppRouter: React.FC = () => {
    const {store} = useContext(Context);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }  
    }, [store])

    if (store.isLoading) {
        return (
            <div>Loading</div>
        )
    }

    return (
        <Routes>
            {
                !store.isAuth ?

                publicRoutes.map((route, index) => (
                    <Route key = {index} element = {<route.component />} path = {route.path} />
                )) 

                :

                privateRoutes.map((route, index) => (
                    <Route key = {index} element = {<route.component />} path = {route.path} />
                ))
            }
        </Routes>
    )
}


export default observer(AppRouter);