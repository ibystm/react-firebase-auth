import { ThunkAction } from 'redux-thunk';
import {
  AuthAction,
  SignUpData,
  User,
  NEED_VERIFICATION,
  SET_SUCCESS,
  SET_USER,
  SET_LOADING,
  SignInData,
  SIGN_OUT,
} from '../types';
import { RootState } from '../index';
import firebase from 'firebase';
import { SET_ERROR } from '../types';
import { facebookProvider, googleProvider } from '../../firebase/config';
import { ErrorCodes } from '../../types/ErrorCodes';
import { ErrorMessages } from '../../types/ErrorMessages';

export const signUp = (
  data: SignUpData,
  onError: () => void
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      const res = await firebase
        .auth()
        .createUserWithEmailAndPassword(data.email, data.password);
      if (res.user) {
        const userData: User = {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          id: res.user.uid,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await firebase
          .firestore()
          .collection('/users')
          .doc(res.user.uid)
          .set(userData);
        await res.user.sendEmailVerification();
        dispatch({
          type: NEED_VERIFICATION,
        });
        dispatch({
          type: SET_USER,
          payload: userData,
        });
      }
    } catch (e) {
      console.log(e);
      onError();
      dispatch({
        type: SET_ERROR,
        payload: e.message,
      });
    }
  };
};

export const signUpByGoogle = (
  onError: () => void
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      await firebase
        .auth()
        .signInWithPopup(googleProvider)
        .then((res) => {
          const user = res.user;
          // register user to DB
          if (user) {
            const userData: User = {
              firstName: user.displayName ? user.displayName : '',
              lastName: '',
              id: user.uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            firebase
              .firestore()
              .collection('/users')
              .doc(user.uid)
              .set(userData);
            dispatch({ type: SET_USER, payload: userData });
          }
        });
      // firebase.auth().useDeviceLanguage();
    } catch (e) {
      console.log('message', e.message);
      console.log('code', e.code);
    }
  };
};

export const signUpByFacebook = (
  onError: () => void
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    console.log('ちゃんとと大千枝雨?');
    try {
      await firebase
        .auth()
        .signInWithPopup(facebookProvider)
        .then((res) => {
          const user = res.user;
          // register user to DB
          if (user) {
            const userData: User = {
              firstName: user.displayName ? user.displayName : '',
              lastName: '',
              id: user.uid,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            firebase
              .firestore()
              .collection('/users')
              .doc(user.uid)
              .set(userData);
            dispatch({ type: SET_USER, payload: userData });
          }
        });
      // firebase.auth().useDeviceLanguage();
    } catch (e) {
      if (e.code === ErrorCodes.USER_ALREADY_EXISTS) {
        onError();
        dispatch(setError(ErrorMessages.USER_ALREADY_EXISTS));
      }
    }
  };
};

export const getUserById = (
  id: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      const user = await firebase.firestore().collection('users').doc(id).get();

      if (user.exists) {
        const userData = user.data() as User;
        dispatch({
          type: SET_USER,
          payload: userData,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };
};

export const setLoading = (
  value: boolean
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_LOADING,
      payload: value,
    });
  };
};

export const signIn = (
  data: SignInData,
  onError: () => void
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      await firebase
        .auth()
        .signInWithEmailAndPassword(data.email, data.password);
    } catch (e) {
      console.log(e);
      onError();
      dispatch(setError(e.message));
    }
  };
};

// log out
export const signOut = (): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true));
      await firebase.auth().signOut();
      dispatch({
        type: SIGN_OUT,
      });
    } catch (e) {
      console.log(e);
      dispatch(setLoading(false));
    }
  };
};

// set error
export const setError = (
  msg: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_ERROR,
      payload: msg,
    });
  };
};

// set need verification
export const setNeedVerification = (): ThunkAction<
  void,
  RootState,
  null,
  AuthAction
> => {
  return (dispatch) => {
    dispatch({
      type: NEED_VERIFICATION,
    });
  };
};

// set success
export const setSuccess = (
  msg: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_SUCCESS,
      payload: msg,
    });
  };
};

export const sendPasswordResetEmail = (
  email: string,
  successMsg: string
): ThunkAction<void, RootState, null, AuthAction> => {
  return async (dispatch) => {
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      dispatch(setSuccess(successMsg));
    } catch (e) {
      console.log(e);
      dispatch(setError(e.message));
    }
  };
};
