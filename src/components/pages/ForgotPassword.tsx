import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  sendPasswordResetEmail,
  setError,
  setSuccess,
  signIn,
} from '../../store/actions/authActions';
import Input from '../UI/input';
import Message from '../UI/Message';
import Button from '../UI/Button';

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { error, success } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(setError(''));
      }
      if (success) {
        dispatch(setSuccess(''));
      }
    };
  }, [error, dispatch]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(sendPasswordResetEmail(email, 'Email send!'));
  };

  return (
    <section className="className">
      <div className="container">
        <h2 className="has-text-centered is-size-2 mb-3">Reset Password</h2>
        <form className="form" onSubmit={submitHandler}>
          {error && <Message msg={error} type="danger" />}
          {success && <Message msg={success} type="success" />}
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="Email address"
            label="Email address"
          />
          <Button
            text={loading ? 'Loading...' : 'Sign In'}
            className="is-primary is-fullwidth mt-5"
            disabled={loading}
          />
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;

// useEffect クリーンアップ処理について
// useDispatchについて
// e.preventDefault()について
