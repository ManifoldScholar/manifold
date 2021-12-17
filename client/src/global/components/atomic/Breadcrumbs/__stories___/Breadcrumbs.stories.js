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
  .add("Single", () => {
    return <Breadcrumbs breadcrumbs={single} />;
  })
  .add("Multiple", () => {
    return <Breadcrumbs breadcrumbs={crumbs} />;
  });
