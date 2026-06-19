import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const initialState = {
    itens: [] as string[]


}

const carrinhoSlice =createSlice(
    {
    name: 'carrinho',
    initialState,
    reducers :{
        addCarrinho:(state, action: PayloadAction<{item: string}>)=>{
            state.itens.push(action.payload.item);  

            
        },
         removeCarrinho: (state)=>{
            state.itens = [];
         }

    }
}

);


export const {addCarrinho, removeCarrinho} = carrinhoSlice.actions;
export default carrinhoSlice.reducer;