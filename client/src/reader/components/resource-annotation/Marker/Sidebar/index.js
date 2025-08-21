import { useContext } from "react";
import { useFromStore } from "hooks";
import { ResourceMarkerContext } from "../context";
import Thumbnail from "../Thumbnail";
import * as Styled from "./styles";

export default function Sidebar({
  id,
  left,
  handleClick,
  setActiveAnnotation
}) {
  const activeAnnotation = useFromStore(
    `ui.transitory.reader.activeAnnotation`
  );

  const { groups } = useContext(ResourceMarkerContext) ?? {};

  const group = groups ? Object.values(groups).find(g => g.includes(id)) : null;

  const rendersGroup = group ? group.indexOf(id) === 0 : false;

  return (
    <>
      <Styled.Sidebar $left={left} $hidden={!!group}>
        <Thumbnail
          id={id}
          hidden={!!group}
          active={id === activeAnnotation}
          onMouseEnter={() => setActiveAnnotation(id)}
          onMouseLeave={() => setActiveAnnotation(null)}
          handleClick={handleClick}
          setsPosition
        />
      </Styled.Sidebar>
      {rendersGroup && (
        <>
          <Styled.Sidebar $left={left}>
            <Styled.Group $count={group.length}>
              {group.map(notationId => (
                <Thumbnail
                  key={notationId}
                  id={notationId}
                  active={notationId === activeAnnotation}
                  onMouseEnter={() => setActiveAnnotation(notationId)}
                  onMouseLeave={() => setActiveAnnotation(null)}
                  handleClick={handleClick}
                />
              ))}
            </Styled.Group>
          </Styled.Sidebar>
        </>
      )}
    </>
  );
}
