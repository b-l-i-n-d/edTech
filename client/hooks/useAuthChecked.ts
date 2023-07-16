import { useEffect, useState } from "react";
import { selectTokens, selectUser } from "../redux/features/auth/authSelector";
import { userLoggedIn } from "../redux/features/auth/authSlice";
import useAppDispatch from "./useAppDispatch";
import useAppSelector from "./useAppSelector";

// This hook is used to make sure all the data is loaded before rendering the app
const useAuthChecked = (): boolean => {
    const dispatch = useAppDispatch();
    const [authChecked, setAuthChecked] = useState(false);
    const tokens = useAppSelector(selectTokens);
    const user = useAppSelector(selectUser);

    useEffect(() => {
        if (tokens && user) {
            dispatch(
                userLoggedIn({
                    tokens: tokens,
                    user: user,
                })
            );
        }
        setAuthChecked(true);
    }, [dispatch, setAuthChecked, tokens, user]);

    return authChecked;
};

export default useAuthChecked;
