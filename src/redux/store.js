import { configureStore } from "@reduxjs/toolkit";
import loadersReducer from  './loaderSlice'
import userReducer from "./userSlice";

const store = configureStore({
    reducer:{
        loaders:loadersReducer,
        users:userReducer
    }
})

export default  store 