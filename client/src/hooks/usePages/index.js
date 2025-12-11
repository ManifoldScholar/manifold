import { useContext } from "react";
import { AppContext } from "app/contexts";

export default function usePages() {
  const { pages } = useContext(AppContext);
  return pages;
}
