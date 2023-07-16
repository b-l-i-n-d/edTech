import { TypedUseSelectorHook, useSelector } from "react-redux";
import type { AppState } from "../redux/store";

const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default useAppSelector;
