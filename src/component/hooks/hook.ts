import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";


// Use instead of plain useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Use instead of plain useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
