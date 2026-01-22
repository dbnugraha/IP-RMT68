import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import businessReducer from "./businessSlice";
import productReducer from "./productSlice";
import transactionReducer from "./transactionSlice";
import aiInsightReducer from "./aiInsightSlice";
import analyticsReducer from "./analyticsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    business: businessReducer,
    product: productReducer,
    transaction: transactionReducer,
    aiInsight: aiInsightReducer,
    analytics: analyticsReducer,
  },
});

export default store;
