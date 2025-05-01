import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import Wrapper from "../Wrapper";
import Generate from "./Generate";
import Menu from "./Menu";

export default function ResetPasswordBase({ resolve, reject, user }) {
  const dispatch = useDispatch();

  const [confirm, setConfirm] = useState(false);

  const handleRejectClick = useCallback(
    (event) => {
      if (reject) {
        event.preventDefault();
        reject();
      }
    },
    [reject],
  );

  const handleKeyPress = useCallback(
    (event) => {
      event.preventDefault();
      if (event.keyCode === 27) return handleRejectClick(event);
    },
    [handleRejectClick],
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyPress);
    return () => {
      window.removeEventListener("keyup", handleKeyPress);
    };
  }, [dispatch, handleKeyPress]);

  return (
    <Wrapper
      className="dialog-reset"
      maxWidth={400}
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      {confirm ? (
        <Generate user={user} setConfirm={setConfirm} resolve={resolve} />
      ) : (
        <Menu
          user={user}
          resolve={resolve}
          reject={reject}
          setConfirm={setConfirm}
        />
      )}
    </Wrapper>
  );
}

ResetPasswordBase.displayName = "Dialog.ResetPassword";

ResetPasswordBase.propTypes = {
  resolve: PropTypes.func.isRequired,
  reject: PropTypes.func.isRequired,
  user: PropTypes.object,
};
