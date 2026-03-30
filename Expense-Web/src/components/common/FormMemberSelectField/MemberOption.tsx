import Avatar from "react-avatar";
import { components, type GroupBase, type OptionProps } from "react-select";

function MemberOption<O>(props: OptionProps<O, true, GroupBase<O>>) {
  const { label } = props;
  return (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        <Avatar name={label} size="16" round />
        <span>{label}</span>
      </div>
    </components.Option>
  );
}

export default MemberOption;
