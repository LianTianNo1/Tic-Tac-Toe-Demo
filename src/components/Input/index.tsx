import { blockFun } from "utils";

interface InputProps {
  /** input类型 */
  type: string;
  /** 值 */
  value: string | number;
  /** 标题*/
  label: string | React.ReactElement;
  /** 父类的更新历史的方法 */
  onChange: (params: any) => void;
  /** id用来label绑定input，如果不提供则使用value */
  id?: string;
}

/** 输入框组件 */
export default function Input(props: InputProps) {
  const {
    type = "number",
    onChange = blockFun,
    value = "",
    label = "",
    id = "",
  } = props;

  return (
    <label htmlFor={id || value + ""}>
      {label}
      <input
        id={id || value + ""}
        type={type}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
