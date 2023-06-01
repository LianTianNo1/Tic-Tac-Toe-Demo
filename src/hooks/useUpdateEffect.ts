import { useEffect } from 'react';
import useFirstMountState  from './useFirstMountState';

/**
 * @description: Hooks useUpdateEffect 更新作用钩子
 * @demo useUpdateEffect(() => {}, _.now)
 */
const useUpdateEffect: typeof useEffect = (effect, deps) => {
    const isFirstMount = useFirstMountState(); // 是否是第一次渲染

    useEffect(() => {
        if (!isFirstMount) {
            return effect();
        }
    }, deps);
};

export default useUpdateEffect;
