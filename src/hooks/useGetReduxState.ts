import store from 'store';
import { useSelector, useDispatch } from 'react-redux';

// type Selector<S, U> = (state: S) => U;
// type Actions<U, O> = (param: U) => O;

/** 获取redux最新值 */
export default function useGetReduxState<T> (
    selector: any,
    actions: any
) {
    const state: T = useSelector(selector);
    const dispatch = useDispatch();

    /** 获取最新的值 */
    const getState = () => {
        const currentState = store.getState();
        return selector(currentState);
    };

    /** 派发值 */
    const setState = (newValue: T) => {
        dispatch(actions(newValue));
    };

    return [state, setState, getState];
}

// 使用自定义的钩子函数获取 history 状态
// const [history, setHistory, getHistory] = useGetReduxState((state) => state.history);
