import { blockFun } from 'utils';
import './index.css';

/** 输入框组件 */
export default function Input (props: Game.InputProps) {
    const {
        type = 'number',
        onChange = blockFun,
        value = '',
        label = '',
        id = '',
        style,
    } = props;

    return (
        <label htmlFor={id || `${value}`} className="input-lbl" style={style}>
            {label}
            <input
                id={id || `${value}`}
                type={type}
                value={value}
                onChange={onChange}
            />
        </label>
    );
}
