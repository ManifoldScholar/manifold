import { useId } from "react";
import PropTypes from "prop-types";
import Wrapper from "../Wrapper";
import Body from "./ConfirmModalBody";

export default function DialogConfirm({
  resolve,
  reject,
  heading,
  options,
  message
}) {
  const baseId = useId();
  const id = `dialog-${baseId}`;

  return (
    <Wrapper
      className="dialog-confirm"
      maxWidth={400}
      showCloseButton={false}
      closeOnOverlayClick={false}
      labelledBy={`${id}-label`}
      describedBy={`${id}-description`}
      onEsc={reject}
    >
      <Body
        heading={heading}
        message={message}
        id={id}
        resolve={resolve}
        reject={reject}
        options={options}
      />
    </Wrapper>
  );
}

DialogConfirm.displayName = "Dialog.Confirm";

DialogConfirm.propTypes = {
  resolve: PropTypes.func,
  reject: PropTypes.func.isRequired,
  heading: PropTypes.string,
  options: PropTypes.object,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
