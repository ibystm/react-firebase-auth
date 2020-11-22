import React, { FC } from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Props extends RouteProps {
  component: any;
}

// PrivateRouteComponentでは、compont propだけ受け取り、残りは子コンポーネントに渡す
const PrivateRoute: FC<Props> = ({ component: Component, ...rest }) => {
  //  useSelectorすることで、connectしてないcomponentでもStoreのstateを参照することができる
  const { authenticated } = useSelector((state: RootState) => state.auth);
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? <Component {...props} /> : <Redirect to="/signIn" />
      }
    />
  );
};

export default PrivateRoute;
