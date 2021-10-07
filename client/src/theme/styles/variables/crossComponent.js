import { breakpoints } from "./media";

// Variables that aren't global but aren't specific to a single component either.
// We may be able to drop these once said components use Styled Components,
// but they're here until then.
export const eventEntity = {
  listMarginTop: "17px",
  listLayoutBreakpoint: breakpoints[65],
  rowGap: "28px",
  flexMaxWidth: "460.5px",
  minWidth: "332px",
  iconSize: {
    small: "40px",
    med: "44px",
    large: "48px"
  },
  panelBreakpoint: breakpoints[60]
};

export const headerLayout = {
  paddingVerticalMobile: "9px",
  paddingVerticalDesktop: "20px",
  menuSlideDistance: "30px"
};

export const standaloneHeaderLayout = {
  maxWidth: "1178px",
  paddingTopMobile: "24px",
  paddingTopDesktop: "45px"
};

export const tocDrawer = {
  width: "477px",
  baseInlineStartPadding: "12.579%",
  baseInlineEndPadding: "10.482%"
};

export const annotationList = {
  avatarHeight: "32px",
  avatarPlaceholderWidth: "38px",
  avatarPlaceholderMarginInlineStart: "-2px"
};

export const dialog = {
  paddingTop: "30px",
  paddingBottom: "50px"
};

export const entityFilterForm = {
  gap: "10px",
  selectMinWidth: "200px",
  searchMinWidth: "182px"
};
