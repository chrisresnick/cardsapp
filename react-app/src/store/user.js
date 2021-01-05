const SET_USER = "user/setUser"
const DELETE_USER = "user/deleteUser"

export const setUser = (user) => {
    return {
        type: SET_USER,
        payload: user
    }
}

export const deleteUser = () => {
    return {
        type: DELETE_USER,
        payload: {}
    }
}

const defaultState = {user:{}};

const userReducer = (state=defaultState, action) => {
    let newState
    switch(action.type){
        case SET_USER:
            newState = {...state}
            console.log(action.payload)
            newState.user = action.payload;
            return newState;
        case DELETE_USER:
            newState = {...state}
            newState.user = {}
            return newState
        default:
            return state
    }
}

export default userReducer
