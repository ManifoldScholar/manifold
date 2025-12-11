import { Outlet, useOutletContext } from "react-router";

export default function TextStylesLayout() {
  const text = useOutletContext();
  return <Outlet context={text} />;
}
