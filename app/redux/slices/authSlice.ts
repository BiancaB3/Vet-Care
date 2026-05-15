import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import Cookies from "js-cookie";

const initialState = {
    usuario: "",
    token: ""

}

const authSlice =createSlice(
    {
    name: 'auth',
    initialState,
    reducers :{
        login:(state, action: PayloadAction<{usuario: string, token: string}>)=>{
            state.token = action.payload.token;
            state.usuario = action.payload.usuario;
            Cookies.set('token', action.payload.token, { expires: 7, secure: true });
            Cookies.set('usuario', action.payload.usuario, { expires: 7 });

            
        },
         logout: (state)=>{
            state.token = "";
            state.usuario = "";
         }

    }
}
);


export const {login, logout} = authSlice.actions;
export default authSlice.reducer;