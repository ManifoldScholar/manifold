import React from "react";
import { storiesOf } from "helpers/storybook/exports";
import Breadcrumbs from "..";

const single = [{ to: "/home", label: "Breadcrumb" }];
const crumbs = [
  { to: "/home", label: "Breadcrumb" },
  { to: "/home", label: "Breadcrumb" },
  { to: "/home", label: "Breadcrumb" }
];

storiesOf("Global/Breadcrumbs", module)
  .add("Frontend Single", () => {
    return (
      <div className="bg-neutral05">
        <Breadcrumbs breadcrumbs={single} />
      </div>
    );
  })
  .add("Frontend Multiple", () => {
    return (
      <div className="bg-neutral05">
        <Breadcrumbs breadcrumbs={crumbs} />
      </div>
    );
  })
  .add("Backend", () => {
    return (
      <div className="bg-neutral90" style={{ padding: "20px" }}>
        <Breadcrumbs breadcrumbs={single} backend />
      </div>
    );
  });
