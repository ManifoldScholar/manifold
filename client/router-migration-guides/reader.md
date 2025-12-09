# Reader Migration Review

Here's my review of the remaining work in `/reader`:

## Already Done ✅

- All containers migrated to functional components with hooks
- Router v5 compat imports fixed
- Key components like Header, Toc, Section.Text, AppearanceMenuBody fetch their own data

## Remaining Class Components (26 total)

### Not Migrating (as agreed)

- `Annotatable/*` (4 files) - Complex, uses v5 router props passed from Section.Text

### Quick Wins - Simple PureComponents that could be functional

- `components/layout/PreHeader.js` - Very simple, just renders JSX
- `components/layout/PostFooter.js` - Very simple
- `components/section/Label.js` - Simple prop-based render
- `components/TextMeta/index.js` - Simple prop-based render
- `components/control-menu/Button.js` - Simple button component

### Medium Effort - Need withTranslation → useTranslation

- `components/notes/FilteredList.js` - Uses withTranslation, many getters
- `components/control-menu/VisibilityMenuBody.js` - Uses withTranslation
- `components/section/Pagination.js` - Uses withTranslation
- `components/section/NextSection.js` - Uses withTranslation
- `components/notes/partial/Filters.js` - Uses withTranslation

### Lower Priority - Deep in Render Tree

- Body node components (Text, Link, Default, Iframe, etc.)
- Annotation share components
- Notes partial components

## Recommendations

- **Quick wins first** - PreHeader, PostFooter, Label, TextMeta could be 5-minute conversions
- **FilteredList** - You have this open; it's a good candidate since ReaderDrawer uses it
- **Leave body nodes** - They're working fine and deep in the render tree
