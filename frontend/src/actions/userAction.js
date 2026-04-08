import { LOGIN_FAIL,LOGIN_SUCCESS,LOGIN_REQUEST,REGISTER_FAIL,REGISTER_SUCCESS,REGISTER_REQUEST, LOAD_USER_FAIL,LOAD_USER_SUCCESS,LOAD_USER_REQUEST, LOGOUT_FAIL,LOGOUT_SUCCESS,
  UPDATE_PROFILE_FAIL,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_RESET,
    UPDATE_PROFILE_SUCCESS } from "../constants/userConstant";

import axios from "axios";
import baseUrl from "../baseUrl";
import { CLEAR_ERRORS } from "../constants/userConstant";
import cookie from "js-cookie";

const isProdWithoutApi =
    process.env.NODE_ENV === "production" && !process.env.REACT_APP_API_URL;

const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;

const getApiErrorMessage = (error) => {
    if (error?.code === 'ECONNABORTED') {
        return 'Request timed out. Please try again.'
    }

    if (error?.message === 'Network Error') {
        return `Unable to reach API at ${baseUrl}. Start backend server on port 5000.`
    }

    return error.response?.data?.error || error.response?.data?.message || error.message
}


export const login = (email,password) => async (dispatch) => {

    try {
        dispatch({type:LOGIN_REQUEST})

        if (isOffline) {
            dispatch({
                type:LOGIN_FAIL,
                payload: 'You are offline. Login requires an active internet connection.',
            })
            return
        }

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }

        const {data} = await axios.post(`${baseUrl}/api/v1/login`,{email,password},{...config, timeout: 8000})
      
        // set cookie
        cookie.set('token',data.token,{expires: 2})
        
      

        dispatch({
            type:LOGIN_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type:LOGIN_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}

export const register = (userData) => async (dispatch) => { 

    try {
        dispatch({type:REGISTER_REQUEST})

        if (isOffline) {
            dispatch({
                type:REGISTER_FAIL,
                payload: 'You are offline. Registration requires an active internet connection.',
            })
            return
        }

        // Don't set Content-Type header - axios will auto-set it with proper boundary for FormData
        const config = {
            withCredentials: true
        }

        const {data} = await axios.post(`${baseUrl}/api/v1/signup`,userData,{...config, timeout: 8000})

        // set cookie
        cookie.set('token',data.token,{expires: 2})

        dispatch({
            type:REGISTER_SUCCESS,
            payload: data.user
        })

    } catch (error) {
        dispatch({
            type:REGISTER_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
}


// Load user
export const loadUser = () => async (dispatch) => {

    try {

        dispatch({type:LOAD_USER_REQUEST})

        if (isOffline) {
            dispatch({
                type: LOAD_USER_FAIL,
                payload: 'You are offline. User profile cannot be loaded right now.',
            })
            return
        }

        if (isProdWithoutApi) {
            dispatch({
                type: LOAD_USER_FAIL,
                payload: 'Live backend is not configured',
            })
            return
        }

        // send cookie to backend

        const {data} = await axios.get(`${baseUrl}/api/v1/me`,{withCredentials:true, timeout: 8000})

        dispatch({
            type:LOAD_USER_SUCCESS,
            payload: data.user
        })
        

    } catch (error) {
        dispatch({
            type:LOAD_USER_FAIL,
            payload: getApiErrorMessage(error)
        })
    }
   
}


// Logout user
export const logout = () => async (dispatch) => {

    try {

        if (isOffline) {
            cookie.remove('token')
            dispatch({
                type: LOGOUT_SUCCESS,
            })
            return
        }

        if (isProdWithoutApi) {
            cookie.remove('token')
            dispatch({
                type: LOGOUT_SUCCESS,
            })
            return
        }

        await axios.get(`${baseUrl}/api/v1/logout`  
        
        ,{withCredentials:true, timeout: 8000})
        cookie.remove('token')

        dispatch({
            type:LOGOUT_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type:LOGOUT_FAIL,
            payload: getApiErrorMessage(error)
        })
    }

}


// Update profile

export const updateProfile = (userData) => async (dispatch) => {

    try {

 

        dispatch({type:UPDATE_PROFILE_REQUEST})

        if (isOffline) {
            dispatch({
                type:UPDATE_PROFILE_FAIL,
                payload: 'You are offline. Profile updates require an active internet connection.',
            })
            return
        }

            const config = {
                withCredentials: true
            }


            const {data} = await axios.put(`${baseUrl}/api/v1/me/update`, userData, {...config, timeout: 8000})

         console.log(data)

        dispatch({
            type:UPDATE_PROFILE_SUCCESS,
            payload: data.updatedUser
        })

    } catch (error) {
        dispatch({
            type:UPDATE_PROFILE_FAIL,
            payload: getApiErrorMessage(error)
        })
    }

}











export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}