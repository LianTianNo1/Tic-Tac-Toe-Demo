import { useRef } from 'react';

/** 是否是第一次渲染 */
function useFirstMountState (): boolean {
    const isFirst = useRef(true);

    if (isFirst.current) {
        isFirst.current = false;

        return true;
    }

    return isFirst.current;
}

export default useFirstMountState;
