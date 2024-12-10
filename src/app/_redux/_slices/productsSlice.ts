import { Product } from '@prisma/client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IProductsState {
  data: Product[];
  isLoading: boolean;
  hasError: boolean;
}

const initialState: IProductsState = {
  data: [],
  isLoading: false,
  hasError: false,
};

const options = {
  name: 'products',
  initialState,
  reducers: {
    setProductsAction: (state, action: PayloadAction<Product>) => {
      state.data = action.payload;
    },
    editProductAction: (state, action: PayloadAction<Product>) => {
      state.data = state.data.map((product) => (product.id === action.payload.id ? action.payload : product));
    },
    deleteProductAction: (state, action) => {
      state.data = state.data.filter((product) => product.id !== action.payload);
    },
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
};

export const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
      setProductsAction: (state, action: PayloadAction<Product>) => {
        state.data = action.payload;
      },
      editProductAction: (state, action: PayloadAction<Product>) => {
        state.data = state.data.map((product) => (product.id === action.payload.id ? action.payload : product));
      },
      deleteProductAction: (state, action) => {
        state.data = state.data.filter((product) => product.id !== action.payload);
      },
      setProductsLoading: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
      },
    },
  };);

export const selectAllProducts = (state) => state.products.data;

export const selectProductsLoading = (state) => state.products.isLoading;

export const selectProductById = (state, id) => state.products?.data?.find((ele) => ele.id == id);

export const { addNewProductAction, editProductAction, deleteProductAction } = productsSlice.actions;

export default productsSlice.reducer;
