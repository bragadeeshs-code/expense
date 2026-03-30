import Avatar from "react-avatar";
import {
  components,
  type MultiValueGenericProps,
  type GroupBase,
} from "react-select";

function MemberMultiValueLabel<O>(
  props: MultiValueGenericProps<O, true, GroupBase<O>>,
) {
  const { data, selectProps } = props;

  const label = selectProps.getOptionLabel
    ? selectProps.getOptionLabel(data)
    : "";

  return (
    <components.MultiValueLabel {...props}>
      <div className="flex items-center gap-1.5">
        <Avatar name={label} size="16" round />
        <span className="text-[0.625rem] leading-[100%] font-medium tracking-[0%] text-black">
          {label}
        </span>
      </div>
    </components.MultiValueLabel>
  );
}

export default MemberMultiValueLabel;
