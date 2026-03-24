import { configureStore } from "@reduxjs/toolkit";
import appReducer from "../app/appSlice";

export default configureStore({
  reducer: {
    app: appReducer,
  },
});
