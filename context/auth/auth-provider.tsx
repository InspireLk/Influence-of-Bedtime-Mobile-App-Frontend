import PropTypes, { bool } from 'prop-types';
import React, { useMemo, useReducer, useCallback, useEffect } from 'react';
import axios, { endpoints } from '@/utils/axios';
import { AuthContext } from './auth-context';
import { Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


interface StateType {
    user: any;
    loading: boolean;
    signup_state: any;
}

interface UserType {
    _id: string;
    email: string;
    first_name: string;
    last_name: string;
}


type ActionType =
  | { type: 'INITIAL'; payload: { user: UserType | null; loading: boolean; signup_state: any | null } }
  | { type: 'SIGNIN'; payload: { user: UserType } }
  | { type: 'SIGNOUT' }
  | { type: 'START_LOADING'; payload: { loading: boolean} }
  | { type: 'STOP_LOADING'; payload: { loading: boolean} }
  | { type: 'SIGN_UP'; payload: { signup_state: any} }
  

const initialState: StateType = {
    user: null,
    loading: false,
    signup_state:null,
};

const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'INITIAL':
            return {
                loading: false,
                user: action.payload.user,
                signup_state: action.payload.signup_state
            };
        case 'SIGNIN':
                return {
                    ...state,
                    user: action.payload.user,
                };
        case 'START_LOADING':
                return {
                    ...state,
                    loading: true,
                };
        case 'STOP_LOADING':
                return {
                    ...state,
                    loading: false,
                };
        case 'SIGN_UP':
            return {
                ...state,
                signup_state: action.payload.signup_state,
            };
        
        default:
            return state;
    }
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = useCallback(async () => {

        dispatch({
            type:'START_LOADING',
            payload:{
                loading:true
            }
        })
        try {

            // const user = await AsyncStorage.getItem('user');
            const user = null

            if (user !== null) {
                const jsonValueUser = JSON.parse(user)
                dispatch({
                    type: 'INITIAL',
                    payload: {
                        user:{
                            ...jsonValueUser
                        },
                        loading: false,
                        signup_state:null
                    },
                });
            }
            else{
                dispatch({
                    type: 'INITIAL',
                    payload: {
                        user:null,
                        loading: false,
                        signup_state:null
                    },
                });
            }
            
        } catch (error) {
            dispatch({
                type: 'INITIAL',
                payload: {
                    user:null,
                    loading: false,
                    signup_state:null
                },
            });
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const sign_in = async (email: string, password: string) => {
        try {
            const response = await axios.get(`${endpoints.auth.sign_in}/${email}?password=${password}`);

            if (response.data.success) {
            

                const jsonValue = JSON.stringify(response.data.user);
                // await AsyncStorage.setItem('user', jsonValue);

                dispatch({
                    type: 'SIGNIN',
                    payload: { 
                        user:{
                            ...response.data.user
                        }
                     },
                });
            }
        } catch (error) {
            Toast.show({type:'error',text1:'Login failed. Please try again.',position:'bottom', swipeable:true})
        }
    };

    const sign_up = useCallback(async (userObject: any) => {

        try{
            
            const response = await axios.post(endpoints.auth.sign_in, userObject);

            console.log('===================response=================');
            console.log(response);
            console.log('====================================');
            
            dispatch({
                type: 'SIGN_UP',
                payload: {
                    signup_state: response.data.data
                },
            });
        }catch(error){
            console.log('==============error455======================');
            console.log(error);
            console.log('====================================');
            Toast.show({type:'error',text1:'Sign Up failed. Please try again.',position:'bottom', swipeable:true})
        }
    
    }, []);

    const sign_out = () => {
        dispatch({ type: 'SIGNOUT' });
    };
 

    const memoizedValue = useMemo(
        () => ({
            user: state.user,
            loading: state.loading,
            signup_state: state.signup_state,
            //
            sign_in,
            sign_out,
            sign_up,
            
        }),
        [
            state, 
            sign_in, 
            sign_out,
            sign_up,
        ]
    );

    return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
    children: PropTypes.node,
};
