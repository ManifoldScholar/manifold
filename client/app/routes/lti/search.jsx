import { useSearchParams } from "react-router";
import * as Styled from "./styles";

export const handle = {
  breadcrumb: () => ({ label: "Search", to: "/lti/search" })
};

export default function LtiSearch() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  return (
    <>
      <h1>Search</h1>
      {keyword ? (
        <Styled.Meta>
          Query: <strong>{keyword}</strong>
        </Styled.Meta>
      ) : (
        <Styled.Empty>Enter a keyword in the search box above.</Styled.Empty>
      )}
      <Styled.Empty>Results will appear here.</Styled.Empty>
    </>
  );
}
