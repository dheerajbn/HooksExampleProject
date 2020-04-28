import { useReducer, useCallback } from "react";

const httpReducer = (state, action) => {
    switch (action.type) {
        case "SEND":
            return { ...state, loading: true, error: null, data: null, extras: null };
        case "SUCCESS":
            return { ...state, loading: false, error: null, data: action.payload.data, extras: action.payload.extras };
        case 'FAILED':
            return { ...state, loading: false, error: action.payload.errorMsg, extras: null };
        case 'CLEAR':
            return { ...state, error: null };
        default:
            throw new Error('Should not be reacged');
    }
}

const useHttp = () => {
    const [http, dispatchHttp] = useReducer(httpReducer, { loading: false, error: null, data: null, extras: null });

    const sendRequest = useCallback((url, method, body, extras) => {
        dispatchHttp({ type: 'SEND' });

        fetch('https://my-react-hooks-example.firebaseio.com' + url, { method: method, body: body }).then(res => res.json()).then(data => {
            dispatchHttp({ type: "SUCCESS", payload: { data: data, extras: extras } });
        }).catch(err => {
            dispatchHttp({ type: "FAILED", payload: { errorMsg: err.message } });
        })

    }, []);

    const clearHttpError = useCallback(() => {
        dispatchHttp({ type: 'CLEAR' });
    }, []);

    return {
        isLoading: http.loading,
        error: http.error,
        data: http.data,
        sendRequest: sendRequest,
        clearHttpError: clearHttpError,
        extras: http.extras,
    }

}

export default useHttp;