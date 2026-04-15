import { Link } from "react-router";
import * as Styled from "./styles";

export default function LtiLanding() {
  return (
    <Styled.Landing>
      <h1>Add Manifold Links</h1>
      <form action="/lti/search" method="get" role="search">
        <Styled.SearchInput
          type="search"
          name="keyword"
          placeholder="Search…"
          aria-label="Search"
        />
        <button type="submit">Search</button>
      </form>
      <Styled.BrowseButtons>
        <Link to="/lti/projects">Browse Projects</Link>
        <Link to="/lti/texts">Browse Texts</Link>
      </Styled.BrowseButtons>
    </Styled.Landing>
  );
}
