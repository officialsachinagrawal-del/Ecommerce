import axios from "axios";
import { ALL_PRODUCTS_FAIL,ALL_PRODUCTS_REQUEST,ALL_PRODUCTS_SUCCESS,PRODUCT_DETAILS_FAIL,PRODUCT_DETAILS_SUCCESS,PRODUCT_DETAILS_REQUEST,CLEAR_ERRORS , NEW_REVIEW_FAIL,NEW_REVIEW_REQUEST,NEW_REVIEW_SUCCESS,NEW_REVIEW_RESET,ADMIN_PRODUCTS_FAIL,ADMIN_PRODUCTS_REQUEST,ADMIN_PRODUCTS_SUCCESS, NEW_PRODUCT_FAIL,NEW_PRODUCT_REQUEST,NEW_PRODUCT_RESET,NEW_PRODUCT_SUCCESS,DELETE_PRODUCT_FAIL,DELETE_PRODUCT_REQUEST,DELETE_PRODUCT_RESET,DELETE_PRODUCT_SUCCESS ,UPDATE_PRODUCT_FAIL,UPDATE_PRODUCT_REQUEST,UPDATE_PRODUCT_RESET,UPDATE_PRODUCT_SUCCESS} from "../constants/productConstant";
import baseUrl from "../baseUrl";
import mockProducts from "../mockProducts";

const isProdWithoutApi =
    process.env.NODE_ENV === "production" && !process.env.REACT_APP_API_URL;

export const getProducts = (keyword = "", page = 1, price = [1, 500], category = "", ratings = 0, limit = 8) => async (dispatch) => {

    try {
dispatch({type:ALL_PRODUCTS_REQUEST})

        if (isProdWithoutApi) {
            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: {
                    success: true,
                    results: mockProducts,
                    filteredProductsCount: mockProducts.length,
                    totalResults: mockProducts.length,
                    productsPerPage: mockProducts.length,
                },
            });
            return;
        }

        
     
        const { data } = await axios.get(`${baseUrl}/api/v1/products?keyword=${keyword}&page=${page}&limit=${limit}&priceMax=${price[1]}&priceMin=${price[0]}&category=${category}&ratingMin=${ratings}`, { timeout: 8000 })

   
    
    
        dispatch({
            type: ALL_PRODUCTS_SUCCESS,
            payload: data
        })
        

    } catch (error) {
        if (process.env.NODE_ENV === "production") {
            dispatch({
                type: ALL_PRODUCTS_SUCCESS,
                payload: {
                    success: true,
                    results: mockProducts,
                    filteredProductsCount: mockProducts.length,
                    totalResults: mockProducts.length,
                    productsPerPage: mockProducts.length,
                },
            });
            return;
        }

        dispatch({
            type: ALL_PRODUCTS_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })
    }
}

// Get product details
export const getProductDetails = (id) => async (dispatch) => {
    try {

        dispatch({ type: PRODUCT_DETAILS_REQUEST })

        if (isProdWithoutApi) {
            const mockProduct = mockProducts.find((product) => product._id === id) || mockProducts[0];
            dispatch({
                type: PRODUCT_DETAILS_SUCCESS,
                payload: {
                    success: true,
                    product: mockProduct,
                },
            });
            return;
        }

        const { data } = await axios.get(`${baseUrl}/api/v1/products/${id}`, { timeout: 8000 })
       
        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        if (process.env.NODE_ENV === "production") {
            const mockProduct = mockProducts.find((product) => product._id === id) || mockProducts[0];
            dispatch({
                type: PRODUCT_DETAILS_SUCCESS,
                payload: {
                    success: true,
                    product: mockProduct,
                },
            });
            return;
        }

        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })
    }
}


// New review

export const newReview = (reviewData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_REVIEW_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const { data } = await axios.put(`${baseUrl}/api/v1/review`, reviewData, {
            ...config,
            withCredentials: true
        })

        dispatch({
            type: NEW_REVIEW_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: NEW_REVIEW_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })

    }
}

// Get Admin Products
export const getAdminProducts = () => async (dispatch) => {
    try {

        dispatch({ type: ADMIN_PRODUCTS_REQUEST })

        const { data } = await axios.get(`${baseUrl}/api/v1/admin/products`,{withCredentials:true})
        console.log(data)
        dispatch({
            type: ADMIN_PRODUCTS_SUCCESS,
            payload: data.products
        })

    } catch (error) {
        dispatch({
            type: ADMIN_PRODUCTS_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })
    }
}


// New Product

export const newProduct = (productData) => async (dispatch) => {
    try {

        dispatch({ type: NEW_PRODUCT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(productData)
        const { data } = await axios.post(`${baseUrl}/api/v1/admin/product/new`, productData, {
            ...config,
            withCredentials: true
        })

        dispatch({
            type: NEW_PRODUCT_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })

    }
}


// Delete product (Admin)
export const deleteProduct = (id) => async (dispatch) => {
    try {

        dispatch({ type: DELETE_PRODUCT_REQUEST })

        const { data } = await axios.delete(`${baseUrl}/api/v1/admin/products/${id}`,{withCredentials:true})

        dispatch({
            type: DELETE_PRODUCT_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: DELETE_PRODUCT_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })

    }
}


// Update product (Admin)

export const updateProduct = (id, productData) => async (dispatch) => {
    try {

        dispatch({ type: UPDATE_PRODUCT_REQUEST })

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        console.log(productData)

        const { data } = await axios.put(`${baseUrl}/api/v1/admin/products/${id}`, productData, {
            ...config,
            withCredentials: true
        })

        dispatch({
            type: UPDATE_PRODUCT_SUCCESS,
            payload: data.message
        })

    } catch (error) {
        dispatch({
            type: UPDATE_PRODUCT_FAIL,
            payload: error.response?.data?.error || error.response?.data?.message || error.message
        })

    }
}









// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: CLEAR_ERRORS
    })
}
