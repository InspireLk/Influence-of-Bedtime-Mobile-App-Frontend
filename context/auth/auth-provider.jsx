import React, { useReducer, useState, useMemo, useCallback, useEffect } from 'react';
import axios, {endpoints} from '../../utils/axios';

import { AuthContext } from './auth-context';

const initialState = {
    user: null,
    loading: true,
    isLoggedIn: false,
    accessToken: null,
  };

const reducer = (state, action) => {

    if (action.type === 'INITIAL') {
        return {
        loading: false,
        user: action.payload.user,
        isLoggedIn: false,
        accessToken: null,
        };
    }
    if (action.type === 'SHOW_LOADER') {
        return {
        ...state,
        loading: true,
        };
    }
    if (action.type === 'HIDE_LOADER') {
        return {
        ...state,
        loading: false,
        };
    }
    if (action.type === 'LOGIN') {
        return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        isLoggedIn: true,
        };
    }
    if (action.type === 'LOGOUT') {
        return {
        ...state,
        user: null,
        accessToken: null,
        isLoggedIn: false,
        };
    }

    return state;

};

// ----------------------------------------------------------------------

// const STORAGE_KEY = 'accessToken';

export const AuthProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(async () => {

        try {
        //   const accessToken = sessionStorage.getItem(STORAGE_KEY);
            const accessToken = '1223';
        if (accessToken) {

            // setSession(accessToken);

            const response = await axios.get(endpoints.auth.me);

            const { user } = response.data;

            dispatch({
            type: 'INITIAL',
            payload: {
                user: {
                ...user,
                accessToken,
                },
            },
            });
        } else {
            dispatch({
            type: 'INITIAL',
            payload: {
                user: null,
            },
            });
        }
        } catch (error) {
        console.error(error);
        dispatch({
            type: 'INITIAL',
            payload: {
            user: null,
            },
        });
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const login = useCallback(async (email, password) => {

        try {

                dispatch({ type: 'SHOW_LOADER' });

                const data = {
                    email,
                    password,
                };

                const response = await axios.post(endpoints.auth.login, data);

                const { accessToken, user } = response.data;

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        user: {
                            ...user,
                        },
                        accessToken: {
                            ...accessToken,
                        },
                    },
                });

        } catch (error) {
            dispatch({ type: 'HIDE_LOADER' });
        }
    }, []);

    const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

    const status = state.loading ? 'loading' : checkAuthenticated;

    const memoizedValue = useMemo(
        () => ({
          user: state.user,
          userToken: state.userToken,
          loading: state.loading,
          isLoggedIn: state.isLoggedIn,
          authenticated: status === 'authenticated',
          unauthenticated: status === 'unauthenticated',
          //
          login,
        }),
        [
            state.user,
            state.userToken,
            state.loading,
            state.isLoggedIn,
            status,

            login,
        ]
      );

    return (
      <AuthContext.Provider value={memoizedValue}>
        {children}
      </AuthContext.Provider>
    );
  };

export default AuthContext;
