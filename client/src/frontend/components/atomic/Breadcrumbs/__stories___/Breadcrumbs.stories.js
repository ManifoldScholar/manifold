import React from "react";
import { storiesOf } from "helpers/storybook/exports";
import Breadcrumbs from "..";

const single = [{ to: "/home", label: "Breadcrumb" }];
const crumbs = [
  { to: "/home", label: "Breadcrumb" },
  { to: "/home", label: "Breadcrumb" },
  { to: "/home", label: "Breadcrumb" }
];

storiesOf("Frontend/Breadcrumbs", module)
  .add("Default", () => {
    return <Breadcrumbs breadcrumbs={single} />;
  })
  .add("Secondary", () => {
    return <Breadcrumbs breadcrumbs={single} secondary />;
  })
  .add("Multiple", () => {
    return <Breadcrumbs breadcrumbs={crumbs} />;
  });
