import {
  components,
  type GroupBase,
  type MultiValueRemoveProps,
} from "react-select";
import { ASSET_PATH } from "@/helpers/constants/common";

function MemberMultiValueRemove<O>(
  props: MultiValueRemoveProps<O, true, GroupBase<O>>,
) {
  return (
    <components.MultiValueRemove {...props}>
      <img src={`${ASSET_PATH}/icons/cancel.svg`} alt="Cancel Icon" />
    </components.MultiValueRemove>
  );
}

export default MemberMultiValueRemove;
