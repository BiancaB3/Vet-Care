import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    itens: []
}

const carrinhoSlice = createSlice({
        name:'carrinho',
        initialState,
        reducers:{
            addCarrinho : (state, action: PayloadAction<{item: string}>) => {

            

            },
            removeCarrinho : (state, action: PayloadAction<{item: string}>) => {

                
            }
        }
    });

    export const { addCarrinho, removeCarrinho } = carrinhoSlice.actions;
    export default carrinhoSlice.reducer;