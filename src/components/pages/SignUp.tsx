import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setError, signUp } from '../../store/actions/authActions';
import Input from '../UI/input';
import Message from '../UI/Message';
import Button from '../UI/Button';

const SignUp: FC = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
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
    dispatch(
      signUp({ email, password, firstName, lastName }, () => setLoading(false))
    );
  };

  const onChangeFirstName = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setFirstName(e.currentTarget.value);
    },
    [setFirstName]
  );

  const onChangeLastName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setLastName(e.currentTarget.value);
  }, []);

  const onChangeEmail = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setEmail(e.currentTarget.value);
    },
    [setEmail]
  );

  const onChangePassword = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.currentTarget.value);
    },
    [setFirstName]
  );

  return (
    <section className="className">
      <div className="container">
        <h2 className="has-text-centered is-size-2 mb-3">SignUp</h2>
        <form className="form" onSubmit={submitHandler}>
          {error && <Message msg={error} type="danger" />}
          <Input
            name="firstName"
            value={firstName}
            onChange={onChangeFirstName}
            placeholder="First name"
            label="First name"
          />
          <Input
            name="lastName"
            value={lastName}
            onChange={onChangeLastName}
            placeholder="Last name"
            label="Last name"
          />
          <Input
            name="email"
            value={email}
            onChange={onChangeEmail}
            placeholder="Email address"
            label="Email address"
          />
          <Input
            name="password"
            value={password}
            onChange={onChangePassword}
            placeholder="Password"
            label="Password"
          />
          <Button
            text={loading ? 'Loading...' : 'Sign Up'}
            className="is-primary is-fullwidth mt-5"
            disabled={loading}
          />
        </form>
      </div>
    </section>
  );
};

export default SignUp;
