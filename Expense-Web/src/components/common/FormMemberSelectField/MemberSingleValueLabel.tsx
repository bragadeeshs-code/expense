import Avatar from "react-avatar";
import {
  components,
  type SingleValueProps,
  type GroupBase,
} from "react-select";

function MemberSingleValue<O, IsMulti extends boolean>(
  props: SingleValueProps<O, IsMulti, GroupBase<O>>,
) {
  const { data, selectProps } = props;

  const label = selectProps.getOptionLabel
    ? selectProps.getOptionLabel(data)
    : "";

  return (
    <components.SingleValue {...props}>
      <div className="flex items-center gap-1">
        <Avatar name={label} size="16" round />
        <span className="text-xs leading-[100%] font-medium tracking-[0%] text-black">
          {label}
        </span>
      </div>
    </components.SingleValue>
  );
}

export default MemberSingleValue;
