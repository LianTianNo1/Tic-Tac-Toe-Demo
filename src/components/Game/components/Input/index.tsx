import React from 'react';
import { blockFun } from 'utils';
import './index.css';

/** 输入框组件 */
class Input extends React.Component<Game.InputProps> {
    render () {
        const {
            type = 'number',
            onChange = blockFun,
            value = '',
            label = '',
            id = '',
            style,
        } = this.props;

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
}

export default Input;
