import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store';
import {
  getUserById,
  setLoading,
  setNeedVerification,
} from './store/actions/authActions';
import firebase from 'firebase';
import Loader from './components/UI/Loader';
import { BrowserRouter, Switch } from 'react-router-dom';
import Header from './components/sections/Header';
import PublicRoute from './components/auth/PublicRoute';
import Home from './components/pages/Home';
import SignUp from './components/pages/SignUp';
import SignIn from './components/pages/SignIn';
import ForgotPassword from './components/pages/ForgotPassword';
import PrivateRoute from './components/auth/PrivateRoute';
import DashBoard from './components/pages/Dashboard';

const App: FC = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        dispatch(setLoading(true));
        await dispatch(getUserById(user.uid));
        if (!user.emailVerified) {
          dispatch(setNeedVerification());
        }
      }
      dispatch(setLoading(false));
      return () => {
        unsubscribe();
      };
    });
  }, [dispatch]);

  if (loading) {
    return <Loader />;
  }
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <PublicRoute path="/" component={Home} exact />
        <PublicRoute path="/signup" component={SignUp} exact />
        <PublicRoute path="/signin" component={SignIn} exact />
        <PublicRoute path="/forgot-password" component={ForgotPassword} exact />
        <PrivateRoute path="/dashboard" component={DashBoard} exact />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
