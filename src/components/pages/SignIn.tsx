import React, { FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setError, signIn } from '../../store/actions/authActions';
import Input from '../UI/input';
import Message from '../UI/Message';
import Button from '../UI/Button';
import { Link } from 'react-router-dom';

const SignIn: FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(setError(''));
      }
    };
  }, [error, dispatch]);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(signIn({ email, password }, () => setLoading(false)));
  };

  return (
    <section className="className">
      <div className="container">
        <h2 className="has-text-centered is-size-2 mb-3">SignUp</h2>
        <form className="form" onSubmit={submitHandler}>
          {error && <Message msg={error} type="danger" />}
          <Input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            placeholder="Email address"
            label="Email address"
          />
          <Input
            name="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder="Password"
            label="Password"
          />
          <p>
            <Link to="/forgot-password">Forgot Password</Link>
          </p>
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

export default SignIn;
