import { useNavigate } from "react-router";
import Button from "components/global/atomic/Button";
import * as Styled from "./styles";

export default function LtiLanding() {
  const navigate = useNavigate();

  return (
    <Styled.Landing>
      <h1>Add Manifold Links</h1>
      <form action="/lti/search" method="get" role="search">
        <Styled.SearchInput
          type="search"
          name="keyword"
          placeholder="Search projects and texts..."
          aria-label="Search"
        />
        <Button
          type="submit"
          size="md"
          background="accent"
          label="Search"
          preIcon="search16"
        />
      </form>
      <Styled.BrowseButtons>
        <Button
          type="button"
          size="md"
          background="outline"
          label="Browse Projects"
          onClick={() => navigate("/lti/projects")}
        />
        <Button
          type="button"
          size="md"
          background="outline"
          label="Browse Texts"
          onClick={() => navigate("/lti/texts")}
        />
      </Styled.BrowseButtons>
    </Styled.Landing>
  );
}
