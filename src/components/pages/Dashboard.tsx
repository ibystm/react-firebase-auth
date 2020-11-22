import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setSuccess } from '../../store/actions/authActions';
import Message from '../UI/Message';

const DashBoard: FC = () => {
  const { user, needVerification, success } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      dispatch(setSuccess(''));
    }
  }, [success, dispatch]);

  return (
    <section className="section">
      <div className="container">
        {needVerification && (
          <Message type="success" msg="please verify your email address ." />
        )}
        <h1 className="is-size-1">Welcome {user?.firstName}</h1>
      </div>
    </section>
  );
};

export default DashBoard;
