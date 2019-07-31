import React from "react";

export default function FooterPartsColumns({ children }) {
  return (
    <div className="app-footer__columns container">
      <div className="app-footer__row">{children}</div>
    </div>
  );
}
