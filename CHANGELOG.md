# Changelog

## Unreleased - TBD

### Features

-  Refactor client search to use store [#1741](https://github.com/ManifoldScholar/manifold/pull/1741) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Address OAuth regression [#1742](https://github.com/ManifoldScholar/manifold/pull/1742) ([zdavis](https://api.github.com/users/zdavis))
-  Hide tweet fetching if not configured [#1739](https://github.com/ManifoldScholar/manifold/pull/1739) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Include env domain in webpack dev hosts [#1737](https://github.com/ManifoldScholar/manifold/pull/1737) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Don’t touch new projects on event creation [#1735](https://github.com/ManifoldScholar/manifold/pull/1735) ([zdavis](https://api.github.com/users/zdavis))
-  Exclude retweets in twitter fetch [#1732](https://github.com/ManifoldScholar/manifold/pull/1732) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement flagging on annotations [#1731](https://github.com/ManifoldScholar/manifold/pull/1731) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix frontend header menu positions [#1730](https://github.com/ManifoldScholar/manifold/pull/1730) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix FF dropdown option styles [#1711](https://github.com/ManifoldScholar/manifold/pull/1711) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve upload file name previews [#1710](https://github.com/ManifoldScholar/manifold/pull/1710) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix error boundary lifecycle usages [#1706](https://github.com/ManifoldScholar/manifold/pull/1706) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Display base model errors in FormContainer [#1678](https://github.com/ManifoldScholar/manifold/pull/1678) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve unauthenticated authorization [#1675](https://github.com/ManifoldScholar/manifold/pull/1675) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Security

-  Address CVE-2018-16476 in Active Job [#1715](https://github.com/ManifoldScholar/manifold/pull/1715) ([zdavis](https://api.github.com/users/zdavis))

## [v2.1.1](https://github.com/ManifoldScholar/manifold/tree/v2.1.1) - 12/05/18

### Features

-  Improve ProjectCollection smart sorting [#1677](https://github.com/ManifoldScholar/manifold/pull/1677) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Fix audio resource mime type validations [#1701](https://github.com/ManifoldScholar/manifold/pull/1701) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix Project#resource_tags returning relationship [#1702](https://github.com/ManifoldScholar/manifold/pull/1702) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Sort users by name in permissions form [#1703](https://github.com/ManifoldScholar/manifold/pull/1703) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Return nil when style value is empty [#1700](https://github.com/ManifoldScholar/manifold/pull/1700) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Proxy IS attachments through API controller [#1698](https://github.com/ManifoldScholar/manifold/pull/1698) ([zdavis](https://api.github.com/users/zdavis))
-  Global search consults metadata fields [#1691](https://github.com/ManifoldScholar/manifold/pull/1691) ([zdavis](https://api.github.com/users/zdavis))

## [v2.1.0](https://github.com/ManifoldScholar/manifold/tree/v2.1.0) - 11/21/18

### Bugs

-  Improve ingestion file rejection criteria [#1685](https://github.com/ManifoldScholar/manifold/pull/1685) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix duped media filenames in manifest doc ingestions [#1681](https://github.com/ManifoldScholar/manifold/pull/1681) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix regression in Permission creation [#1676](https://github.com/ManifoldScholar/manifold/pull/1676) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix model creation with associations [#1672](https://github.com/ManifoldScholar/manifold/pull/1672) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fixes to 2.1 release issues [#1666](https://github.com/ManifoldScholar/manifold/pull/1666) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.1.0-rc.1](https://github.com/ManifoldScholar/manifold/tree/v2.1.0-rc.1) - 11/15/18

### Features

-  Format stylesheet raw_styles before saving [#1629](https://github.com/ManifoldScholar/manifold/pull/1629) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow sign up link to be disabled per feature [#1654](https://github.com/ManifoldScholar/manifold/pull/1654) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Scope reingestion websocket error to global [#1663](https://github.com/ManifoldScholar/manifold/pull/1663) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix project activity route nesting [#1665](https://github.com/ManifoldScholar/manifold/pull/1665) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Handle penging migration errors in client [#1662](https://github.com/ManifoldScholar/manifold/pull/1662) ([zdavis](https://api.github.com/users/zdavis))
-  Fix reingestion failing on cover source report [#1657](https://github.com/ManifoldScholar/manifold/pull/1657) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix drive resource checksum generation [#1655](https://github.com/ManifoldScholar/manifold/pull/1655) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve Maker name parsing and ordering [#1644](https://github.com/ManifoldScholar/manifold/pull/1644) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow markdown in footer copyright text [#1653](https://github.com/ManifoldScholar/manifold/pull/1653) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.1.0-beta.3](https://github.com/ManifoldScholar/manifold/tree/v2.1.0-beta.3) - 11/14/18

### Bugs

-  Improve websocket connection error handling [#1651](https://github.com/ManifoldScholar/manifold/pull/1651) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.1.0-beta.2](https://github.com/ManifoldScholar/manifold/tree/v2.1.0-beta.2) - 11/14/18

### Features

-  Allow favicon to be set per installation [#1625](https://github.com/ManifoldScholar/manifold/pull/1625) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  PaperclipMigrator supports versionless uploaders [#1650](https://github.com/ManifoldScholar/manifold/pull/1650) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Correct section-category-label z-index [#1649](https://github.com/ManifoldScholar/manifold/pull/1649) ([zdavis](https://api.github.com/users/zdavis))
-  Remove hard-coded copyright symbol from footer [#1648](https://github.com/ManifoldScholar/manifold/pull/1648) ([zdavis](https://api.github.com/users/zdavis))

## [v2.1.0-beta.1](https://github.com/ManifoldScholar/manifold/tree/v2.1.0-beta.1) - 11/13/18

### Features

-  Use PredictiveInput on TagList component [#1626](https://github.com/ManifoldScholar/manifold/pull/1626) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Migrate Paperclip to Shrine for attachments [#1524](https://github.com/ManifoldScholar/manifold/pull/1524) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement message for empty project collections [#1534](https://github.com/ManifoldScholar/manifold/pull/1534) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Projects can be grouped into collections [#1231](https://github.com/ManifoldScholar/manifold/pull/1231) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add text section management to stylesheet edit [#1423](https://github.com/ManifoldScholar/manifold/pull/1423) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Include pagination meta and links on included collections [#1434](https://github.com/ManifoldScholar/manifold/pull/1434) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Create List.Orderable component [#1432](https://github.com/ManifoldScholar/manifold/pull/1432) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Refactor Follow into CoverButton component [#1422](https://github.com/ManifoldScholar/manifold/pull/1422) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Merge v2.0 logo improvements [#1419](https://github.com/ManifoldScholar/manifold/pull/1419) ([zdavis](https://api.github.com/users/zdavis))
-  Expose concept of “slots” in child routes [#1400](https://github.com/ManifoldScholar/manifold/pull/1400) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Text sections without names are valid [#1645](https://github.com/ManifoldScholar/manifold/pull/1645) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Flatten existing IngestionSource attachments [#1647](https://github.com/ManifoldScholar/manifold/pull/1647) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve ingestion error reporting [#1624](https://github.com/ManifoldScholar/manifold/pull/1624) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Adjust AttachmentUploader storage paths/cache [#1630](https://github.com/ManifoldScholar/manifold/pull/1630) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve ingestion source path handling [#1620](https://github.com/ManifoldScholar/manifold/pull/1620) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Assign header IDs to all converted docs [#1614](https://github.com/ManifoldScholar/manifold/pull/1614) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  FE projects container respects query filters [#1617](https://github.com/ManifoldScholar/manifold/pull/1617) ([zdavis](https://api.github.com/users/zdavis))
-  Prevent unnecessary home container data fetch [#1615](https://github.com/ManifoldScholar/manifold/pull/1615) ([zdavis](https://api.github.com/users/zdavis))
-  Fix reader sign in menu alignment [#1612](https://github.com/ManifoldScholar/manifold/pull/1612) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Validate slug uniqueness [#1610](https://github.com/ManifoldScholar/manifold/pull/1610) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix migations using attachment columns [#1609](https://github.com/ManifoldScholar/manifold/pull/1609) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Validate ProjectCollection#number_of_projects [#1604](https://github.com/ManifoldScholar/manifold/pull/1604) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Exclude wrap from formatted PC descriptions [#1601](https://github.com/ManifoldScholar/manifold/pull/1601) ([zdavis](https://api.github.com/users/zdavis))
-  Use formatted project collection descriptions [#1594](https://github.com/ManifoldScholar/manifold/pull/1594) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Focus on input in project collection drawer [#1595](https://github.com/ManifoldScholar/manifold/pull/1595) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow project collection slugs to be edited [#1592](https://github.com/ManifoldScholar/manifold/pull/1592) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Correct some longstanding routing issues [#1584](https://github.com/ManifoldScholar/manifold/pull/1584) ([zdavis](https://api.github.com/users/zdavis))
-  Allow marketeer CRUD abilities on ProjectCollection [#1587](https://github.com/ManifoldScholar/manifold/pull/1587) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow text titles to be formatted [#1574](https://github.com/ManifoldScholar/manifold/pull/1574) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow project titles to be formatted [#1582](https://github.com/ManifoldScholar/manifold/pull/1582) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix duplicate request on projects search [#1579](https://github.com/ManifoldScholar/manifold/pull/1579) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Reload text before passing to PostProcessor [#1580](https://github.com/ManifoldScholar/manifold/pull/1580) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Don&#39;t rescue StandardError during ingestion [#1570](https://github.com/ManifoldScholar/manifold/pull/1570) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  TextNode annotation queries substring [#1572](https://github.com/ManifoldScholar/manifold/pull/1572) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix schema file [#1561](https://github.com/ManifoldScholar/manifold/pull/1561) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix Form.BelongsTo selection behavior [#1556](https://github.com/ManifoldScholar/manifold/pull/1556) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Only create unique stylesheets during ingestion [#1560](https://github.com/ManifoldScholar/manifold/pull/1560) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve homepage API requests and props [#1557](https://github.com/ManifoldScholar/manifold/pull/1557) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Miscellaneous CSS bug fixes [#1558](https://github.com/ManifoldScholar/manifold/pull/1558) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix focus appearance of close button in annotation drawer [#1550](https://github.com/ManifoldScholar/manifold/pull/1550) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Normalize appearance of search inputs [#1548](https://github.com/ManifoldScholar/manifold/pull/1548) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Link URLs in comments and annotations [#1545](https://github.com/ManifoldScholar/manifold/pull/1545) ([zdavis](https://api.github.com/users/zdavis))
-  Handle API 502 errors in client [#1542](https://github.com/ManifoldScholar/manifold/pull/1542) ([zdavis](https://api.github.com/users/zdavis))
-  Improve appearance of project cover button [#1541](https://github.com/ManifoldScholar/manifold/pull/1541) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Show project collections without projects [#1540](https://github.com/ManifoldScholar/manifold/pull/1540) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Normalize global focus appearance [#1536](https://github.com/ManifoldScholar/manifold/pull/1536) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Address regression when navigating between notes [#1537](https://github.com/ManifoldScholar/manifold/pull/1537) ([zdavis](https://api.github.com/users/zdavis))
-  Fix pagination class in backend Project Collections [#1535](https://github.com/ManifoldScholar/manifold/pull/1535) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Address active state matching in mobile nav [#1533](https://github.com/ManifoldScholar/manifold/pull/1533) ([zdavis](https://api.github.com/users/zdavis))
-  Maintain scroll pos in reader resource overlay [#1531](https://github.com/ManifoldScholar/manifold/pull/1531) ([zdavis](https://api.github.com/users/zdavis))
-  Fix button layout in reader resource modal [#1532](https://github.com/ManifoldScholar/manifold/pull/1532) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Adjust padding on Project Collection header [#1530](https://github.com/ManifoldScholar/manifold/pull/1530) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Clean related editor session on model  deletion [#1528](https://github.com/ManifoldScholar/manifold/pull/1528) ([zdavis](https://api.github.com/users/zdavis))
-  Fix document ingestion TOC nesting [#1527](https://github.com/ManifoldScholar/manifold/pull/1527) ([zdavis](https://api.github.com/users/zdavis))
-  Accept UTF8 chars in ingestion source styles [#1526](https://github.com/ManifoldScholar/manifold/pull/1526) ([zdavis](https://api.github.com/users/zdavis))
-  Consistently position form input instructions [#1525](https://github.com/ManifoldScholar/manifold/pull/1525) ([zdavis](https://api.github.com/users/zdavis))
-  HasMany reports attributes errors [#1502](https://github.com/ManifoldScholar/manifold/pull/1502) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Extract media assets during Word ingestions [#1509](https://github.com/ManifoldScholar/manifold/pull/1509) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix resource show not returning project [#1514](https://github.com/ManifoldScholar/manifold/pull/1514) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove remaining Resource.Icon usages [#1511](https://github.com/ManifoldScholar/manifold/pull/1511) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix overflow bug in IE 11 with tile-style list items [#1501](https://github.com/ManifoldScholar/manifold/pull/1501) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix leading of entity count in backend header [#1500](https://github.com/ManifoldScholar/manifold/pull/1500) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix alignment of dropzone form content in IE11 [#1499](https://github.com/ManifoldScholar/manifold/pull/1499) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Replace remaining .backend-panel usages with component [#1492](https://github.com/ManifoldScholar/manifold/pull/1492) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix secondary header link styles [#1484](https://github.com/ManifoldScholar/manifold/pull/1484) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Handle itemProp attribute in reader [#1486](https://github.com/ManifoldScholar/manifold/pull/1486) ([zdavis](https://api.github.com/users/zdavis))
-  Catch and ignore URI.parse errors in reader [#1483](https://github.com/ManifoldScholar/manifold/pull/1483) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Derelativize stylesheet paths when determining source file [#1482](https://github.com/ManifoldScholar/manifold/pull/1482) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Reader notes button should authorize visibility on mobile [#1480](https://github.com/ManifoldScholar/manifold/pull/1480) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  HasMany should not require entities prop [#1478](https://github.com/ManifoldScholar/manifold/pull/1478) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve eager loading in show actions [#1465](https://github.com/ManifoldScholar/manifold/pull/1465) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Override button focus state border for toggles [#1460](https://github.com/ManifoldScholar/manifold/pull/1460) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Handle HTML entities when mapping text section paths to sources [#1469](https://github.com/ManifoldScholar/manifold/pull/1469) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix records/features nav link permissions [#1470](https://github.com/ManifoldScholar/manifold/pull/1470) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Catch invalid hex exception in SS validator [#1467](https://github.com/ManifoldScholar/manifold/pull/1467) ([zdavis](https://api.github.com/users/zdavis))
-  Open all external reader URLs in a new tab [#1462](https://github.com/ManifoldScholar/manifold/pull/1462) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Don&#39;t italicize &lt;em&gt; tags in project hero subtitle [#1427](https://github.com/ManifoldScholar/manifold/pull/1427) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix purchase price being reset on project update [#1425](https://github.com/ManifoldScholar/manifold/pull/1425) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Broaden acceptable extensions for resource attachments [#1383](https://github.com/ManifoldScholar/manifold/pull/1383) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.0.7](https://github.com/ManifoldScholar/manifold/tree/v2.0.7) - 11/02/18

### Bugs

-  Add charset to head meta content [#1606](https://github.com/ManifoldScholar/manifold/pull/1606) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.0.6](https://github.com/ManifoldScholar/manifold/tree/v2.0.6) - 11/02/18

### Bugs

-  Update rails-html-sanitizer dependencies [#1590](https://github.com/ManifoldScholar/manifold/pull/1590) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.0.5](https://github.com/ManifoldScholar/manifold/tree/v2.0.5) - 11/01/18

### Features

-  HasMany refactor and text/stylesheet management [#1586](https://github.com/ManifoldScholar/manifold/pull/1586) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Reload text before passing to PostProcessor [#1585](https://github.com/ManifoldScholar/manifold/pull/1585) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve open graph meta tags [#1552](https://github.com/ManifoldScholar/manifold/pull/1552) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  User ErrorSerializer on invalid objects [#1553](https://github.com/ManifoldScholar/manifold/pull/1553) ([zdavis](https://api.github.com/users/zdavis))
-  Link URLs in comments and annotations [#1549](https://github.com/ManifoldScholar/manifold/pull/1549) ([zdavis](https://api.github.com/users/zdavis))
-  Extract media assets during Word ingestions [#1523](https://github.com/ManifoldScholar/manifold/pull/1523) ([zdavis](https://api.github.com/users/zdavis))
-  Catch and ignore URI.parse errors in reader [#1495](https://github.com/ManifoldScholar/manifold/pull/1495) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix purchase price being reset on project update [#1488](https://github.com/ManifoldScholar/manifold/pull/1488) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.0.4](https://github.com/ManifoldScholar/manifold/tree/v2.0.4) - 10/08/18

### Bugs

-  Refactor serializer naming and usage [#1449](https://github.com/ManifoldScholar/manifold/pull/1449) ([SMaxOwok](https://api.github.com/users/SMaxOwok))


## [v2.0.2](https://github.com/ManifoldScholar/manifold/tree/v2.0.2) - 09/20/18

### Bugs

-  Fix home page pagination arrow styles [#1407](https://github.com/ManifoldScholar/manifold/pull/1407) ([zdavis](https://api.github.com/users/zdavis))
-  Users who can notate to remove other notations [#1406](https://github.com/ManifoldScholar/manifold/pull/1406) ([zdavis](https://api.github.com/users/zdavis))
-  Fix text section/stylesheet relationship behavior [#1395](https://github.com/ManifoldScholar/manifold/pull/1395) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Wrap ingestion compilation in a AR transaction [#1396](https://github.com/ManifoldScholar/manifold/pull/1396) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.0.1](https://github.com/ManifoldScholar/manifold/tree/v2.0.1) - 09/17/18

### Bugs

-  Handle header ID insertion during conversion [#1392](https://github.com/ManifoldScholar/manifold/pull/1392) ([zdavis](https://api.github.com/users/zdavis))
-  Correct document TOC generation [#1389](https://github.com/ManifoldScholar/manifold/pull/1389) ([zdavis](https://api.github.com/users/zdavis))

## [v2.0.0](https://github.com/ManifoldScholar/manifold/tree/v2.0.0) - 09/13/18

### Bugs

-  API sets client URL from CLIENT_URL or DOMAIN [#1382](https://github.com/ManifoldScholar/manifold/pull/1382) ([zdavis](https://api.github.com/users/zdavis))
-  Add new project button to backend project list [#1379](https://github.com/ManifoldScholar/manifold/pull/1379) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Specify model attributes in search query [#1380](https://github.com/ManifoldScholar/manifold/pull/1380) ([zdavis](https://api.github.com/users/zdavis))
-  Fix project avatar color picker styles [#1375](https://github.com/ManifoldScholar/manifold/pull/1375) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.0.0-rc.3](https://github.com/ManifoldScholar/manifold/tree/v2.0.0-rc.3) - 09/12/18

### Bugs

-  Fix special characters breaking during ingestion [#1372](https://github.com/ManifoldScholar/manifold/pull/1372) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Minor v2.0.0-rc.2 fixes [#1367](https://github.com/ManifoldScholar/manifold/pull/1367) ([zdavis](https://api.github.com/users/zdavis))

## [v2.0.0-rc.2](https://github.com/ManifoldScholar/manifold/tree/v2.0.0-rc.2) - 09/06/18

### Bugs

-  Minor fixes for 2.0.0-rc.2 [#1357](https://github.com/ManifoldScholar/manifold/pull/1357) ([zdavis](https://api.github.com/users/zdavis))

## [v2.0.0-rc.1](https://github.com/ManifoldScholar/manifold/tree/v2.0.0-rc.1) - 08/29/18

### Features

-  Implement notification preferences on Users [#1353](https://github.com/ManifoldScholar/manifold/pull/1353) ([zdavis](https://api.github.com/users/zdavis))
-  Add text download options to projects [#1327](https://github.com/ManifoldScholar/manifold/pull/1327) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement Form.Header component [#1343](https://github.com/ManifoldScholar/manifold/pull/1343) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Update Backend UI design for 2.0 [#1315](https://github.com/ManifoldScholar/manifold/pull/1315) ([zdavis](https://api.github.com/users/zdavis))
-  Add support for larger ingestions via tus.io [#1264](https://github.com/ManifoldScholar/manifold/pull/1264) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Update user nav trigger focus state styles [#1284](https://github.com/ManifoldScholar/manifold/pull/1284) ([blnkt](https://api.github.com/users/blnkt))
-  Updates drawers to always include some kind of screen reader accessible close button [#1282](https://github.com/ManifoldScholar/manifold/pull/1282) ([blnkt](https://api.github.com/users/blnkt))
-  Improve button focus and hover state styles [#1269](https://github.com/ManifoldScholar/manifold/pull/1269) ([blnkt](https://api.github.com/users/blnkt))
-  Add skip links to admin pages with sidebar nav [#1263](https://github.com/ManifoldScholar/manifold/pull/1263) ([blnkt](https://api.github.com/users/blnkt))
-  Updates elements to be accessible when tabbing through page content [#1121](https://github.com/ManifoldScholar/manifold/pull/1121) ([blnkt](https://api.github.com/users/blnkt))
-  Redirect Focus when Dialog boxes open/close [#1118](https://github.com/ManifoldScholar/manifold/pull/1118) ([blnkt](https://api.github.com/users/blnkt))
-  Add preprocessing to ingestion process before compilation [#1253](https://github.com/ManifoldScholar/manifold/pull/1253) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Redirect Focus when Drawers open/close [#1116](https://github.com/ManifoldScholar/manifold/pull/1116) ([blnkt](https://api.github.com/users/blnkt))
-  Redirect focus when UIPanels open/close [#1113](https://github.com/ManifoldScholar/manifold/pull/1113) ([blnkt](https://api.github.com/users/blnkt))
-  Add ability to import annotations [#1211](https://github.com/ManifoldScholar/manifold/pull/1211) ([zdavis](https://api.github.com/users/zdavis))
-  Adds &quot;skip to main content&quot; links for Reader, Admin Backend, and Frontend page templates [#1200](https://github.com/ManifoldScholar/manifold/pull/1200) ([blnkt](https://api.github.com/users/blnkt))
-  Add variant download list to resource detail page [#1184](https://github.com/ManifoldScholar/manifold/pull/1184) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Refactor ingestion process [#1163](https://github.com/ManifoldScholar/manifold/pull/1163) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Update follow/unfollow project interaction accessibility [#1145](https://github.com/ManifoldScholar/manifold/pull/1145) ([blnkt](https://api.github.com/users/blnkt))
-  Update slideshow accessibility [#1144](https://github.com/ManifoldScholar/manifold/pull/1144) ([blnkt](https://api.github.com/users/blnkt))
-  Updates the language of buttons and links to be function focused not gesture focused [#1143](https://github.com/ManifoldScholar/manifold/pull/1143) ([blnkt](https://api.github.com/users/blnkt))
-  Use Aria and role attributes to immediately bring errors to the attention of AT [#1137](https://github.com/ManifoldScholar/manifold/pull/1137) ([blnkt](https://api.github.com/users/blnkt))
-  All interactive elements with role=&quot;button&quot; or role=&quot;link&quot; are accessible via the tab key [#1120](https://github.com/ManifoldScholar/manifold/pull/1120) ([blnkt](https://api.github.com/users/blnkt))
-  Redirect Focus when Overlays open/close [#1115](https://github.com/ManifoldScholar/manifold/pull/1115) ([blnkt](https://api.github.com/users/blnkt))
-  Refactor Pages to use purposes for determining use [#1097](https://github.com/ManifoldScholar/manifold/pull/1097) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  All Label elements are used with associated form controls [#1100](https://github.com/ManifoldScholar/manifold/pull/1100) ([blnkt](https://api.github.com/users/blnkt))
-  Turns a functionless button in the predictive text input component into an icon [#1108](https://github.com/ManifoldScholar/manifold/pull/1108) ([blnkt](https://api.github.com/users/blnkt))
-  All checkbox and radio inputs have labels or other descriptive text [#1107](https://github.com/ManifoldScholar/manifold/pull/1107) ([blnkt](https://api.github.com/users/blnkt))
-  All range and password inputs have labels or other descriptive text [#1106](https://github.com/ManifoldScholar/manifold/pull/1106) ([blnkt](https://api.github.com/users/blnkt))
-  Text inputs and textareas should have labels or other descriptive text [#1102](https://github.com/ManifoldScholar/manifold/pull/1102) ([blnkt](https://api.github.com/users/blnkt))
-  Implement Custom OAuth 2.0 Strategies [#1099](https://github.com/ManifoldScholar/manifold/pull/1099) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Generate TOC for single-page Google Doc [#1089](https://github.com/ManifoldScholar/manifold/pull/1089) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Interactive elements should have appropriate roles [#1083](https://github.com/ManifoldScholar/manifold/pull/1083) ([blnkt](https://api.github.com/users/blnkt))
-  Implement single/multi page support for HTML ingestions [#1049](https://github.com/ManifoldScholar/manifold/pull/1049) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improvements to layout footer [#1065](https://github.com/ManifoldScholar/manifold/pull/1065) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add descriptive alt text to all image tags and elements with background images [#1060](https://github.com/ManifoldScholar/manifold/pull/1060) ([blnkt](https://api.github.com/users/blnkt))
-  Add alt text to non-text non-image elements [#1062](https://github.com/ManifoldScholar/manifold/pull/1062) ([blnkt](https://api.github.com/users/blnkt))
-  Add jsx linter to address WCAG concerns [#1057](https://github.com/ManifoldScholar/manifold/pull/1057) ([blnkt](https://api.github.com/users/blnkt))
-  Attempt to reassign annotation start/end nodes when section changes [#1038](https://github.com/ManifoldScholar/manifold/pull/1038) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement list ordering [#977](https://github.com/ManifoldScholar/manifold/pull/977) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add audio player component [#1003](https://github.com/ManifoldScholar/manifold/pull/1003) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improvements to bulk resource import [#1007](https://github.com/ManifoldScholar/manifold/pull/1007) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remember page and filter in backend project list [#1002](https://github.com/ManifoldScholar/manifold/pull/1002) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add library placeholder when no instance projects [#992](https://github.com/ManifoldScholar/manifold/pull/992) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Expose project slug in backend [#993](https://github.com/ManifoldScholar/manifold/pull/993) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Refactor resource/collection params to include page [#938](https://github.com/ManifoldScholar/manifold/pull/938) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement frontend DOI display [#934](https://github.com/ManifoldScholar/manifold/pull/934) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow links in formatted fields [#921](https://github.com/ManifoldScholar/manifold/pull/921) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Adjust frontend project grid hover styles [#1351](https://github.com/ManifoldScholar/manifold/pull/1351) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Allow blank project purchase price value [#1347](https://github.com/ManifoldScholar/manifold/pull/1347) ([zdavis](https://api.github.com/users/zdavis))
-  Fix form select visibility bug in Firefox [#1348](https://github.com/ManifoldScholar/manifold/pull/1348) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix backend form select text being cut off [#1345](https://github.com/ManifoldScholar/manifold/pull/1345) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix position of icon in text reingest button [#1339](https://github.com/ManifoldScholar/manifold/pull/1339) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix vertical list headers overflowing in IE 11 [#1336](https://github.com/ManifoldScholar/manifold/pull/1336) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Move Form.FieldGroup instructions above form inputs [#1332](https://github.com/ManifoldScholar/manifold/pull/1332) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix display of borders for active vertical list items [#1330](https://github.com/ManifoldScholar/manifold/pull/1330) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix private annotations being wrongly visible [#1164](https://github.com/ManifoldScholar/manifold/pull/1164) ([zdavis](https://api.github.com/users/zdavis))
-  Allow HEAD &lt;title&gt; to be set by installation [#1026](https://github.com/ManifoldScholar/manifold/pull/1026) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Store emails in case-insensitive column [#1032](https://github.com/ManifoldScholar/manifold/pull/1032) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix project category drawer behavior [#1323](https://github.com/ManifoldScholar/manifold/pull/1323) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix layout of backend text category headers [#1322](https://github.com/ManifoldScholar/manifold/pull/1322) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix EPUB v2 TOC tree generation [#1319](https://github.com/ManifoldScholar/manifold/pull/1319) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix api ingestion creation through CLI [#1317](https://github.com/ManifoldScholar/manifold/pull/1317) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix reader panels not opening on mobile [#1311](https://github.com/ManifoldScholar/manifold/pull/1311) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix reader visibilty panel toggle behavior [#1313](https://github.com/ManifoldScholar/manifold/pull/1313) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Address URL ingestion regression [#1308](https://github.com/ManifoldScholar/manifold/pull/1308) ([zdavis](https://api.github.com/users/zdavis))
-  Improve ingestion relative font-size conversion [#1307](https://github.com/ManifoldScholar/manifold/pull/1307) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix loop when changing resource import source file [#1305](https://github.com/ManifoldScholar/manifold/pull/1305) ([zdavis](https://api.github.com/users/zdavis))
-  Remove extraneous API call from Reader Container [#1304](https://github.com/ManifoldScholar/manifold/pull/1304) ([zdavis](https://api.github.com/users/zdavis))
-  Ingestion uploader should validate file ext instead of mime type [#1302](https://github.com/ManifoldScholar/manifold/pull/1302) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix reingestions failing to identify text [#1301](https://github.com/ManifoldScholar/manifold/pull/1301) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Content type validation flag should not be a symbol [#1296](https://github.com/ManifoldScholar/manifold/pull/1296) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Use source path to map google doc files in manifest ingestion [#1295](https://github.com/ManifoldScholar/manifold/pull/1295) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix single file manifest ingestions failing to detect source [#1290](https://github.com/ManifoldScholar/manifold/pull/1290) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Don&#39;t validate content type for ingestions [#1289](https://github.com/ManifoldScholar/manifold/pull/1289) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix inline styles missing from ingestion stylesheets [#1287](https://github.com/ManifoldScholar/manifold/pull/1287) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix what element receives focus when UIPanels close [#1281](https://github.com/ManifoldScholar/manifold/pull/1281) ([blnkt](https://api.github.com/users/blnkt))
-  Fix ToC drawer and trigger behavior [#1278](https://github.com/ManifoldScholar/manifold/pull/1278) ([blnkt](https://api.github.com/users/blnkt))
-  Correct RedirectToFirstMatch behavior [#1276](https://github.com/ManifoldScholar/manifold/pull/1276) ([zdavis](https://api.github.com/users/zdavis))
-  Blur navigation elements on route change [#1262](https://github.com/ManifoldScholar/manifold/pull/1262) ([zdavis](https://api.github.com/users/zdavis))
-  Self-close void element tags in html validator [#1270](https://github.com/ManifoldScholar/manifold/pull/1270) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix ProjectList.Grid throwing error when prevProps.projects is null [#1268](https://github.com/ManifoldScholar/manifold/pull/1268) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Use redux store to track backend project list filter state [#1267](https://github.com/ManifoldScholar/manifold/pull/1267) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Address follow interaction not properly setting state [#1261](https://github.com/ManifoldScholar/manifold/pull/1261) ([zdavis](https://api.github.com/users/zdavis))
-  Create new text on every new ingestion [#1255](https://github.com/ManifoldScholar/manifold/pull/1255) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add attachment validation by type [#1254](https://github.com/ManifoldScholar/manifold/pull/1254) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix syntax error in ie11 [#1249](https://github.com/ManifoldScholar/manifold/pull/1249) ([blnkt](https://api.github.com/users/blnkt))
-  Fix stylelint yarn task [#1251](https://github.com/ManifoldScholar/manifold/pull/1251) ([blnkt](https://api.github.com/users/blnkt))
-  Fix issue with manifest ingestion stylesheet source detection [#1236](https://github.com/ManifoldScholar/manifold/pull/1236) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve ingestion context initialization and reporting [#1237](https://github.com/ManifoldScholar/manifold/pull/1237) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove meta tags from manifest spec fixture files [#1234](https://github.com/ManifoldScholar/manifold/pull/1234) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix footer padding on mobile [#1238](https://github.com/ManifoldScholar/manifold/pull/1238) ([blnkt](https://api.github.com/users/blnkt))
-  Fix nested form button submitting on &#39;enter&#39; press [#1235](https://github.com/ManifoldScholar/manifold/pull/1235) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Always show total annotation count on text thumbnail [#1232](https://github.com/ManifoldScholar/manifold/pull/1232) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix search menu slide off transition [#1210](https://github.com/ManifoldScholar/manifold/pull/1210) ([blnkt](https://api.github.com/users/blnkt))
-  Fix latex ingestions failing due to content type [#1199](https://github.com/ManifoldScholar/manifold/pull/1199) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix the positioning and styles for the left side notation thumbnails in the reader [#1195](https://github.com/ManifoldScholar/manifold/pull/1195) ([blnkt](https://api.github.com/users/blnkt))
-  Fixes the layout of the dialog overlays in ie11 [#1196](https://github.com/ManifoldScholar/manifold/pull/1196) ([blnkt](https://api.github.com/users/blnkt))
-  Fix document ingestion text section/source identifiers [#1191](https://github.com/ManifoldScholar/manifold/pull/1191) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Update audio player styles for ie11 [#1190](https://github.com/ManifoldScholar/manifold/pull/1190) ([blnkt](https://api.github.com/users/blnkt))
-  Overlay de-focus should not trigger close [#1185](https://github.com/ManifoldScholar/manifold/pull/1185) ([zdavis](https://api.github.com/users/zdavis))
-  Implement default publisher/place behavior [#1182](https://github.com/ManifoldScholar/manifold/pull/1182) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove DOIs from collection detail views [#1181](https://github.com/ManifoldScholar/manifold/pull/1181) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix audio player height when not in slideshow [#1174](https://github.com/ManifoldScholar/manifold/pull/1174) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix reader overlay close routes [#1176](https://github.com/ManifoldScholar/manifold/pull/1176) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix error on TextInput component with numbers [#1175](https://github.com/ManifoldScholar/manifold/pull/1175) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix incorrect entity count when 0 exist [#1173](https://github.com/ManifoldScholar/manifold/pull/1173) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Close comment editor after successful post [#1170](https://github.com/ManifoldScholar/manifold/pull/1170) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove duplicate social fields from project backend [#1156](https://github.com/ManifoldScholar/manifold/pull/1156) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Stop audio playback when reader overlay closes [#1155](https://github.com/ManifoldScholar/manifold/pull/1155) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add error state to audio player [#1152](https://github.com/ManifoldScholar/manifold/pull/1152) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Require email on reset password interface [#1147](https://github.com/ManifoldScholar/manifold/pull/1147) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix private annotations being wrongly visible [#1150](https://github.com/ManifoldScholar/manifold/pull/1150) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix resource cards not using full space on project detail [#1149](https://github.com/ManifoldScholar/manifold/pull/1149) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add default paragraph margins in reader [#1157](https://github.com/ManifoldScholar/manifold/pull/1157) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve ogg file acceptance [#1153](https://github.com/ManifoldScholar/manifold/pull/1153) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix .flv files not being selectable in upload [#1154](https://github.com/ManifoldScholar/manifold/pull/1154) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix layout issues at reader table breakpoints [#1138](https://github.com/ManifoldScholar/manifold/pull/1138) ([blnkt](https://api.github.com/users/blnkt))
-  Fix resource slug validation when importing from google sheet [#1140](https://github.com/ManifoldScholar/manifold/pull/1140) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix reader side drawer resource list hoverstates [#1098](https://github.com/ManifoldScholar/manifold/pull/1098) ([blnkt](https://api.github.com/users/blnkt))
-  Fix &quot;delete feature&quot; button states [#1095](https://github.com/ManifoldScholar/manifold/pull/1095) ([blnkt](https://api.github.com/users/blnkt))
-  Style links in resource slide captions [#1096](https://github.com/ManifoldScholar/manifold/pull/1096) ([blnkt](https://api.github.com/users/blnkt))
-  Fix updater reloading model when errors were present [#1094](https://github.com/ManifoldScholar/manifold/pull/1094) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix authorization check on Page/Feature [#1093](https://github.com/ManifoldScholar/manifold/pull/1093) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix attachments being skipped on bulk resource import [#1073](https://github.com/ManifoldScholar/manifold/pull/1073) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix FormContainer session initializing with null model [#1069](https://github.com/ManifoldScholar/manifold/pull/1069) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Redirect to project texts after text destroy [#1054](https://github.com/ManifoldScholar/manifold/pull/1054) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Scope resource fingerprint uniquness to project [#1055](https://github.com/ManifoldScholar/manifold/pull/1055) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix CodeArea component onChange [#1051](https://github.com/ManifoldScholar/manifold/pull/1051) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Move text section SearchableNode destruction to job [#1039](https://github.com/ManifoldScholar/manifold/pull/1039) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix text section not reindexing searchable nodes on create [#1034](https://github.com/ManifoldScholar/manifold/pull/1034) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Adjust reader TOC/footer z-indices [#1030](https://github.com/ManifoldScholar/manifold/pull/1030) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Show TOC with placeholder copy when TOC is empty [#1029](https://github.com/ManifoldScholar/manifold/pull/1029) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix updater reordering [#1013](https://github.com/ManifoldScholar/manifold/pull/1013) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Adjust featured padding/title font size [#1001](https://github.com/ManifoldScholar/manifold/pull/1001) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Adjust pagination styles [#998](https://github.com/ManifoldScholar/manifold/pull/998) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Show correct extensions for resource media upload [#994](https://github.com/ManifoldScholar/manifold/pull/994) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix rapid reader notation drawer keyword search fetch [#997](https://github.com/ManifoldScholar/manifold/pull/997) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix SSR redirects [#1000](https://github.com/ManifoldScholar/manifold/pull/1000) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix issue with roles preventing project destroy [#987](https://github.com/ManifoldScholar/manifold/pull/987) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix video resource preview throwing exception [#983](https://github.com/ManifoldScholar/manifold/pull/983) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix encoding on .csv imports [#982](https://github.com/ManifoldScholar/manifold/pull/982) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix name wrap in vertical list meta [#978](https://github.com/ManifoldScholar/manifold/pull/978) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix resource mapping button styles/padding [#964](https://github.com/ManifoldScholar/manifold/pull/964) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Correct server-client redirect response [#971](https://github.com/ManifoldScholar/manifold/pull/971) ([zdavis](https://api.github.com/users/zdavis))
-  Fix filtering when using keyword on empty collection [#966](https://github.com/ManifoldScholar/manifold/pull/966) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix missing backend settings subject create [#967](https://github.com/ManifoldScholar/manifold/pull/967) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Allow application/zip mime type for ppt [#968](https://github.com/ManifoldScholar/manifold/pull/968) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove unused resource attributes from import [#954](https://github.com/ManifoldScholar/manifold/pull/954) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix video slider overlay artifacts [#950](https://github.com/ManifoldScholar/manifold/pull/950) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Fix reader role not being assigned when role is not specified [#948](https://github.com/ManifoldScholar/manifold/pull/948) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix setState errors on code-splitting components [#943](https://github.com/ManifoldScholar/manifold/pull/943) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix text collaborator sorting in updater [#932](https://github.com/ManifoldScholar/manifold/pull/932) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Format reader footer metadata [#931](https://github.com/ManifoldScholar/manifold/pull/931) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix broken external links in reader [#926](https://github.com/ManifoldScholar/manifold/pull/926) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix backend project search not matching makers [#923](https://github.com/ManifoldScholar/manifold/pull/923) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v1.0.1](https://github.com/ManifoldScholar/manifold/tree/v1.0.1) - 04/03/18

### Bugs

-  Fix incorrect guard on Pages.New container [#915](https://github.com/ManifoldScholar/manifold/pull/915) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v1.0.0](https://github.com/ManifoldScholar/manifold/tree/v1.0.0) - 03/30/18

## [v1.0.0-rc.5](https://github.com/ManifoldScholar/manifold/tree/v1.0.0-rc.5) - 03/30/18

### Bugs

-  Handle empty selection share messages [#911](https://github.com/ManifoldScholar/manifold/pull/911) ([zdavis](https://api.github.com/users/zdavis))
-  Add sort title to resources and fix ordering [#909](https://github.com/ManifoldScholar/manifold/pull/909) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix resource list filters and URL update [#905](https://github.com/ManifoldScholar/manifold/pull/905) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v1.0.0-rc.4](https://github.com/ManifoldScholar/manifold/tree/v1.0.0-rc.4) - 03/29/18

### Bugs

-  Update resource tag list when keywords change [#902](https://github.com/ManifoldScholar/manifold/pull/902) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Scroll overlay primary behind header [#896](https://github.com/ManifoldScholar/manifold/pull/896) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Allow 404 API requests to bubble up [#903](https://github.com/ManifoldScholar/manifold/pull/903) ([zdavis](https://api.github.com/users/zdavis))
-  Project editors and authors can notate texts [#900](https://github.com/ManifoldScholar/manifold/pull/900) ([zdavis](https://api.github.com/users/zdavis))

## [v1.0.0-rc.3](https://github.com/ManifoldScholar/manifold/tree/v1.0.0-rc.3) - 03/28/18

### Features

-  Implement new maker interface [#888](https://github.com/ManifoldScholar/manifold/pull/888) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add search and built by link to footer [#889](https://github.com/ManifoldScholar/manifold/pull/889) ([zdavis](https://api.github.com/users/zdavis))
-  Include text node with tweet [#890](https://github.com/ManifoldScholar/manifold/pull/890) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Fix highlight/annotation creator checks [#893](https://github.com/ManifoldScholar/manifold/pull/893) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Correct upload input image format label [#884](https://github.com/ManifoldScholar/manifold/pull/884) ([zdavis](https://api.github.com/users/zdavis))
-  Allow project purchase price to be blank [#881](https://github.com/ManifoldScholar/manifold/pull/881) ([zdavis](https://api.github.com/users/zdavis))

## [v1.0.0-rc.2](https://github.com/ManifoldScholar/manifold/tree/v1.0.0-rc.2) - 03/27/18

### Bugs

-  Fix incorrect spacing on SearchableList without buttons [#864](https://github.com/ManifoldScholar/manifold/pull/864) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix metadata keyword display formatting [#871](https://github.com/ManifoldScholar/manifold/pull/871) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix permission routing concern [#873](https://github.com/ManifoldScholar/manifold/pull/873) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add missing dependent destroy behavior [#869](https://github.com/ManifoldScholar/manifold/pull/869) ([zdavis](https://api.github.com/users/zdavis))
-  Fix redirect after stylesheet save [#866](https://github.com/ManifoldScholar/manifold/pull/866) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix tweet fetcher pull inactive tweets [#867](https://github.com/ManifoldScholar/manifold/pull/867) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix backend nav link active states and routing [#862](https://github.com/ManifoldScholar/manifold/pull/862) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix maker drawer redirect after destroy [#861](https://github.com/ManifoldScholar/manifold/pull/861) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v1.0.0-rc.1](https://github.com/ManifoldScholar/manifold/tree/v1.0.0-rc.1) - 03/25/18

### Features

-  Add global search to Manifold [#842](https://github.com/ManifoldScholar/manifold/pull/842) ([zdavis](https://api.github.com/users/zdavis))
-  Add roles and permissions framework; add project logs [#835](https://github.com/ManifoldScholar/manifold/pull/835) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Hoist longer metadata above columnar list [#851](https://github.com/ManifoldScholar/manifold/pull/851) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Add bulk resource import mechanism [#839](https://github.com/ManifoldScholar/manifold/pull/839) ([zdavis](https://api.github.com/users/zdavis))
-  Add permissions interface to backend [#816](https://github.com/ManifoldScholar/manifold/pull/816) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Upgrade react-hot-loader to v4 [#822](https://github.com/ManifoldScholar/manifold/pull/822) ([zdavis](https://api.github.com/users/zdavis))
-  Show drawer notifications in the drawer [#808](https://github.com/ManifoldScholar/manifold/pull/808) ([zdavis](https://api.github.com/users/zdavis))
-  Update React to v16. [#800](https://github.com/ManifoldScholar/manifold/pull/800) ([zdavis](https://api.github.com/users/zdavis))
-  Implement roles through Rolify [#782](https://github.com/ManifoldScholar/manifold/pull/782) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Fix API project ordering [#855](https://github.com/ManifoldScholar/manifold/pull/855) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Update results list styles/padding [#854](https://github.com/ManifoldScholar/manifold/pull/854) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Increase text header line height [#853](https://github.com/ManifoldScholar/manifold/pull/853) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Fix inconsistencies in reader dark mode [#852](https://github.com/ManifoldScholar/manifold/pull/852) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Fix link color in form instructions [#850](https://github.com/ManifoldScholar/manifold/pull/850) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Adjust ingestion reset button text/position [#836](https://github.com/ManifoldScholar/manifold/pull/836) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Show new user in list after creation [#818](https://github.com/ManifoldScholar/manifold/pull/818) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove source breaks from annotation subject [#812](https://github.com/ManifoldScholar/manifold/pull/812) ([zdavis](https://api.github.com/users/zdavis))
-  Prevent cascading rerender on click [#810](https://github.com/ManifoldScholar/manifold/pull/810) ([zdavis](https://api.github.com/users/zdavis))
-  Correct header dropdown and dialog z-index [#807](https://github.com/ManifoldScholar/manifold/pull/807) ([zdavis](https://api.github.com/users/zdavis))
-  Correct me/relationships/favorites serializer [#806](https://github.com/ManifoldScholar/manifold/pull/806) ([zdavis](https://api.github.com/users/zdavis))
-  Swap resource cube inline svgs for icon font [#798](https://github.com/ManifoldScholar/manifold/pull/798) ([naomiyaki](https://api.github.com/users/naomiyaki))
-  Coerce ASCII epub body to UTF-8 during transform [#805](https://github.com/ManifoldScholar/manifold/pull/805) ([zdavis](https://api.github.com/users/zdavis))
-  Correct handling of encoded URIs in EPUBs [#797](https://github.com/ManifoldScholar/manifold/pull/797) ([zdavis](https://api.github.com/users/zdavis))## [v0.4.2](https://github.com/ManifoldScholar/manifold/tree/v0.4.2) - 03/13/2018

### Bugs

- EPUB Ingestion fails when a section includes an empty body tag. [\#821](https://github.com/ManifoldScholar/manifold/issues/821)
- Updating texts with many text sections is too slow [\#802](https://github.com/ManifoldScholar/manifold/issues/802)
- Address reingest edge case when sections have been removed. [\#829](https://github.com/ManifoldScholar/manifold/issues/829)

## [v0.4.1](https://github.com/ManifoldScholar/manifold/tree/v0.4.1) - 02/14/2018

### Bugs

- Some texts fail to generate citations properly [\#709](https://github.com/ManifoldScholar/manifold/issues/709)
- Backend subject list pagination does not paginate [\#769](https://github.com/ManifoldScholar/manifold/issues/769)
- Subject API results should not be paginated [\#770](https://github.com/ManifoldScholar/manifold/issues/770)
- Replace FactoryGirl with FactoryBot [\#779](https://github.com/ManifoldScholar/manifold/issues/779)
- Start reading link on new text event is incorrect [\#776](https://github.com/ManifoldScholar/manifold/issues/776)
- Maker creation sometimes fails during text ingestion [\#766](https://github.com/ManifoldScholar/manifold/issues/766)
- Allow links in metadata markdown [\#763](https://github.com/ManifoldScholar/manifold/issues/763)
- Address broken footnote/endnote links [\#764](https://github.com/ManifoldScholar/manifold/issues/764)
- Manifold fails to ingest items in EPUB manifest with encoded URLs [\#795](https://github.com/ManifoldScholar/manifold/issues/795)
- EPUB Ingestion: ASCII characters in a text section can break ingestion[\#803](https://github.com/ManifoldScholar/manifold/issues/803)

## [v0.4.0](https://github.com/ManifoldScholar/manifold/tree/v0.4.0) - 01/29/2018

### Enhancements

- Improve management of maker records [\#754](https://github.com/ManifoldScholar/manifold/issues/754)
- Update Paperclip gem to address CVE-2017-0889 [\#743](https://github.com/ManifoldScholar/manifold/issues/743)
- Improve child route rendering [\#737](https://github.com/ManifoldScholar/manifold/issues/737)
- Implement upgrade CLI task for major releases [\#734](https://github.com/ManifoldScholar/manifold/issues/734)
- Manifold should manage ElasticSearch service in development [\#727](https://github.com/ManifoldScholar/manifold/issues/727)
- Update redis-rails to address CVE-2017-1000248 [\#720](https://github.com/ManifoldScholar/manifold/issues/720)
- Admin users can set google service credentials from config file [\#719](https://github.com/ManifoldScholar/manifold/issues/719)
- Add image size guidance for hero images and other images in the Admin \> Appearance tab [\#713](https://github.com/ManifoldScholar/manifold/issues/713)
- Support markdown in all model metadata fields [\#674](https://github.com/ManifoldScholar/manifold/issues/674)
- Editors can fully manage twitter queries on projects [\#672](https://github.com/ManifoldScholar/manifold/issues/672)
- Update rubyzip dependency to address CVE-2017-5946 [\#664](https://github.com/ManifoldScholar/manifold/issues/664)
- Widespread adjustments to record metadata fields [\#649](https://github.com/ManifoldScholar/manifold/issues/649)
- Implement full-text project text and annotation search in reader [\#644](https://github.com/ManifoldScholar/manifold/issues/644)
- Implement "your notes" for listing and navigating between highlights and annotations [\#643](https://github.com/ManifoldScholar/manifold/issues/643)
- Allow backend editors to manage project subjects [\#612](https://github.com/ManifoldScholar/manifold/issues/612)
- Allow users to choose action when clicking on an annotated link [\#529](https://github.com/ManifoldScholar/manifold/issues/529)
- Persist reader settings in user preferences [\#516](https://github.com/ManifoldScholar/manifold/issues/516)
- Allow admins to choose a name for the sections within a text. [\#503](https://github.com/ManifoldScholar/manifold/issues/503)
- Support interactive resources via iFrame [\#408](https://github.com/ManifoldScholar/manifold/issues/408)
- Style \(and improve\) forgot password email [\#306](https://github.com/ManifoldScholar/manifold/issues/306)
- Implement semantic URLs [\#275](https://github.com/ManifoldScholar/manifold/issues/275)

### Bugs

- External video in preview overlay is too small [\#755](https://github.com/ManifoldScholar/manifold/issues/755)
- Correct minor CSS regressions [\#751](https://github.com/ManifoldScholar/manifold/issues/751)
- Use drawer for backend new user [\#745](https://github.com/ManifoldScholar/manifold/issues/745)
- Drive resource import failing [\#731](https://github.com/ManifoldScholar/manifold/issues/731)
- Project rake tasks fail with incorrect arg call [\#730](https://github.com/ManifoldScholar/manifold/issues/730)
- Placeholder/label mismatch on login [\#724](https://github.com/ManifoldScholar/manifold/issues/724)
- Potential issue with maker/user relations [\#716](https://github.com/ManifoldScholar/manifold/issues/716)
- Throw an error message when someone tries to upload a private google doc [\#715](https://github.com/ManifoldScholar/manifold/issues/715)
- Issues with sharing text to Twitter [\#708](https://github.com/ManifoldScholar/manifold/issues/708)
- Edit profile form puts existing values in as placeholder, not value attribute [\#701](https://github.com/ManifoldScholar/manifold/issues/701)
- Manifold sends a sign-up email even if registration fails [\#700](https://github.com/ManifoldScholar/manifold/issues/700)
- Opening reader menu should close reader TOC. [\#699](https://github.com/ManifoldScholar/manifold/issues/699)
- Users should be prompted to confirm before destroying an annotation [\#698](https://github.com/ManifoldScholar/manifold/issues/698)
- When highlighting link annotation popup buttons are separated [\#697](https://github.com/ManifoldScholar/manifold/issues/697)
- Reader code block font-size is massive [\#692](https://github.com/ManifoldScholar/manifold/issues/692)
- Resource card grid layout should be consistent across modern browsers [\#690](https://github.com/ManifoldScholar/manifold/issues/690)
- Resource link grid layout \(on the project detail page\) should be consistent across modern browsers [\#689](https://github.com/ManifoldScholar/manifold/issues/689)
- Welcome email is sent before account is created [\#684](https://github.com/ManifoldScholar/manifold/issues/684)
- User validations are broken [\#683](https://github.com/ManifoldScholar/manifold/issues/683)
- Adding a profile picture with an upper case attachment fails silently [\#682](https://github.com/ManifoldScholar/manifold/issues/682)
- In IE11 selecting text should pop up annotation menu [\#678](https://github.com/ManifoldScholar/manifold/issues/678)
- After login, successful login alert should disappear without user intervention [\#676](https://github.com/ManifoldScholar/manifold/issues/676)
- Collections can be saved blank [\#660](https://github.com/ManifoldScholar/manifold/issues/660)
- Correct twitter share image; use project images when texts are shared [\#658](https://github.com/ManifoldScholar/manifold/issues/658)
- Resource detail view scrolls to bottom after load [\#656](https://github.com/ManifoldScholar/manifold/issues/656)
- /foo/bar shows home page instead of 404 [\#654](https://github.com/ManifoldScholar/manifold/issues/654)
- Change "metadata" label on project detail blade to "about" [\#648](https://github.com/ManifoldScholar/manifold/issues/648)
- Correct the backend collection header icon [\#642](https://github.com/ManifoldScholar/manifold/issues/642)
- Improve margin between label and input on all backend form fields [\#641](https://github.com/ManifoldScholar/manifold/issues/641)
- Use settings.installationName in the new project event text [\#640](https://github.com/ManifoldScholar/manifold/issues/640)
- Destroying a resource should destroy the associated event. [\#638](https://github.com/ManifoldScholar/manifold/issues/638)
- Edge: Hover state artifact in annotation popup [\#637](https://github.com/ManifoldScholar/manifold/issues/637)
- Scrolling should not occur on all route changes [\#617](https://github.com/ManifoldScholar/manifold/issues/617)
- Weird link hover state in reader about [\#596](https://github.com/ManifoldScholar/manifold/issues/596)
- Rendering and display inconsistencies in resource icons [\#557](https://github.com/ManifoldScholar/manifold/issues/557)
- Address mobile style issues on user highlights/annotation [\#515](https://github.com/ManifoldScholar/manifold/issues/515)
- Resource list item thumbnails aren't showing in Firefox & IE Edge [\#483](https://github.com/ManifoldScholar/manifold/issues/483)
- Annotating over an inline resource leaves big gap in text [\#297](https://github.com/ManifoldScholar/manifold/issues/297)

### Other

- Replace calls to `renderRoutes` with `childRoutes` [\#736](https://github.com/ManifoldScholar/manifold/issues/736)
- Improve changelog generation [\#721](https://github.com/ManifoldScholar/manifold/issues/721)
- Refactor resource overlay classes to be generic [\#283](https://github.com/ManifoldScholar/manifold/issues/283)

### Accepted Pull Requests

- \[B\] Fix sizing of external videos in preview overlay [\#759](https://github.com/ManifoldScholar/manifold/pull/759) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Improvements to User/Maker [\#758](https://github.com/ManifoldScholar/manifold/pull/758) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Update project Readme [\#756](https://github.com/ManifoldScholar/manifold/pull/756) ([zdavis](https://github.com/zdavis))
- \[B\] Fix misc. issues for v0.4.0 release [\#753](https://github.com/ManifoldScholar/manifold/pull/753) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Bug fixes and improvements prior to 0.4.0 release [\#752](https://github.com/ManifoldScholar/manifold/pull/752) ([zdavis](https://github.com/zdavis))
- \[C\] Updates and Gemfile maintenance [\#750](https://github.com/ManifoldScholar/manifold/pull/750) ([zdavis](https://github.com/zdavis))
- \[F\] Allow metadata values to be formatted with markdown [\#749](https://github.com/ManifoldScholar/manifold/pull/749) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Update paperclip to address CVE-2017-0889 [\#748](https://github.com/ManifoldScholar/manifold/pull/748) ([zdavis](https://github.com/zdavis))
- \[F\] Support interactive resources via iFrame [\#747](https://github.com/ManifoldScholar/manifold/pull/747) ([zdavis](https://github.com/zdavis))
- \[C\] Render new user route in drawer [\#746](https://github.com/ManifoldScholar/manifold/pull/746) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Update paperclip to address CVE-2017-0889 [\#744](https://github.com/ManifoldScholar/manifold/pull/744) ([zdavis](https://github.com/zdavis))
- \[F\] Add popup menu for annotations on a link [\#742](https://github.com/ManifoldScholar/manifold/pull/742) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Add image size guide to project hero image input [\#741](https://github.com/ManifoldScholar/manifold/pull/741) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Use childRoutes instead of renderRoutes [\#740](https://github.com/ManifoldScholar/manifold/pull/740) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fail with error if google doc is unavailable [\#739](https://github.com/ManifoldScholar/manifold/pull/739) ([zdavis](https://github.com/zdavis))
- \[F\] Refactor child route rendering [\#735](https://github.com/ManifoldScholar/manifold/pull/735) ([zdavis](https://github.com/zdavis))
- \[F\] Style email templates [\#733](https://github.com/ManifoldScholar/manifold/pull/733) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix drive resource importing [\#732](https://github.com/ManifoldScholar/manifold/pull/732) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix project rake task argument references [\#729](https://github.com/ManifoldScholar/manifold/pull/729) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Include managed Elasticsearch service [\#728](https://github.com/ManifoldScholar/manifold/pull/728) ([zdavis](https://github.com/zdavis))
- \[F\] Implement reader search [\#726](https://github.com/ManifoldScholar/manifold/pull/726) ([zdavis](https://github.com/zdavis))
- \[C\] Add text field for google private key to backend settings [\#725](https://github.com/ManifoldScholar/manifold/pull/725) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Improve Changelog generation [\#722](https://github.com/ManifoldScholar/manifold/pull/722) ([zdavis](https://github.com/zdavis))
- \[F\] Set Google service credentials from file [\#717](https://github.com/ManifoldScholar/manifold/pull/717) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fixes Twitter share text; Fix incorrect Text slugs [\#712](https://github.com/ManifoldScholar/manifold/pull/712) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add task and service to upgrade a Manifold installation [\#710](https://github.com/ManifoldScholar/manifold/pull/710) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Remove login notification [\#703](https://github.com/ManifoldScholar/manifold/pull/703) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Use values instead of placeholders in edit form [\#702](https://github.com/ManifoldScholar/manifold/pull/702) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Adjust base font-size used in stylesheet validator [\#696](https://github.com/ManifoldScholar/manifold/pull/696) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Fix typos in manifold task output [\#695](https://github.com/ManifoldScholar/manifold/pull/695) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add backend project social page [\#694](https://github.com/ManifoldScholar/manifold/pull/694) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Address inconsistent icon sizes [\#691](https://github.com/ManifoldScholar/manifold/pull/691) ([blnkt](https://github.com/blnkt))
- \[B\] Don't send welcome email if user validation fails [\#687](https://github.com/ManifoldScholar/manifold/pull/687) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix attachment extension validation [\#686](https://github.com/ManifoldScholar/manifold/pull/686) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] User validation fixes [\#685](https://github.com/ManifoldScholar/manifold/pull/685) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Update manifold CLI rake task references [\#681](https://github.com/ManifoldScholar/manifold/pull/681) ([blnkt](https://github.com/blnkt))
- \[C\] Switch manifold tld in client allowedHosts [\#680](https://github.com/ManifoldScholar/manifold/pull/680) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix annotation popup bugs in ie [\#679](https://github.com/ManifoldScholar/manifold/pull/679) ([blnkt](https://github.com/blnkt))
- \[F\] Implement updated reader control design and functionality [\#677](https://github.com/ManifoldScholar/manifold/pull/677) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Improve project, text, & resource metadata [\#673](https://github.com/ManifoldScholar/manifold/pull/673) ([zdavis](https://github.com/zdavis))
- \[B\] Backend collection icon fixes [\#670](https://github.com/ManifoldScholar/manifold/pull/670) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Allow text section type to be changed [\#669](https://github.com/ManifoldScholar/manifold/pull/669) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Prevent scroll to top on reader route change [\#668](https://github.com/ManifoldScholar/manifold/pull/668) ([zdavis](https://github.com/zdavis))
- \[C\] Restructure backend containers [\#667](https://github.com/ManifoldScholar/manifold/pull/667) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Update rubyzip to address CVE-2017-5946 [\#666](https://github.com/ManifoldScholar/manifold/pull/666) ([zdavis](https://github.com/zdavis))
- \[B\] Improve Open Graph tags in multiple containers [\#663](https://github.com/ManifoldScholar/manifold/pull/663) ([zdavis](https://github.com/zdavis))
- \[B\] Add title validation to collections [\#661](https://github.com/ManifoldScholar/manifold/pull/661) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Rename project detail metadata section label [\#659](https://github.com/ManifoldScholar/manifold/pull/659) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Make reader UI settings persistent for user [\#657](https://github.com/ManifoldScholar/manifold/pull/657) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Fully implement semantic URLs on frontend [\#655](https://github.com/ManifoldScholar/manifold/pull/655) ([zdavis](https://github.com/zdavis))
- \[B\] Resources should destroy associated added event [\#652](https://github.com/ManifoldScholar/manifold/pull/652) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Use installation name in project created event [\#651](https://github.com/ManifoldScholar/manifold/pull/651) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Implement interface to manage/assign subjects [\#650](https://github.com/ManifoldScholar/manifold/pull/650) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Highlight "learn more..." in reader menu [\#628](https://github.com/ManifoldScholar/manifold/pull/628) ([naomiyaki](https://github.com/naomiyaki))

## [v0.3.5](https://github.com/ManifoldScholar/manifold/tree/v0.3.5) - 1/26/2018

### Bugs

- Do not force UTF8 epub source encoding during ingestion

## [v0.3.4](https://github.com/ManifoldScholar/manifold/tree/v0.3.4) - 1/6/2018

### Features

- Set Google service credentials from file

## [v0.3.3](https://github.com/ManifoldScholar/manifold/tree/v0.3.3) - 12/28/2017

### Bugs

- Improve custom logo layout
- Align project figures to grid

## [v0.3.2](https://github.com/ManifoldScholar/manifold/tree/v0.3.2) - 12/06/2017

### Bugs

- Update redis-rails to address CVE-2017-1000248
- Check revision before deploy
- Restore source maps to production build

## [v0.3.1](https://github.com/ManifoldScholar/manifold/tree/v0.3.1) - 11/17/2017

### Bugs

- Update rubyzip dependency to address CVE-2017-5946 [\#664](https://github.com/ManifoldScholar/manifold/issues/664)
- Improve Open Graph tags in multiple containers
- Pass path rather than URL to router on SSR
- Adjust production log level

## [v0.3.0](https://github.com/ManifoldScholar/manifold/tree/v0.3.0) - 10/13/2017

### Features

- Manifold supports SSL [\#631](https://github.com/ManifoldScholar/manifold/issues/631)
- Users can remove their highlights from a text [\#618](https://github.com/ManifoldScholar/manifold/issues/618)
- Admins can create simple content pages in Manifold [\#586](https://github.com/ManifoldScholar/manifold/issues/586)
- Admin can manage the home page hero and text. [\#574](https://github.com/ManifoldScholar/manifold/issues/574)
- Update reader header to match new comps [\#567](https://github.com/ManifoldScholar/manifold/issues/567)
- Update TOC design to match latest comps [\#566](https://github.com/ManifoldScholar/manifold/issues/566)
- Update hero layout with draft button, streamlined makers list [\#501](https://github.com/ManifoldScholar/manifold/issues/501)
- Improve copy and style of transaction account emails [\#474](https://github.com/ManifoldScholar/manifold/issues/474)
- Admins can name their Manifold installation [\#472](https://github.com/ManifoldScholar/manifold/issues/472)
- Manifold settings model has sensible default settings [\#471](https://github.com/ManifoldScholar/manifold/issues/471)
- Manifold supports the EPUB3 epub:type namespaced attribute [\#460](https://github.com/ManifoldScholar/manifold/issues/460)
- Preliminary work allowing a user to see all their annotations of a text [\#450](https://github.com/ManifoldScholar/manifold/issues/450)
- Admins can specify email delivery method and settings [\#440](https://github.com/ManifoldScholar/manifold/issues/440)
- Manifold can ingest an EPUB from a URL [\#420](https://github.com/ManifoldScholar/manifold/issues/420)
- Activity can be hidden on a project-by-project basis. [\#419](https://github.com/ManifoldScholar/manifold/issues/419)
- React is updated to version 15.5 [\#417](https://github.com/ManifoldScholar/manifold/issues/417)
- Backend users can create a new user [\#411](https://github.com/ManifoldScholar/manifold/issues/411)
- Zoom is enabled for image resources [\#407](https://github.com/ManifoldScholar/manifold/issues/407)
- Resource notations are usable on mobile devices [\#406](https://github.com/ManifoldScholar/manifold/issues/406)
- Admins can add resource collection annotations [\#405](https://github.com/ManifoldScholar/manifold/issues/405)
- Every annotation has a permalink [\#404](https://github.com/ManifoldScholar/manifold/issues/404)
- Webpack is upgraded to v3. Babel is upgraded. [\#402](https://github.com/ManifoldScholar/manifold/issues/402)
- Improve GDoc Ingestion Styles [\#388](https://github.com/ManifoldScholar/manifold/issues/388)
- Include draft/live toggle for projects. Only admins can see projects in draft mode. [\#371](https://github.com/ManifoldScholar/manifold/issues/371)
- Manifold has correct page titles, open graph tags; social metadata is more robust [\#345](https://github.com/ManifoldScholar/manifold/issues/345)

### Bugs

- If no OAUTH providers are configured, don't show the external auth message on the login screen [\#633](https://github.com/ManifoldScholar/manifold/issues/633)
- Firefox shows router error \(on all pages?\) [\#630](https://github.com/ManifoldScholar/manifold/issues/630)
- Prevent letter spacing CSS in reader [\#623](https://github.com/ManifoldScholar/manifold/issues/623)
- Manifold can fail when cookie is missing. [\#621](https://github.com/ManifoldScholar/manifold/issues/621)
- Ingestion uploader is not responding to files [\#609](https://github.com/ManifoldScholar/manifold/issues/609)
- Only the SSR checks the cookie for an authenticated session. [\#605](https://github.com/ManifoldScholar/manifold/issues/605)
- Regression in backend lists [\#599](https://github.com/ManifoldScholar/manifold/issues/599)
- Reader text title and section title no longer appears in header [\#598](https://github.com/ManifoldScholar/manifold/issues/598)
- Tighten up spacing on mobile person overlay [\#595](https://github.com/ManifoldScholar/manifold/issues/595)
- Add spacing to the end of backend horizontal secondary menu [\#594](https://github.com/ManifoldScholar/manifold/issues/594)
- iOS style needs to be removed from login overlay [\#593](https://github.com/ManifoldScholar/manifold/issues/593)
- Update Texts button and table [\#592](https://github.com/ManifoldScholar/manifold/issues/592)
- Reduce person picker UI on mobile [\#591](https://github.com/ManifoldScholar/manifold/issues/591)
- Cover picker is a bit too crowded on iPhone 4/5 size [\#590](https://github.com/ManifoldScholar/manifold/issues/590)
- Update backend form styles to be slightly lighter on mobile [\#589](https://github.com/ManifoldScholar/manifold/issues/589)
- Padding issue on tablet sizes [\#585](https://github.com/ManifoldScholar/manifold/issues/585)
- Group notation titles are not formatted [\#577](https://github.com/ManifoldScholar/manifold/issues/577)
- Back link text wraps incorrectly on mobile [\#573](https://github.com/ManifoldScholar/manifold/issues/573)
- Reader nav text too large on mobile [\#570](https://github.com/ManifoldScholar/manifold/issues/570)
- Vertical alignment off on text count icons [\#564](https://github.com/ManifoldScholar/manifold/issues/564)
- rake development:load crashes [\#562](https://github.com/ManifoldScholar/manifold/issues/562)
- Add comment icon and header missing from resource detail comments [\#560](https://github.com/ManifoldScholar/manifold/issues/560)
- Add "purchase version label" to backend project form. [\#559](https://github.com/ManifoldScholar/manifold/issues/559)
- Resource collection notations are missing thumbnail if none is set. [\#558](https://github.com/ManifoldScholar/manifold/issues/558)
- Display error in backend select inputs [\#556](https://github.com/ManifoldScholar/manifold/issues/556)
- Backend header links should have a hover state [\#555](https://github.com/ManifoldScholar/manifold/issues/555)
- Null date values show as Dec 31, 1969 in the backend [\#554](https://github.com/ManifoldScholar/manifold/issues/554)
- Manifold Footer / Copyright Dates [\#553](https://github.com/ManifoldScholar/manifold/issues/553)
- UX for ingestion is confusing [\#551](https://github.com/ManifoldScholar/manifold/issues/551)
- Searching for projects before projects exist triggers error [\#547](https://github.com/ManifoldScholar/manifold/issues/547)
- Correct hard coded reply count in view. [\#546](https://github.com/ManifoldScholar/manifold/issues/546)
- Draft projects shouldn't show updated timestamp on frontend. [\#541](https://github.com/ManifoldScholar/manifold/issues/541)
- Warning with the file upload form component [\#540](https://github.com/ManifoldScholar/manifold/issues/540)
- Long title in resource list should be wrapped or cropped [\#539](https://github.com/ManifoldScholar/manifold/issues/539)
- Reader footer is stacked above overlays [\#533](https://github.com/ManifoldScholar/manifold/issues/533)
- Improve usability of backend projects list [\#531](https://github.com/ManifoldScholar/manifold/issues/531)
- Remove "chapter" from next and previous links in reader [\#530](https://github.com/ManifoldScholar/manifold/issues/530)
- Removing a maker's avatar in the backend does not work. [\#527](https://github.com/ManifoldScholar/manifold/issues/527)
- Correct category footer display issues in reader. [\#526](https://github.com/ManifoldScholar/manifold/issues/526)
- Ingestion does not correctly identify EPUB2 titles [\#523](https://github.com/ManifoldScholar/manifold/issues/523)
- Backend project list doesn't always show correct thumbnail [\#522](https://github.com/ManifoldScholar/manifold/issues/522)
- Malformed URIs in ingested texts breaks ingestion [\#519](https://github.com/ManifoldScholar/manifold/issues/519)
- If no results are found, backend project search breaks [\#518](https://github.com/ManifoldScholar/manifold/issues/518)
- Nav button redundancy on mobile layout [\#512](https://github.com/ManifoldScholar/manifold/issues/512)
- Error on user creation [\#509](https://github.com/ManifoldScholar/manifold/issues/509)
- Remove normal font-weight declarations from ingested texts [\#507](https://github.com/ManifoldScholar/manifold/issues/507)
- In production, Manifold sometimes erroneously returns an auth error message [\#504](https://github.com/ManifoldScholar/manifold/issues/504)
- Stylesheet create/edit views in backend do not show errors [\#502](https://github.com/ManifoldScholar/manifold/issues/502)
- The path to resources from project activity cards is incorrect. [\#498](https://github.com/ManifoldScholar/manifold/issues/498)
- When annotation drawer opens, the textarea should have focus. [\#495](https://github.com/ManifoldScholar/manifold/issues/495)
- Webpack config not extracting CSS in production build [\#492](https://github.com/ManifoldScholar/manifold/issues/492)
- Prevent padding on text section pagination when not showing [\#490](https://github.com/ManifoldScholar/manifold/issues/490)
- Remove placeholder features container from settings [\#488](https://github.com/ManifoldScholar/manifold/issues/488)
- New User form throws an error in production [\#487](https://github.com/ManifoldScholar/manifold/issues/487)
- Resource slideshow controls don't match comps for mobile [\#482](https://github.com/ManifoldScholar/manifold/issues/482)
- Hero BG gray on projects is incorrect [\#480](https://github.com/ManifoldScholar/manifold/issues/480)
- EPUB ingestion not recognizing start section in V2 and V3 due to path changes [\#479](https://github.com/ManifoldScholar/manifold/issues/479)
- Footer subject bar in reader isn't positioned correctly [\#478](https://github.com/ManifoldScholar/manifold/issues/478)
- Ingestion strategies are not detecting table of contents [\#477](https://github.com/ManifoldScholar/manifold/issues/477)
- Pressing return in any text field on the new user form in the backend reveals the password [\#476](https://github.com/ManifoldScholar/manifold/issues/476)
- Edit profile view is briefly flashed after login, which shouldn't happen [\#473](https://github.com/ManifoldScholar/manifold/issues/473)
- Start reading event link opens in new tab. It shouldn't. [\#468](https://github.com/ManifoldScholar/manifold/issues/468)
- Ingestor spec is failing [\#465](https://github.com/ManifoldScholar/manifold/issues/465)
- EPUB ingestion fails if text section doesn't have a name [\#464](https://github.com/ManifoldScholar/manifold/issues/464)
- HP Projects list should be paginated [\#454](https://github.com/ManifoldScholar/manifold/issues/454)
- When typekit is disabled, read button wraps [\#453](https://github.com/ManifoldScholar/manifold/issues/453)
- HP Featured projects block shouldn't appear if there are no featured projects [\#452](https://github.com/ManifoldScholar/manifold/issues/452)
- Overlap on see more projects button [\#444](https://github.com/ManifoldScholar/manifold/issues/444)
- Checkboxes in user \(and maker?\) lists don't do anything.  [\#441](https://github.com/ManifoldScholar/manifold/issues/441)
- Frontend dropdown styles aren't right in Firefox. [\#439](https://github.com/ManifoldScholar/manifold/issues/439)
- Saving settings clears all but changed fields [\#438](https://github.com/ManifoldScholar/manifold/issues/438)
- Commenting on a resource requires a reload before the comment is visible [\#435](https://github.com/ManifoldScholar/manifold/issues/435)
- Render error in SlideshowCaption [\#433](https://github.com/ManifoldScholar/manifold/issues/433)
- Dropdown arrows are misaligned; Browser dropdown shows [\#432](https://github.com/ManifoldScholar/manifold/issues/432)
- Text ingestion cancel doesn't work [\#415](https://github.com/ManifoldScholar/manifold/issues/415)
- Unfollowing a project throws an exception. [\#412](https://github.com/ManifoldScholar/manifold/issues/412)
- GDoc Encoding Error [\#409](https://github.com/ManifoldScholar/manifold/issues/409)
- Long titles break event layout [\#401](https://github.com/ManifoldScholar/manifold/issues/401)
- Viewing a resource in the reader resets the scroll position. [\#381](https://github.com/ManifoldScholar/manifold/issues/381)
- The user should be notified when there is a failed websocket connection. [\#351](https://github.com/ManifoldScholar/manifold/issues/351)
- Highlighting near the reader fade highlights entire top portion [\#255](https://github.com/ManifoldScholar/manifold/issues/255)

**Other Revisions**

- Manifold CLI \(rake\) interface needs to be cleaned up [\#552](https://github.com/ManifoldScholar/manifold/issues/552)
- Puppet manifests need some love [\#550](https://github.com/ManifoldScholar/manifold/issues/550)
- Switch style linting to Stylelint [\#545](https://github.com/ManifoldScholar/manifold/issues/545)
- Add tests for the frontend user create components [\#461](https://github.com/ManifoldScholar/manifold/issues/461)
- Replace Social component with compatible version [\#418](https://github.com/ManifoldScholar/manifold/issues/418)
- Add reader meta overlay "About this Text" [\#601](https://github.com/ManifoldScholar/manifold/issues/601)
- Prevent API logging of base64 encoded uploads [\#528](https://github.com/ManifoldScholar/manifold/issues/528)
- Invalid ingestion source attachments break ingestion. [\#521](https://github.com/ManifoldScholar/manifold/issues/521)

### Accepted Pull Requests

- \[F\] Manifold supports SSL [\#632](https://github.com/ManifoldScholar/manifold/pull/632) ([zdavis](https://github.com/zdavis))
- \[F\] Notify user of failed websocket connection [\#616](https://github.com/ManifoldScholar/manifold/pull/616) ([zdavis](https://github.com/zdavis))
- \[B\] Correct regresion in ingestion uploading [\#614](https://github.com/ManifoldScholar/manifold/pull/614) ([zdavis](https://github.com/zdavis))
- \[B\] Fix project sorting in two places [\#613](https://github.com/ManifoldScholar/manifold/pull/613) ([zdavis](https://github.com/zdavis))
- \[B\] Improve ingestion UX [\#608](https://github.com/ManifoldScholar/manifold/pull/608) ([zdavis](https://github.com/zdavis))
- \[B\] Correct session restoration when SSR is missing. [\#606](https://github.com/ManifoldScholar/manifold/pull/606) ([zdavis](https://github.com/zdavis))
- \[F\] Improve feature layout capabilities [\#602](https://github.com/ManifoldScholar/manifold/pull/602) ([zdavis](https://github.com/zdavis))
- \[C\] Refactor client script organization; deployment [\#600](https://github.com/ManifoldScholar/manifold/pull/600) ([zdavis](https://github.com/zdavis))
- \[C\] Replace SCSS-Lint with Stylelint [\#597](https://github.com/ManifoldScholar/manifold/pull/597) ([zdavis](https://github.com/zdavis))
- \[F\] Admins can manage page and feature content [\#588](https://github.com/ManifoldScholar/manifold/pull/588) ([zdavis](https://github.com/zdavis))
- \[C\] Reorganize rake tasks; move cap tasks [\#569](https://github.com/ManifoldScholar/manifold/pull/569) ([zdavis](https://github.com/zdavis))
- \[F\] Improve and refactor Node client servers. [\#544](https://github.com/ManifoldScholar/manifold/pull/544) ([zdavis](https://github.com/zdavis))
- \[F\] EPUB Ingestion bugfixes and improvements [\#524](https://github.com/ManifoldScholar/manifold/pull/524) ([zdavis](https://github.com/zdavis))
- \[B\] Strip normal font weights during ingestion [\#508](https://github.com/ManifoldScholar/manifold/pull/508) ([zdavis](https://github.com/zdavis))
- \[B\] Correct event urls [\#500](https://github.com/ManifoldScholar/manifold/pull/500) ([zdavis](https://github.com/zdavis))
- \[F\] List all highlights and annotations for a given text [\#497](https://github.com/ManifoldScholar/manifold/pull/497) ([zdavis](https://github.com/zdavis))
- \[B\] Extract styles to css file in prod build [\#493](https://github.com/ManifoldScholar/manifold/pull/493) ([zdavis](https://github.com/zdavis))
- \[C\] Adjust deployment approach [\#486](https://github.com/ManifoldScholar/manifold/pull/486) ([zdavis](https://github.com/zdavis))
- \[B\] Correct ingestion regressions [\#481](https://github.com/ManifoldScholar/manifold/pull/481) ([zdavis](https://github.com/zdavis))
- \[B\] Squish TextSection title in epub ingestion [\#446](https://github.com/ManifoldScholar/manifold/pull/446) ([zdavis](https://github.com/zdavis))
- \[B\] Fix SSR fetchData regression [\#436](https://github.com/ManifoldScholar/manifold/pull/436) ([zdavis](https://github.com/zdavis))
- \[B\] Correct ingestion cancel button behavior [\#431](https://github.com/ManifoldScholar/manifold/pull/431) ([zdavis](https://github.com/zdavis))
- \[C\] Add prettier; update eslint; lint all the things [\#429](https://github.com/ManifoldScholar/manifold/pull/429) ([zdavis](https://github.com/zdavis))
- \[C\] Speed up client tests on Travis [\#428](https://github.com/ManifoldScholar/manifold/pull/428) ([zdavis](https://github.com/zdavis))
- \[F\] Update Webpack and Babel; improve client tests [\#421](https://github.com/ManifoldScholar/manifold/pull/421) ([zdavis](https://github.com/zdavis))
- \[F\] Admins can create new user accounts [\#413](https://github.com/ManifoldScholar/manifold/pull/413) ([SMaxOwok](https://github.com/SMaxOwok))

## [v0.2.0](https://github.com/ManifoldScholar/manifold/tree/v0.2.0) - 06/20/2017

### Features

- All ingestion strategies can support a .zip or a directory [\#398](https://github.com/ManifoldScholar/manifold/issues/398)
- Backend users can edit text stylesheets [\#367](https://github.com/ManifoldScholar/manifold/issues/367)
- Manifold can ingest a single HTML file as a text [\#360](https://github.com/ManifoldScholar/manifold/issues/360)
- Manifold supports Node 6.10.x [\#343](https://github.com/ManifoldScholar/manifold/issues/343)
- Render a consistently styled confirmation box when leaving unsaved forms [\#309](https://github.com/ManifoldScholar/manifold/issues/309)
- Add keyboard inputs to all modal dialogs [\#302](https://github.com/ManifoldScholar/manifold/issues/302)
- Backend users can create, update, edit, and delete resource collections [\#281](https://github.com/ManifoldScholar/manifold/issues/281)
- Youtube and Vimeo resources import thumbnails from providers [\#278](https://github.com/ManifoldScholar/manifold/issues/278)
- React-router updated from 2.x to 4.x [\#276](https://github.com/ManifoldScholar/manifold/issues/276)
- Manifold renders sensible fallback fonts when Typekit is not enabled [\#274](https://github.com/ManifoldScholar/manifold/issues/274)
- Backend text ingestion user interface is more user friendly [\#273](https://github.com/ManifoldScholar/manifold/issues/273)
- Texts can be re-ingested [\#272](https://github.com/ManifoldScholar/manifold/issues/272)
- Readers can comment on resources [\#271](https://github.com/ManifoldScholar/manifold/issues/271)
- Backend users can configure a generic project avatar or upload a thumbnail [\#270](https://github.com/ManifoldScholar/manifold/issues/270)
- Readers can generate a citation \(MLA, APA, Chicago, etc.\) for the selected passage [\#269](https://github.com/ManifoldScholar/manifold/issues/269)
- Manifold utilizes Postgres JSONB field for storing text section content [\#258](https://github.com/ManifoldScholar/manifold/issues/258)
- Installation instructions are included in manifold/manifold-docs [\#245](https://github.com/ManifoldScholar/manifold/issues/245)

### Bugs

- Markdown ingestion fails if there's no stylesheet [\#399](https://github.com/ManifoldScholar/manifold/issues/399)
- HTML ingestion fails if there is no \<style\> tag in the document head. [\#397](https://github.com/ManifoldScholar/manifold/issues/397)
- If an API request triggers a fatal error \(500 or 404\), client app should return the correct status code. [\#396](https://github.com/ManifoldScholar/manifold/issues/396)
- Following page crashes when not logged in [\#391](https://github.com/ManifoldScholar/manifold/issues/391)
- Link to resource detail from activity feed is incorrect and 404s [\#380](https://github.com/ManifoldScholar/manifold/issues/380)
- Deleting a resource should trigger deletion of associated resource annotations [\#379](https://github.com/ManifoldScholar/manifold/issues/379)
- Project thumbnail is stretched on frontend [\#378](https://github.com/ManifoldScholar/manifold/issues/378)
- Removing text should destroy "TEXT\_CREATED" event [\#374](https://github.com/ManifoldScholar/manifold/issues/374)
- Removing a resource annotation doesn't remove it from margin until page reload. [\#373](https://github.com/ManifoldScholar/manifold/issues/373)
- Missing margin in backend project detail form [\#370](https://github.com/ManifoldScholar/manifold/issues/370)
- Project avatar thumbnail field is missing margin [\#369](https://github.com/ManifoldScholar/manifold/issues/369)
- Text in google doc ingestion is too small and not responsive [\#368](https://github.com/ManifoldScholar/manifold/issues/368)
- Manifold reader appears to apply default paragraph margin of 0 [\#366](https://github.com/ManifoldScholar/manifold/issues/366)
- Press logo doesn't show in backend after its set. [\#365](https://github.com/ManifoldScholar/manifold/issues/365)
- Metadata header on project page should not appear if a project has no metadata. [\#364](https://github.com/ManifoldScholar/manifold/issues/364)
- Unable to update text title in backend [\#362](https://github.com/ManifoldScholar/manifold/issues/362)
- SSR mismatch when enabling download link in Slide.Caption [\#354](https://github.com/ManifoldScholar/manifold/issues/354)
- Empty collections slideshow should be adjusted or hidden [\#353](https://github.com/ManifoldScholar/manifold/issues/353)
- Inconsistent scale of social icons on project hero [\#341](https://github.com/ManifoldScholar/manifold/issues/341)
- Ingestion builder does not remove text sections during reingestion [\#338](https://github.com/ManifoldScholar/manifold/issues/338)
- ProjectDetail.Texts reordering isn't working [\#336](https://github.com/ManifoldScholar/manifold/issues/336)
- Project images are converted to jpegs, don't allow transparent backgrounds [\#335](https://github.com/ManifoldScholar/manifold/issues/335)
- Move annotation and resource fetching to refactored Section container [\#331](https://github.com/ManifoldScholar/manifold/issues/331)
- Improve responsive behavior of backend header delete/preview buttons [\#327](https://github.com/ManifoldScholar/manifold/issues/327)
- Improve responsive behavior of backend date field [\#326](https://github.com/ManifoldScholar/manifold/issues/326)
- Entering an invalid project or text URL should 404 [\#319](https://github.com/ManifoldScholar/manifold/issues/319)
- Updating metadata on texts \(in backend\) doesn't save [\#317](https://github.com/ManifoldScholar/manifold/issues/317)
- Managing contributors on texts seems not to work. [\#316](https://github.com/ManifoldScholar/manifold/issues/316)
- Style issues on users list [\#313](https://github.com/ManifoldScholar/manifold/issues/313)
- Investigate why Manifold can't ingest this google doc [\#311](https://github.com/ManifoldScholar/manifold/issues/311)
- Typekit fonts should load \(if configured\) when SSR is absent [\#310](https://github.com/ManifoldScholar/manifold/issues/310)
- Footer text nav has incorrect top margin [\#308](https://github.com/ManifoldScholar/manifold/issues/308)
- Tags in dropdowns should be sorted alphabetically [\#307](https://github.com/ManifoldScholar/manifold/issues/307)
- Component FetchData methods should not be triggered by URL hash changes [\#304](https://github.com/ManifoldScholar/manifold/issues/304)
- Vertical alignment of mobile backend secondary nav is off by a few pixels [\#303](https://github.com/ManifoldScholar/manifold/issues/303)
- Model filter loses scope after validating paginated results [\#299](https://github.com/ManifoldScholar/manifold/issues/299)
- Variance in backend resource icon size [\#294](https://github.com/ManifoldScholar/manifold/issues/294)
- Backend project nav clips on smaller screens [\#293](https://github.com/ManifoldScholar/manifold/issues/293)
- Modal dialog buttons are missing a hover state [\#291](https://github.com/ManifoldScholar/manifold/issues/291)
- Changing pages in resources list breaks filters [\#288](https://github.com/ManifoldScholar/manifold/issues/288)
- Collection resource count shows all resources in project [\#287](https://github.com/ManifoldScholar/manifold/issues/287)
- Visibility nav overlaps TOC in reader \(on mobile screen\) [\#284](https://github.com/ManifoldScholar/manifold/issues/284)
- Form upload component does not remove attachment [\#266](https://github.com/ManifoldScholar/manifold/issues/266)
- Improve scroll behavior on route change [\#264](https://github.com/ManifoldScholar/manifold/issues/264)
- Filtering resource collections doesn't update URL params [\#257](https://github.com/ManifoldScholar/manifold/issues/257)
- Resource preview doesn't update when resource cube is highlighted in Firefox [\#256](https://github.com/ManifoldScholar/manifold/issues/256)
- Remove excess left margin in backend entity header [\#254](https://github.com/ManifoldScholar/manifold/issues/254)
- Add &rel=0 to Youtube video URLs to prevent related videos from displaying [\#253](https://github.com/ManifoldScholar/manifold/issues/253)
- Marginal resource thumbnails aren't displaying until hovering over the icon [\#252](https://github.com/ManifoldScholar/manifold/issues/252)
- Backend resource search input submit does not preventDefault [\#251](https://github.com/ManifoldScholar/manifold/issues/251)
- Issues parsing Manifold-Docs TOC [\#248](https://github.com/ManifoldScholar/manifold/issues/248)
- Ingesting Markdown Files fails if the sources include a zero k file. [\#247](https://github.com/ManifoldScholar/manifold/issues/247)
- CSS Validator throws an exception with invalid CSS [\#246](https://github.com/ManifoldScholar/manifold/issues/246)

**Accepted Pull Requests**

- \[F\] Refactor and improve ingestion; add specs [\#400](https://github.com/ManifoldScholar/manifold/pull/400) ([zdavis](https://github.com/zdavis))
- \[F\] Backend users can manage text stylesheets [\#395](https://github.com/ManifoldScholar/manifold/pull/395) ([zdavis](https://github.com/zdavis))
- \[B\] Make followed projects into a component [\#394](https://github.com/ManifoldScholar/manifold/pull/394) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Correct ProjectDetailGeneral test [\#386](https://github.com/ManifoldScholar/manifold/pull/386) ([zdavis](https://github.com/zdavis))
- \[B\] Fix missing margin in BackendProjectDetail form [\#377](https://github.com/ManifoldScholar/manifold/pull/377) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix Ruby linting issues [\#375](https://github.com/ManifoldScholar/manifold/pull/375) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Allow text title to be set in backend [\#363](https://github.com/ManifoldScholar/manifold/pull/363) ([zdavis](https://github.com/zdavis))
- \[F\] Add HTML ingestion strategy [\#361](https://github.com/ManifoldScholar/manifold/pull/361) ([zdavis](https://github.com/zdavis))
- \[B\] Makes date form field responsive [\#359](https://github.com/ManifoldScholar/manifold/pull/359) ([blnkt](https://github.com/blnkt))
- \[C\] Improve react-server console messages [\#358](https://github.com/ManifoldScholar/manifold/pull/358) ([zdavis](https://github.com/zdavis))
- \[B\] Destroy stale text sections on reingestion [\#357](https://github.com/ManifoldScholar/manifold/pull/357) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Enable download link and fix SSR mismatch [\#356](https://github.com/ManifoldScholar/manifold/pull/356) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Add fallback fonts [\#350](https://github.com/ManifoldScholar/manifold/pull/350) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix issue with project text position not updating [\#349](https://github.com/ManifoldScholar/manifold/pull/349) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Enable keyboard controls for modals [\#348](https://github.com/ManifoldScholar/manifold/pull/348) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix manifold attachments to preserve transparency [\#347](https://github.com/ManifoldScholar/manifold/pull/347) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Add snapshot tests for container components [\#346](https://github.com/ManifoldScholar/manifold/pull/346) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Upgrade Node to v6.10.3 [\#344](https://github.com/ManifoldScholar/manifold/pull/344) ([zdavis](https://github.com/zdavis))
- \[B\] Fix social icon sizing on project detail hero [\#342](https://github.com/ManifoldScholar/manifold/pull/342) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Footer text nav has incorrect top margin [\#340](https://github.com/ManifoldScholar/manifold/pull/340) ([naomiyaki](https://github.com/naomiyaki))
- \[F\] Improve ingestion UX; allow text reingestion [\#339](https://github.com/ManifoldScholar/manifold/pull/339) ([zdavis](https://github.com/zdavis))
- \[B\] Fixes issue with a text's contributors/authors not updating [\#337](https://github.com/ManifoldScholar/manifold/pull/337) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add project avatar selector to backend project view [\#334](https://github.com/ManifoldScholar/manifold/pull/334) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Correct firefox resource icon hover in FF [\#333](https://github.com/ManifoldScholar/manifold/pull/333) ([zdavis](https://github.com/zdavis))
- \[B\] Correct router refactor annotation regression [\#332](https://github.com/ManifoldScholar/manifold/pull/332) ([zdavis](https://github.com/zdavis))
- \[F\] Implement reader passage citation generator [\#330](https://github.com/ManifoldScholar/manifold/pull/330) ([zdavis](https://github.com/zdavis))
- \[B\] Move reader visibility to footer on mobile [\#324](https://github.com/ManifoldScholar/manifold/pull/324) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Make BE secondary nav scrollable [\#323](https://github.com/ManifoldScholar/manifold/pull/323) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Bump active background on BE list to the right [\#322](https://github.com/ManifoldScholar/manifold/pull/322) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Remove generic \<span\> styles in entity header [\#321](https://github.com/ManifoldScholar/manifold/pull/321) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix alignment in backend secondary nav [\#320](https://github.com/ManifoldScholar/manifold/pull/320) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Add hover states to modal buttons [\#318](https://github.com/ManifoldScholar/manifold/pull/318) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix variance in backend list icon size [\#315](https://github.com/ManifoldScholar/manifold/pull/315) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Sort resource tags alphabetically [\#314](https://github.com/ManifoldScholar/manifold/pull/314) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Ensure valid UTF-8 encoding for google doc ingestion [\#312](https://github.com/ManifoldScholar/manifold/pull/312) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Add tests for components [\#305](https://github.com/ManifoldScholar/manifold/pull/305) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Maintain scope for paginated result sets [\#301](https://github.com/ManifoldScholar/manifold/pull/301) ([zdavis](https://github.com/zdavis))
- \[F\] Implement comments on resource detail [\#296](https://github.com/ManifoldScholar/manifold/pull/296) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add job to fetch external video thumbnails [\#295](https://github.com/ManifoldScholar/manifold/pull/295) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Marginal resource thumbnails aren't displaying until hovering over the icon [\#292](https://github.com/ManifoldScholar/manifold/pull/292) ([zdavis](https://github.com/zdavis))
- \[B\] Fix resource count for collections [\#290](https://github.com/ManifoldScholar/manifold/pull/290) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix resource pagination losing filters [\#289](https://github.com/ManifoldScholar/manifold/pull/289) ([SMaxOwok](https://github.com/SMaxOwok))
- \[C\] Merge development fixes to master [\#279](https://github.com/ManifoldScholar/manifold/pull/279) ([zdavis](https://github.com/zdavis))
- \[B\] Correct attachment upload removal behavior [\#268](https://github.com/ManifoldScholar/manifold/pull/268) ([zdavis](https://github.com/zdavis))
- \[F\] Append collection resource filters as url params [\#265](https://github.com/ManifoldScholar/manifold/pull/265) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix ingestion of serialized body nodes [\#263](https://github.com/ManifoldScholar/manifold/pull/263) ([scryptmouse](https://github.com/scryptmouse))
- \[B\] Don't show related videos in youtube player [\#262](https://github.com/ManifoldScholar/manifold/pull/262) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Convert `TextSection\#body\_json` to JSONB [\#261](https://github.com/ManifoldScholar/manifold/pull/261) ([scryptmouse](https://github.com/scryptmouse))
- \[F\] Improve CSS Validator parsing [\#260](https://github.com/ManifoldScholar/manifold/pull/260) ([zdavis](https://github.com/zdavis))
- \[F\] Minor Markdown ingestion improvements [\#259](https://github.com/ManifoldScholar/manifold/pull/259) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Update project README [\#250](https://github.com/ManifoldScholar/manifold/pull/250) ([zdavis](https://github.com/zdavis))
- \[F\] Update Project README [\#249](https://github.com/ManifoldScholar/manifold/pull/249) ([zdavis](https://github.com/zdavis))
- \[F\] Add toggleable filters to backend search [\#232](https://github.com/ManifoldScholar/manifold/pull/232) ([SMaxOwok](https://github.com/SMaxOwok))

## [v0.1.3](https://github.com/ManifoldScholar/manifold/tree/v0.1.3) - 04/13/2017

### Bugs

- Recent event CSS changes broke mobile event layout [\#241](https://github.com/ManifoldScholar/manifold/issues/241)

### Other Revisions

- Missing Favicon in production env. [\#242](https://github.com/ManifoldScholar/manifold/issues/242)

### Accepted Pull Requests

- \[B\] Fix events list responsive regressions [\#244](https://github.com/ManifoldScholar/manifold/pull/244) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Add root dir detection in Gitbook ingestion [\#243](https://github.com/ManifoldScholar/manifold/pull/243) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add support for OAuth authentication [\#208](https://github.com/ManifoldScholar/manifold/pull/208) ([scryptmouse](https://github.com/scryptmouse))

## [v0.1.2](https://github.com/ManifoldScholar/manifold/tree/v0.1.2) - 04/08/2017

### Features

- Editors can manage project events in the backend [\#285](https://github.com/ManifoldScholar/manifold/issues/285)

### Bugs

- Night mode renders user links as white in the annotation drawer [\#226](https://github.com/ManifoldScholar/manifold/issues/226)

### Accepted Pull Requests

- \[F\]  Editors can manage project events in the backend [\#286](https://github.com/ManifoldScholar/manifold/pull/286) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix upload display in FF/Safari [\#240](https://github.com/ManifoldScholar/manifold/pull/240) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix Statistics caching / fetching [\#239](https://github.com/ManifoldScholar/manifold/pull/239) ([scryptmouse](https://github.com/scryptmouse))
- \[B\] Fix popup position in Firefox [\#238](https://github.com/ManifoldScholar/manifold/pull/238) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Remove text transition on resource previews [\#237](https://github.com/ManifoldScholar/manifold/pull/237) ([naomiyaki](https://github.com/naomiyaki))
- \[C\] Add Changelog to project [\#236](https://github.com/ManifoldScholar/manifold/pull/236) ([zdavis](https://github.com/zdavis))
- \[B\] Fix backend drawer scroll-to-bottom [\#235](https://github.com/ManifoldScholar/manifold/pull/235) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix mismatched resource icons [\#234](https://github.com/ManifoldScholar/manifold/pull/234) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Address lingering resource sub-kind issues [\#233](https://github.com/ManifoldScholar/manifold/pull/233) ([SMaxOwok](https://github.com/SMaxOwok))

## [v0.1.1](https://github.com/ManifoldScholar/manifold/tree/v0.1.1) - 04/06/2017

### Features

- Resource card tags should link to filtered resource list [\#572](https://github.com/ManifoldScholar/manifold/issues/572)

### Bugs

- The toggle on the light and dark schemes on touch displays requires two taps [\#225](https://github.com/ManifoldScholar/manifold/issues/225)

### Accepted Pull Requests

- \[F\] Upgrade react-router to v4; refactor fetchData [\#329](https://github.com/ManifoldScholar/manifold/pull/329) ([zdavis](https://github.com/zdavis))
- \[F\] Allow admin to change a user's role [\#231](https://github.com/ManifoldScholar/manifold/pull/231) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Reset default text color in dark reading mode [\#230](https://github.com/ManifoldScholar/manifold/pull/230) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix BG color on highlighted resource markers [\#222](https://github.com/ManifoldScholar/manifold/pull/222) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Only show FE mobile nav when logged in [\#221](https://github.com/ManifoldScholar/manifold/pull/221) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Correct pagination, slideshow nav, and BE form [\#220](https://github.com/ManifoldScholar/manifold/pull/220) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Store formatted attributes in Redis [\#219](https://github.com/ManifoldScholar/manifold/pull/219) ([scryptmouse](https://github.com/scryptmouse))
- \[F\] Improve project event list functionality [\#218](https://github.com/ManifoldScholar/manifold/pull/218) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add sub\_kind property to resources [\#204](https://github.com/ManifoldScholar/manifold/pull/204) ([SMaxOwok](https://github.com/SMaxOwok))

## [v0.1.0](https://github.com/ManifoldScholar/manifold/tree/v0.1.0) - 2017-04-04

Initial Release: A Manifold is Born!
