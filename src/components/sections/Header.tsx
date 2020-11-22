import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { signOut } from '../../store/actions/authActions';
import Button from '../UI/Button';
import { RootState } from '../../store';

const Header: FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const logoutClickHandler = useCallback(() => dispatch(signOut()), []);
  const signUpClickHandler = useCallback(() => history.push('/signup'), []);
  const signInClickHandler = useCallback(() => history.push('/signin'), []);
  const { authenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className="navbar is-spaced has-shadow">
      <div className="container">
        <div className="navbar-brand">
          <Link
            className="navbar-item"
            to={!authenticated ? '/' : '/dashboard'}>
            AppName
          </Link>
        </div>
        <div className="navbar-end">
          <div className="navbar-items">
            {!authenticated ? (
              <div className="buttons">
                <Button
                  text="Sign Up"
                  onClick={signUpClickHandler}
                  className="is-primary"
                />
                <Button text="Sign In" onClick={signInClickHandler} />
              </div>
            ) : (
              <Button text="Sign out" onClick={logoutClickHandler} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
