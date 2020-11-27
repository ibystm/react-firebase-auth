import firebase from 'firebase';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setError, setSuccess } from '../../store/actions/authActions';
import Message from '../UI/Message';

const DashBoard: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user && success) {
        dispatch(setSuccess(''));
      } else {
        dispatch(setError('failed'));
        console.log('ログイン失敗しているみたい');
      }
    });
  }, [success, dispatch]);

  return (
    <section className="section">
      <div className="container">
        {needVerification && (
          <Message type="success" msg="please verify your email address ." />
        )}
        <h1 className="is-size-1">
          Welcome {user?.firstName} {user?.lastName}
        </h1>
      </div>
    </section>
  );
};

export default DashBoard;
