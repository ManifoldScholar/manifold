# Change Log

## [v0.2.0](https://github.com/ManifoldScholar/manifold/tree/v0.2.0) (6/20/2017)
[Full Changelog](https://github.com/ManifoldScholar/manifold/compare/v0.1.3...v0.2.0)

**Features**

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

**Bugs**

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

## [v0.1.3](https://github.com/ManifoldScholar/manifold/tree/v0.1.3) (04/13/2017)
[Full Changelog](https://github.com/ManifoldScholar/manifold/compare/v0.1.2...v0.1.3)

**Bugs**

- Recent event CSS changes broke mobile event layout [\#241](https://github.com/ManifoldScholar/manifold/issues/241)

Other Revisions

- Missing Favicon in production env. [\#242](https://github.com/ManifoldScholar/manifold/issues/242)

**Accepted Pull Requests**

- \[B\] Fix events list responsive regressions [\#244](https://github.com/ManifoldScholar/manifold/pull/244) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Add root dir detection in Gitbook ingestion [\#243](https://github.com/ManifoldScholar/manifold/pull/243) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add support for OAuth authentication [\#208](https://github.com/ManifoldScholar/manifold/pull/208) ([scryptmouse](https://github.com/scryptmouse))

## [v0.1.2](https://github.com/ManifoldScholar/manifold/tree/v0.1.2) (04/08/2017)
[Full Changelog](https://github.com/ManifoldScholar/manifold/compare/v0.1.1...v0.1.2)

**Features**

- Editors can manage project events in the backend [\#285](https://github.com/ManifoldScholar/manifold/issues/285)

**Bugs**

- Night mode renders user links as white in the annotation drawer [\#226](https://github.com/ManifoldScholar/manifold/issues/226)

**Accepted Pull Requests**

- \[F\]  Editors can manage project events in the backend [\#286](https://github.com/ManifoldScholar/manifold/pull/286) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Fix upload display in FF/Safari [\#240](https://github.com/ManifoldScholar/manifold/pull/240) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix Statistics caching / fetching [\#239](https://github.com/ManifoldScholar/manifold/pull/239) ([scryptmouse](https://github.com/scryptmouse))
- \[B\] Fix popup position in Firefox [\#238](https://github.com/ManifoldScholar/manifold/pull/238) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Remove text transition on resource previews [\#237](https://github.com/ManifoldScholar/manifold/pull/237) ([naomiyaki](https://github.com/naomiyaki))
- \[C\] Add Changelog to project [\#236](https://github.com/ManifoldScholar/manifold/pull/236) ([zdavis](https://github.com/zdavis))
- \[B\] Fix backend drawer scroll-to-bottom [\#235](https://github.com/ManifoldScholar/manifold/pull/235) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix mismatched resource icons [\#234](https://github.com/ManifoldScholar/manifold/pull/234) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Address lingering resource sub-kind issues [\#233](https://github.com/ManifoldScholar/manifold/pull/233) ([SMaxOwok](https://github.com/SMaxOwok))

## [v0.1.1](https://github.com/ManifoldScholar/manifold/tree/v0.1.1) (04/06/2017)
[Full Changelog](https://github.com/ManifoldScholar/manifold/compare/v0.1.0...v0.1.1)

**Bugs**

- The toggle on the light and dark schemes on touch displays requires two taps [\#225](https://github.com/ManifoldScholar/manifold/issues/225)

**Accepted Pull Requests**

- \[F\] Upgrade react-router to v4; refactor fetchData [\#329](https://github.com/ManifoldScholar/manifold/pull/329) ([zdavis](https://github.com/zdavis))
- \[F\] Allow admin to change a user's role [\#231](https://github.com/ManifoldScholar/manifold/pull/231) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Reset default text color in dark reading mode [\#230](https://github.com/ManifoldScholar/manifold/pull/230) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Fix BG color on highlighted resource markers [\#222](https://github.com/ManifoldScholar/manifold/pull/222) ([SMaxOwok](https://github.com/SMaxOwok))
- \[B\] Only show FE mobile nav when logged in [\#221](https://github.com/ManifoldScholar/manifold/pull/221) ([naomiyaki](https://github.com/naomiyaki))
- \[B\] Correct pagination, slideshow nav, and BE form [\#220](https://github.com/ManifoldScholar/manifold/pull/220) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Store formatted attributes in Redis [\#219](https://github.com/ManifoldScholar/manifold/pull/219) ([scryptmouse](https://github.com/scryptmouse))
- \[F\] Improve project event list functionality [\#218](https://github.com/ManifoldScholar/manifold/pull/218) ([SMaxOwok](https://github.com/SMaxOwok))
- \[F\] Add sub\_kind property to resources [\#204](https://github.com/ManifoldScholar/manifold/pull/204) ([SMaxOwok](https://github.com/SMaxOwok))

## [v0.1.0](https://github.com/ManifoldScholar/manifold/tree/v0.1.0) (2017-04-04)

Initial Release: A Manifold is Born!


\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*
