import axios from "axios";
import {
    CREATE_CATEGORY_REQUEST,
    CREATE_CATEGORY_SUCCESS,
    CREATE_CATEGORY_FAIL,
    CREATE_CATEGORY_RESET,

    ALL_CATEGORY_REQUEST,
    ALL_CATEGORY_SUCCESS,
    ALL_CATEGORY_FAIL,

    CATEGORY_DETAILS_REQUEST,
    CATEGORY_DETAILS_SUCCESS,
    CATEGORY_DETAILS_FAIL,

    UPDATE_CATEGORY_REQUEST,
    UPDATE_CATEGORY_SUCCESS,
    UPDATE_CATEGORY_FAIL,
    UPDATE_CATEGORY_RESET,

    DELETE_CATEGORY_REQUEST,
    DELETE_CATEGORY_SUCCESS,
    DELETE_CATEGORY_RESET,
    DELETE_CATEGORY_FAIL,

    CLEAR_ERRORS
} from "../constants/categoryConstants";

export const createCategory = (categoryData) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_CATEGORY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data } = await axios.post(`/api/v1/add/category/new`, categoryData, config)
        dispatch({
            type: CREATE_CATEGORY_SUCCESS,
            payload: data
        })
    } catch (error) {
        dispatch({
            type: CREATE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
};

export const viewAllCategories = () => async (dispatch) => {
    try {
        dispatch({ type: ALL_CATEGORY_REQUEST });
        const { data } = await axios.get('/api/v1/admin/view/all/category');

        dispatch({
            type: ALL_CATEGORY_SUCCESS,
            payload: data.categories
        });
    } catch (error) {
        dispatch({
            type: ALL_CATEGORY_FAIL,
            payload: error.response.data.message
        });
    }
};

export const getCategoryDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/v1/admin/category/${id}`)

        dispatch({
            type: CATEGORY_DETAILS_SUCCESS,
            payload: data.category

        })

    } catch (error) {

        dispatch({
            type: CATEGORY_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}

export const updateCategory = (id, categoryData) => async (dispatch) => {
    try {
        dispatch({ type: UPDATE_CATEGORY_REQUEST })
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const { data } = await axios.put(`/api/v1/admin/category/${id}`, categoryData, config)
        dispatch({
            type: UPDATE_CATEGORY_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: UPDATE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

export const deleteCategory = (id) => async (dispatch) => {
    try {
        dispatch({ type: DELETE_CATEGORY_REQUEST })
        const { data } = await axios.delete(`/api/v1/admin/category/${id}`)
        dispatch({
            type: DELETE_CATEGORY_SUCCESS,
            payload: data.success
        })
    } catch (error) {
        dispatch({
            type: DELETE_CATEGORY_FAIL,
            payload: error.response.data.message
        })
    }
}

export const clearErrors = () => async dispatch => {
    dispatch({
        type: CLEAR_ERRORS
    })
}