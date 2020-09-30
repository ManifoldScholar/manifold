# Changelog

## [v5.1.3](https://github.com/ManifoldScholar/manifold/tree/v5.1.3) - 09/30/20

### Features

-  Release v5.1.2 [#2844](https://github.com/ManifoldScholar/manifold/pull/2844) ([zdavis](https://api.github.com/users/zdavis))
-  Release v5.1.1 [#2834](https://github.com/ManifoldScholar/manifold/pull/2834) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Improve puma performance [#2854](https://github.com/ManifoldScholar/manifold/pull/2854) ([zdavis](https://api.github.com/users/zdavis))
-  Correct annotation and comment serialized abilities [#2842](https://github.com/ManifoldScholar/manifold/pull/2842) ([zdavis](https://api.github.com/users/zdavis))
-  Allow annotation comments when engagement is disabled [#2833](https://github.com/ManifoldScholar/manifold/pull/2833) ([zdavis](https://api.github.com/users/zdavis))


## [v5.1.1](https://github.com/ManifoldScholar/manifold/tree/v5.1.1) - 08/27/20

### Features

-  Upgrade Shrine and Rails [#2813](https://github.com/ManifoldScholar/manifold/pull/2813) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Render custom color scheme in SSR [#2827](https://github.com/ManifoldScholar/manifold/pull/2827) ([zdavis](https://api.github.com/users/zdavis))

### Security

-  Bump serialize-javascript from 2.1.2 to 3.1.0 [#2816](https://github.com/ManifoldScholar/manifold/pull/2816) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

## [v5.1.0](https://github.com/ManifoldScholar/manifold/tree/v5.1.0) - 08/11/20

### Features

-  Release v5.1.0 [#2815](https://github.com/ManifoldScholar/manifold/pull/2815) ([zdavis](https://api.github.com/users/zdavis))
-  Expose signup form at /signup [#2799](https://github.com/ManifoldScholar/manifold/pull/2799) ([zdavis](https://api.github.com/users/zdavis))
-  Include text metadata in ProjectExports [#2798](https://github.com/ManifoldScholar/manifold/pull/2798) ([zdavis](https://api.github.com/users/zdavis))
-  Add new project collection header styles [#2793](https://github.com/ManifoldScholar/manifold/pull/2793) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Add manifold:import:texts task [#2763](https://github.com/ManifoldScholar/manifold/pull/2763) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Improve collection request performance [#2812](https://github.com/ManifoldScholar/manifold/pull/2812) ([zdavis](https://api.github.com/users/zdavis))
-  Prevent accidental submit of confirm dialog [#2806](https://github.com/ManifoldScholar/manifold/pull/2806) ([zdavis](https://api.github.com/users/zdavis))
-  Allow HTML in PC header [#2805](https://github.com/ManifoldScholar/manifold/pull/2805) ([zdavis](https://api.github.com/users/zdavis))
-  Set name for users provisioned from Twitter [#2804](https://github.com/ManifoldScholar/manifold/pull/2804) ([zdavis](https://api.github.com/users/zdavis))
-  Fix minor PC header style bugs [#2803](https://github.com/ManifoldScholar/manifold/pull/2803) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Persists google OAuth BE settings [#2802](https://github.com/ManifoldScholar/manifold/pull/2802) ([zdavis](https://api.github.com/users/zdavis))
-  Exclude resources when hiding public annotations [#2801](https://github.com/ManifoldScholar/manifold/pull/2801) ([zdavis](https://api.github.com/users/zdavis))
-  Fix iframe height on detail view [#2800](https://github.com/ManifoldScholar/manifold/pull/2800) ([zdavis](https://api.github.com/users/zdavis))
-  Maintain author name order on frontend [#2791](https://github.com/ManifoldScholar/manifold/pull/2791) ([zdavis](https://api.github.com/users/zdavis))
-  Correct project collection pagination [#2770](https://github.com/ManifoldScholar/manifold/pull/2770) ([zdavis](https://api.github.com/users/zdavis))
-  Truncate project collection titles that are too long [#2790](https://github.com/ManifoldScholar/manifold/pull/2790) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Ensure resource icon is visible in the reader [#2779](https://github.com/ManifoldScholar/manifold/pull/2779) ([zdavis](https://api.github.com/users/zdavis))
-  Assign permissions to sources during ingestion [#2766](https://github.com/ManifoldScholar/manifold/pull/2766) ([zdavis](https://api.github.com/users/zdavis))

### Security

-  Bump elliptic from 6.5.2 to 6.5.3 in /client [#2797](https://github.com/ManifoldScholar/manifold/pull/2797) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump json from 2.2.0 to 2.3.1 in /api [#2795](https://github.com/ManifoldScholar/manifold/pull/2795) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump websocket-extensions from 0.1.4 to 0.1.5 in /api [#2771](https://github.com/ManifoldScholar/manifold/pull/2771) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump websocket-extensions from 0.1.3 to 0.1.4 in /client [#2775](https://github.com/ManifoldScholar/manifold/pull/2775) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump rack from 2.2.2 to 2.2.3 in /api [#2780](https://github.com/ManifoldScholar/manifold/pull/2780) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

## [v5.0.0](https://github.com/ManifoldScholar/manifold/tree/v5.0.0) - 05/28/20

### Features

-  Release v5.0.0 [#2761](https://github.com/ManifoldScholar/manifold/pull/2761) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Correct entitlement creation [#2758](https://github.com/ManifoldScholar/manifold/pull/2758) ([zdavis](https://api.github.com/users/zdavis))
-  Correct reader back menu [#2748](https://github.com/ManifoldScholar/manifold/pull/2748) ([zdavis](https://api.github.com/users/zdavis))
-  Restore collection project filter [#2747](https://github.com/ManifoldScholar/manifold/pull/2747) ([zdavis](https://api.github.com/users/zdavis))

### Security

-  Bump puma from 3.12.4 to 3.12.6 [#2753](https://github.com/ManifoldScholar/manifold/pull/2753) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

## [v5.0.0-rc.2](https://github.com/ManifoldScholar/manifold/tree/v5.0.0-rc.2) - 05/14/20

### Features

-  Release v5.0.0-rc.2 [#2746](https://github.com/ManifoldScholar/manifold/pull/2746) ([zdavis](https://api.github.com/users/zdavis))
-  Document Entitlements [#2716](https://github.com/ManifoldScholar/manifold/pull/2716) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Document SearchResult API endpoint [#2606](https://github.com/ManifoldScholar/manifold/pull/2606) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Add pagination to route response documentation [#2605](https://github.com/ManifoldScholar/manifold/pull/2605) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))

### Bugs

-  Handle unterminated quotation marks in search [#2745](https://github.com/ManifoldScholar/manifold/pull/2745) ([zdavis](https://api.github.com/users/zdavis))
-  Correct select input behavior [#2742](https://github.com/ManifoldScholar/manifold/pull/2742) ([zdavis](https://api.github.com/users/zdavis))

## [v5.0.0-rc.1](https://github.com/ManifoldScholar/manifold/tree/v5.0.0-rc.1) - 05/13/20

### Features

-  Release v5.0.0-rc.1 [#2740](https://github.com/ManifoldScholar/manifold/pull/2740) ([zdavis](https://api.github.com/users/zdavis))
-  Make content block references sortable [#2738](https://github.com/ManifoldScholar/manifold/pull/2738) ([zdavis](https://api.github.com/users/zdavis))
-  Support phrasal searching [#2695](https://github.com/ManifoldScholar/manifold/pull/2695) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Adds annotation and reading group restrictions [#2718](https://github.com/ManifoldScholar/manifold/pull/2718) ([zdavis](https://api.github.com/users/zdavis))
-  Support open &amp; restricted projects via entitlements [#2702](https://github.com/ManifoldScholar/manifold/pull/2702) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Exclude highlights from notification [#2739](https://github.com/ManifoldScholar/manifold/pull/2739) ([zdavis](https://api.github.com/users/zdavis))
-  Clear metadata attributes on editor refresh [#2736](https://github.com/ManifoldScholar/manifold/pull/2736) ([zdavis](https://api.github.com/users/zdavis))
-  Correct TOC CB text picker [#2735](https://github.com/ManifoldScholar/manifold/pull/2735) ([zdavis](https://api.github.com/users/zdavis))
-  Correct annotation link in search results [#2733](https://github.com/ManifoldScholar/manifold/pull/2733) ([zdavis](https://api.github.com/users/zdavis))
-  Improve dirty checking [#2728](https://github.com/ManifoldScholar/manifold/pull/2728) ([zdavis](https://api.github.com/users/zdavis))
-  Always show top bar on project if configured [#2725](https://github.com/ManifoldScholar/manifold/pull/2725) ([zdavis](https://api.github.com/users/zdavis))
-  Correct incorrect og:image URL [#2724](https://github.com/ManifoldScholar/manifold/pull/2724) ([zdavis](https://api.github.com/users/zdavis))
-  Correct radio button behavior and focus [#2723](https://github.com/ManifoldScholar/manifold/pull/2723) ([zdavis](https://api.github.com/users/zdavis))
-  Restore create and reorder to maker associations [#2722](https://github.com/ManifoldScholar/manifold/pull/2722) ([zdavis](https://api.github.com/users/zdavis))
-  Additional a11y fixes to Form.Picker [#2712](https://github.com/ManifoldScholar/manifold/pull/2712) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix wrapping on login button [#2713](https://github.com/ManifoldScholar/manifold/pull/2713) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Notify on new annotations; fix regressions [#2714](https://github.com/ManifoldScholar/manifold/pull/2714) ([zdavis](https://api.github.com/users/zdavis))
-  Improve handling of lowercase names [#2710](https://github.com/ManifoldScholar/manifold/pull/2710) ([zdavis](https://api.github.com/users/zdavis))
-  Update auth user state when notification changes [#2709](https://github.com/ManifoldScholar/manifold/pull/2709) ([zdavis](https://api.github.com/users/zdavis))
-  Improve stylesheet creation [#2707](https://github.com/ManifoldScholar/manifold/pull/2707) ([zdavis](https://api.github.com/users/zdavis))
-  Prevent error when FetchSelect has no options [#2691](https://github.com/ManifoldScholar/manifold/pull/2691) ([zdavis](https://api.github.com/users/zdavis))

### Security

-  Update rails to 5.2.4.2 [#2715](https://github.com/ManifoldScholar/manifold/pull/2715) ([zdavis](https://api.github.com/users/zdavis))
-  Bump minimist from 1.2.2 to 1.2.3 in /client [#2696](https://github.com/ManifoldScholar/manifold/pull/2696) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

## [v5.0.0-alpha.1](https://github.com/ManifoldScholar/manifold/tree/v5.0.0-alpha.1) - 03/30/20

### Features

-  Release v5.0.0-alpha.1 [#2690](https://github.com/ManifoldScholar/manifold/pull/2690) ([zdavis](https://api.github.com/users/zdavis))
-  Document ProjectExportations and ExportTargets routes [#2663](https://github.com/ManifoldScholar/manifold/pull/2663) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Allow disabling of library pages [#2657](https://github.com/ManifoldScholar/manifold/pull/2657) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Address background color conflict [#2689](https://github.com/ManifoldScholar/manifold/pull/2689) ([zdavis](https://api.github.com/users/zdavis))
-  Do not modify user styles on reingest [#2688](https://github.com/ManifoldScholar/manifold/pull/2688) ([zdavis](https://api.github.com/users/zdavis))
-  Deliver higher resolution custom logo [#2686](https://github.com/ManifoldScholar/manifold/pull/2686) ([zdavis](https://api.github.com/users/zdavis))
-  Respect EPUB dates with opf:event attributes [#2685](https://github.com/ManifoldScholar/manifold/pull/2685) ([zdavis](https://api.github.com/users/zdavis))
-  Correct FG color in reader resource drawer [#2684](https://github.com/ManifoldScholar/manifold/pull/2684) ([zdavis](https://api.github.com/users/zdavis))
-  Notify user when video playback fails [#2683](https://github.com/ManifoldScholar/manifold/pull/2683) ([zdavis](https://api.github.com/users/zdavis))
-  Use tabular numbers on audio player [#2682](https://github.com/ManifoldScholar/manifold/pull/2682) ([zdavis](https://api.github.com/users/zdavis))
-  Fix missing poster display on resource interactive slides [#2665](https://github.com/ManifoldScholar/manifold/pull/2665) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Correct contrast in BE reset PW interface [#2676](https://github.com/ManifoldScholar/manifold/pull/2676) ([zdavis](https://api.github.com/users/zdavis))
-  Correct form field label [#2675](https://github.com/ManifoldScholar/manifold/pull/2675) ([zdavis](https://api.github.com/users/zdavis))
-  Allow text subtitle to be cleared [#2674](https://github.com/ManifoldScholar/manifold/pull/2674) ([zdavis](https://api.github.com/users/zdavis))
-  Update SwaggerUi preAuth when user logs in [#2673](https://github.com/ManifoldScholar/manifold/pull/2673) ([zdavis](https://api.github.com/users/zdavis))
-  Exclude standalone projects from projects list [#2672](https://github.com/ManifoldScholar/manifold/pull/2672) ([zdavis](https://api.github.com/users/zdavis))
-  Delete callout when linked text is destroyed [#2671](https://github.com/ManifoldScholar/manifold/pull/2671) ([zdavis](https://api.github.com/users/zdavis))
-  Remove legacy centering method [#2664](https://github.com/ManifoldScholar/manifold/pull/2664) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Refactor FetchSelect [#2300](https://github.com/ManifoldScholar/manifold/pull/2300) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix filtering with invalid pagination params [#2651](https://github.com/ManifoldScholar/manifold/pull/2651) ([zdavis](https://api.github.com/users/zdavis))
-  Address list label regression [#2648](https://github.com/ManifoldScholar/manifold/pull/2648) ([zdavis](https://api.github.com/users/zdavis))
-  Correct typo [#2647](https://github.com/ManifoldScholar/manifold/pull/2647) ([zdavis](https://api.github.com/users/zdavis))
-  Address pre-v1 ingestion edge case [#2646](https://github.com/ManifoldScholar/manifold/pull/2646) ([zdavis](https://api.github.com/users/zdavis))
-  Persist stateful search keyword param in UI [#2644](https://github.com/ManifoldScholar/manifold/pull/2644) ([zdavis](https://api.github.com/users/zdavis))
-  Ensure correct text ordering in text CB [#2643](https://github.com/ManifoldScholar/manifold/pull/2643) ([zdavis](https://api.github.com/users/zdavis))
-  Restore ability to manage text covers [#2642](https://github.com/ManifoldScholar/manifold/pull/2642) ([zdavis](https://api.github.com/users/zdavis))

### Security

-  Bump minimist from 1.2.0 to 1.2.2 in /client [#2660](https://github.com/ManifoldScholar/manifold/pull/2660) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump acorn from 5.7.3 to 5.7.4 in /client [#2659](https://github.com/ManifoldScholar/manifold/pull/2659) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

### Accessibility

-  Improve a11y of DnD interfaces [#2658](https://github.com/ManifoldScholar/manifold/pull/2658) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v4.1.2](https://github.com/ManifoldScholar/manifold/tree/v4.1.2) - 03/06/20

### Features

-  Release v4.1.2 [#2641](https://github.com/ManifoldScholar/manifold/pull/2641) ([zdavis](https://api.github.com/users/zdavis))
-  Enhance exports user interface [#2630](https://github.com/ManifoldScholar/manifold/pull/2630) ([zdavis](https://api.github.com/users/zdavis))
-  Expose UI for project export &amp; preservation [#2598](https://github.com/ManifoldScholar/manifold/pull/2598) ([zdavis](https://api.github.com/users/zdavis))
-  Add API documentation [#2481](https://github.com/ManifoldScholar/manifold/pull/2481) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Handle destroyed referencables on CBRs [#2640](https://github.com/ManifoldScholar/manifold/pull/2640) ([zdavis](https://api.github.com/users/zdavis))
-  Improve annotation adoption [#2631](https://github.com/ManifoldScholar/manifold/pull/2631) ([zdavis](https://api.github.com/users/zdavis))
-  Support exporting legacy ingestion sources [#2626](https://github.com/ManifoldScholar/manifold/pull/2626) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Skip some invalid ingestion sources [#2624](https://github.com/ManifoldScholar/manifold/pull/2624) ([zdavis](https://api.github.com/users/zdavis))
-  Correct regression with vars in error messages [#2623](https://github.com/ManifoldScholar/manifold/pull/2623) ([zdavis](https://api.github.com/users/zdavis))
-  Fix backend list spacing bugs [#2614](https://github.com/ManifoldScholar/manifold/pull/2614) ([dananjohnson](https://api.github.com/users/dananjohnson))

### Security

-  Bump puma from 3.12.2 to 3.12.4 in /api [#2635](https://github.com/ManifoldScholar/manifold/pull/2635) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump rake from 12.3.0 to 13.0.1 [#2634](https://github.com/ManifoldScholar/manifold/pull/2634) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

## [v4.1.1](https://github.com/ManifoldScholar/manifold/tree/v4.1.1) - 02/04/20

### Features

-  Release v4.1.1 [#2608](https://github.com/ManifoldScholar/manifold/pull/2608) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Pad bottom of standalone header subtitle [#2595](https://github.com/ManifoldScholar/manifold/pull/2595) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix few focus indicators [#2602](https://github.com/ManifoldScholar/manifold/pull/2602) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix a11y issues with Form.HasMany [#2601](https://github.com/ManifoldScholar/manifold/pull/2601) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Adjust Notation.Marker click behavior [#2593](https://github.com/ManifoldScholar/manifold/pull/2593) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Correct event tile dates [#2600](https://github.com/ManifoldScholar/manifold/pull/2600) ([zdavis](https://api.github.com/users/zdavis))
-  Fix Form.Date focus color in FF [#2599](https://github.com/ManifoldScholar/manifold/pull/2599) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Prevent nil values for citations [#2597](https://github.com/ManifoldScholar/manifold/pull/2597) ([zdavis](https://api.github.com/users/zdavis))
-  Restore relationship on resources block [#2594](https://github.com/ManifoldScholar/manifold/pull/2594) ([zdavis](https://api.github.com/users/zdavis))
-  Fix color regressions [#2589](https://github.com/ManifoldScholar/manifold/pull/2589) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Use li tag for Event.Tile [#2582](https://github.com/ManifoldScholar/manifold/pull/2582) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v4.1.0](https://github.com/ManifoldScholar/manifold/tree/v4.1.0) - 01/21/20

### Features

-  Release v4.1.0 [#2576](https://github.com/ManifoldScholar/manifold/pull/2576) ([zdavis](https://api.github.com/users/zdavis))
-  Manifold accent color can be customized [#2568](https://github.com/ManifoldScholar/manifold/pull/2568) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Apply custom accent color to SSR [#2571](https://github.com/ManifoldScholar/manifold/pull/2571) ([zdavis](https://api.github.com/users/zdavis))
-  Enforce Lockbox master key length [#2570](https://github.com/ManifoldScholar/manifold/pull/2570) ([scryptmouse](https://api.github.com/users/scryptmouse))

## [v4.1.0-rc.1](https://github.com/ManifoldScholar/manifold/tree/v4.1.0-rc.1) - 01/16/20

### Features

-  Release v4.1.0-rc.1 [#2563](https://github.com/ManifoldScholar/manifold/pull/2563) ([zdavis](https://api.github.com/users/zdavis))

## [v4.1.0-beta.1](https://github.com/ManifoldScholar/manifold/tree/v4.1.0-beta.1) - 01/15/20

### Features

-  Release v4.1.0-beta.1 [#2561](https://github.com/ManifoldScholar/manifold/pull/2561) ([zdavis](https://api.github.com/users/zdavis))
-  Improve handling of invalid URIs during ingestion [#2553](https://github.com/ManifoldScholar/manifold/pull/2553) ([zdavis](https://api.github.com/users/zdavis))
-  Build service and expose API endpoints for pushing project packages to SFTP storage [#2484](https://github.com/ManifoldScholar/manifold/pull/2484) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Upgrade Node, Node module dependencies, and Ruby [#2526](https://github.com/ManifoldScholar/manifold/pull/2526) ([zdavis](https://api.github.com/users/zdavis))
-  Add service for packaging projects in accordance with the BagIt specification [#2476](https://github.com/ManifoldScholar/manifold/pull/2476) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Expose preliminary interface for enabling Epub export for specific texts [#2475](https://github.com/ManifoldScholar/manifold/pull/2475) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Document serializer property types to support upcoming API documentation [#2473](https://github.com/ManifoldScholar/manifold/pull/2473) ([zdavis](https://api.github.com/users/zdavis))
-  Give backend users the option of producing Epubs from Manifold texts [#2450](https://github.com/ManifoldScholar/manifold/pull/2450) ([scryptmouse](https://api.github.com/users/scryptmouse))

### Bugs

-  Add epubcheck jars [#2560](https://github.com/ManifoldScholar/manifold/pull/2560) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Correct color contrast on fatal error view [#2554](https://github.com/ManifoldScholar/manifold/pull/2554) ([zdavis](https://api.github.com/users/zdavis))
-  Return 401 for unauthenticated requests [#2521](https://github.com/ManifoldScholar/manifold/pull/2521) ([zdavis](https://api.github.com/users/zdavis))
-  Make project child authorizer more resilient [#2519](https://github.com/ManifoldScholar/manifold/pull/2519) ([zdavis](https://api.github.com/users/zdavis))
-  Ensure texts destroy their exports [#2509](https://github.com/ManifoldScholar/manifold/pull/2509) ([scryptmouse](https://api.github.com/users/scryptmouse))
-  Persist dirty form values when model updates [#2508](https://github.com/ManifoldScholar/manifold/pull/2508) ([zdavis](https://api.github.com/users/zdavis))
-  Decouple press bar content from standalone mode [#2507](https://github.com/ManifoldScholar/manifold/pull/2507) ([zdavis](https://api.github.com/users/zdavis))
-  Allow audio/x-wav mimetype [#2506](https://github.com/ManifoldScholar/manifold/pull/2506) ([zdavis](https://api.github.com/users/zdavis))
-  Restore fallback font to reader [#2505](https://github.com/ManifoldScholar/manifold/pull/2505) ([zdavis](https://api.github.com/users/zdavis))
-  Improve project logging [#2503](https://github.com/ManifoldScholar/manifold/pull/2503) ([zdavis](https://api.github.com/users/zdavis))
-  Restore height to annotation popup wrapper [#2499](https://github.com/ManifoldScholar/manifold/pull/2499) ([zdavis](https://api.github.com/users/zdavis))
-  Do not logout users when API is unavailable [#2502](https://github.com/ManifoldScholar/manifold/pull/2502) ([zdavis](https://api.github.com/users/zdavis))
-  Remove extraneous routes [#2498](https://github.com/ManifoldScholar/manifold/pull/2498) ([zdavis](https://api.github.com/users/zdavis))
-  Ensure attachment checksums are present [#2497](https://github.com/ManifoldScholar/manifold/pull/2497) ([zdavis](https://api.github.com/users/zdavis))
-  Camelize metadata properties for client [#2491](https://github.com/ManifoldScholar/manifold/pull/2491) ([zdavis](https://api.github.com/users/zdavis))

### Security

-  Bump handlebars from 4.2.0 to 4.5.3 in /client [#2501](https://github.com/ManifoldScholar/manifold/pull/2501) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump serialize-javascript from 2.1.0 to 2.1.1 in /client [#2477](https://github.com/ManifoldScholar/manifold/pull/2477) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump rack from 2.0.7 to 2.0.8 in /api [#2486](https://github.com/ManifoldScholar/manifold/pull/2486) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump puma from 3.12.1 to 3.12.2 [#2474](https://github.com/ManifoldScholar/manifold/pull/2474) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))




## [v4.0.2-rc.1](https://github.com/ManifoldScholar/manifold/tree/v4.0.2-rc.1) - 12/04/19

### Features

-  Relace clockwork and expose background dashboards [#2460](https://github.com/ManifoldScholar/manifold/pull/2460) ([zdavis](https://api.github.com/users/zdavis))
-  Improve API performance on large model collections [#2458](https://github.com/ManifoldScholar/manifold/pull/2458) ([zdavis](https://api.github.com/users/zdavis))
-  Expose text cover image in backend [#2419](https://github.com/ManifoldScholar/manifold/pull/2419) ([zdavis](https://api.github.com/users/zdavis))
-  Support animated gif attachments [#2414](https://github.com/ManifoldScholar/manifold/pull/2414) ([zdavis](https://api.github.com/users/zdavis))
-  Make EPUB3 TOC parsing more forgiving [#2397](https://github.com/ManifoldScholar/manifold/pull/2397) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Correctly serialize search result creator [#2465](https://github.com/ManifoldScholar/manifold/pull/2465) ([zdavis](https://api.github.com/users/zdavis))
-  Remove pagination from BE PC containers [#2463](https://github.com/ManifoldScholar/manifold/pull/2463) ([zdavis](https://api.github.com/users/zdavis))
-  Restore SSR of full text in reader [#2464](https://github.com/ManifoldScholar/manifold/pull/2464) ([zdavis](https://api.github.com/users/zdavis))
-  Rescue file not found exception in v3 upgrade [#2457](https://github.com/ManifoldScholar/manifold/pull/2457) ([zdavis](https://api.github.com/users/zdavis))
-  Add workaround for Windows CSV upload bug [#2423](https://github.com/ManifoldScholar/manifold/pull/2423) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve resource and project sorting [#2413](https://github.com/ManifoldScholar/manifold/pull/2413) ([zdavis](https://api.github.com/users/zdavis))
-  Style italics in project hero subtitles [#2407](https://github.com/ManifoldScholar/manifold/pull/2407) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix regression in Form.Switch layout [#2404](https://github.com/ManifoldScholar/manifold/pull/2404) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Revise ReadingGroupDetail placeholder [#2373](https://github.com/ManifoldScholar/manifold/pull/2373) ([dananjohnson](https://api.github.com/users/dananjohnson))

### Security

-  Bump loofah from 2.2.3 to 2.4.0 in /api [#2455](https://github.com/ManifoldScholar/manifold/pull/2455) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))
-  Bump rubyzip from 1.2.4 to 1.3.0 in /api [#2396](https://github.com/ManifoldScholar/manifold/pull/2396) ([dependabot[bot]](https://api.github.com/users/dependabot%5Bbot%5D))

### Accessibility

-  A11y improvements to BE project thumbnail components [#2442](https://github.com/ManifoldScholar/manifold/pull/2442) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Miscellaneous accessibility fixes [#2403](https://github.com/ManifoldScholar/manifold/pull/2403) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Additional contrast improvements [#2401](https://github.com/ManifoldScholar/manifold/pull/2401) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix color contrast to meet WCAG AA guidelines [#2383](https://github.com/ManifoldScholar/manifold/pull/2383) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix FE Project Collections placeholder [#2388](https://github.com/ManifoldScholar/manifold/pull/2388) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix focusability of event tiles [#2384](https://github.com/ManifoldScholar/manifold/pull/2384) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v4.0.1](https://github.com/ManifoldScholar/manifold/tree/v4.0.1) - 09/29/19

### Features

-  Support docker runtime environment [#2374](https://github.com/ManifoldScholar/manifold/pull/2374) ([zdavis](https://api.github.com/users/zdavis))

## [v4.0.0](https://github.com/ManifoldScholar/manifold/tree/v4.0.0) - 09/26/19

### Features

-  Backend users can download ingestion sources [#2334](https://github.com/ManifoldScholar/manifold/pull/2334) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Implement reading groups [#2339](https://github.com/ManifoldScholar/manifold/pull/2339) ([zdavis](https://api.github.com/users/zdavis))
-  Include JSON-LD metadata for Projects [#2332](https://github.com/ManifoldScholar/manifold/pull/2332) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Implement standalone mode [#2296](https://github.com/ManifoldScholar/manifold/pull/2296) ([zdavis](https://api.github.com/users/zdavis))
-  Replace Manifold icon font with SVGs [#2301](https://github.com/ManifoldScholar/manifold/pull/2301) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Refactor footer for use with plugin replacement components [#2154](https://github.com/ManifoldScholar/manifold/pull/2154) ([MollyJeanB](https://api.github.com/users/MollyJeanB))

### Bugs

-  Improve transitioning to and from standalone [#2366](https://github.com/ManifoldScholar/manifold/pull/2366) ([zdavis](https://api.github.com/users/zdavis))
-  Improve handling of unparsable maker names [#2364](https://github.com/ManifoldScholar/manifold/pull/2364) ([zdavis](https://api.github.com/users/zdavis))
-  Fix regressions in UIPanel transitions [#2361](https://github.com/ManifoldScholar/manifold/pull/2361) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix content block margins [#2358](https://github.com/ManifoldScholar/manifold/pull/2358) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Revise annotation markers [#2357](https://github.com/ManifoldScholar/manifold/pull/2357) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix react-transition-group regression in BE dialog [#2354](https://github.com/ManifoldScholar/manifold/pull/2354) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix react-transition-group style regression [#2351](https://github.com/ManifoldScholar/manifold/pull/2351) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix content block margin regression [#2330](https://github.com/ManifoldScholar/manifold/pull/2330) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix regressions in FE project hero styles [#2331](https://github.com/ManifoldScholar/manifold/pull/2331) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix implementation of radio button groups [#2328](https://github.com/ManifoldScholar/manifold/pull/2328) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve scroll-locking in drawers [#2319](https://github.com/ManifoldScholar/manifold/pull/2319) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Auto-fill columns for grid entity lists [#2318](https://github.com/ManifoldScholar/manifold/pull/2318) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix alignment regression in library header [#2314](https://github.com/ManifoldScholar/manifold/pull/2314) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix style issues in reader appearance drawer [#2315](https://github.com/ManifoldScholar/manifold/pull/2315) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Remove hyphenation from key text content [#2313](https://github.com/ManifoldScholar/manifold/pull/2313) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve Annotation.SourceSummary rendering [#2312](https://github.com/ManifoldScholar/manifold/pull/2312) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix padding between FE project content blocks [#2308](https://github.com/ManifoldScholar/manifold/pull/2308) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Don&#39;t preserve :focus-visible class in polyfill [#2311](https://github.com/ManifoldScholar/manifold/pull/2311) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Allow Elder as last name [#2272](https://github.com/ManifoldScholar/manifold/pull/2272) ([zdavis](https://api.github.com/users/zdavis))
-  Fix text-wrapping in search filters [#2231](https://github.com/ManifoldScholar/manifold/pull/2231) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Remove incorrect BE resource filter [#2228](https://github.com/ManifoldScholar/manifold/pull/2228) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix padding collapse on BE dashboard filters [#2226](https://github.com/ManifoldScholar/manifold/pull/2226) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Show overflow of project cover placeholders [#2225](https://github.com/ManifoldScholar/manifold/pull/2225) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Restore hero styles in project serializer [#2219](https://github.com/ManifoldScholar/manifold/pull/2219) ([zdavis](https://api.github.com/users/zdavis))
-  Improve SR experience for search forms [#2210](https://github.com/ManifoldScholar/manifold/pull/2210) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve SR experience for project lists [#2206](https://github.com/ManifoldScholar/manifold/pull/2206) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix PC Manual Collection bugs [#2205](https://github.com/ManifoldScholar/manifold/pull/2205) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Correct project collection project sorting [#2165](https://github.com/ManifoldScholar/manifold/pull/2165) ([zdavis](https://api.github.com/users/zdavis))
-  Fix incorrect icon prop value [#2197](https://github.com/ManifoldScholar/manifold/pull/2197) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix vertical alignment of list filter icon [#2196](https://github.com/ManifoldScholar/manifold/pull/2196) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix regression in mobile nav overlay [#2175](https://github.com/ManifoldScholar/manifold/pull/2175) ([dananjohnson](https://api.github.com/users/dananjohnson))

### Refactored

-  Minor CSS improvements to FE [#2369](https://github.com/ManifoldScholar/manifold/pull/2369) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Revise global padding for section containers [#2352](https://github.com/ManifoldScholar/manifold/pull/2352) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Revise notification styles [#2333](https://github.com/ManifoldScholar/manifold/pull/2333) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Create global ContentPlaceholder component [#2322](https://github.com/ManifoldScholar/manifold/pull/2322) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Replace remaining FE icon font instances [#2234](https://github.com/ManifoldScholar/manifold/pull/2234) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Replace labelId helper with react-uid [#2224](https://github.com/ManifoldScholar/manifold/pull/2224) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve usage of headings &amp; landmarks [#2200](https://github.com/ManifoldScholar/manifold/pull/2200) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve a11y of radio groups [#2199](https://github.com/ManifoldScholar/manifold/pull/2199) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Replace all icon font instances with SVG icons [#2113](https://github.com/ManifoldScholar/manifold/pull/2113) ([dananjohnson](https://api.github.com/users/dananjohnson))

### Accessibility

-  Improve color contrast for some FE buttons [#2362](https://github.com/ManifoldScholar/manifold/pull/2362) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve a11y of HasMany lists [#2298](https://github.com/ManifoldScholar/manifold/pull/2298) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve markup of file upload components [#2299](https://github.com/ManifoldScholar/manifold/pull/2299) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve a11y of ColorPicker &amp; KindPicker [#2297](https://github.com/ManifoldScholar/manifold/pull/2297) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve a11y of Utility.Toggle [#2291](https://github.com/ManifoldScholar/manifold/pull/2291) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix drawer close with keyboard [#2290](https://github.com/ManifoldScholar/manifold/pull/2290) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Revise focus styles [#2269](https://github.com/ManifoldScholar/manifold/pull/2269) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Accessibility improvements to reader, collapsed content, form controls [#2265](https://github.com/ManifoldScholar/manifold/pull/2265) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Use section element to wrap FE content blocks [#2264](https://github.com/ManifoldScholar/manifold/pull/2264) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Associate form inputs and instructions with &quot;aria-describedby&quot; [#2232](https://github.com/ManifoldScholar/manifold/pull/2232) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve a11y of Form.Date [#2233](https://github.com/ManifoldScholar/manifold/pull/2233) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Improve header nav accessibility [#2203](https://github.com/ManifoldScholar/manifold/pull/2203) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Revise alt-text for NoFollow graphic [#2211](https://github.com/ManifoldScholar/manifold/pull/2211) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v3.0.1](https://github.com/ManifoldScholar/manifold/tree/v3.0.1) - 08/22/19

### Features

-  Further relax user stylesheet validation [#2254](https://github.com/ManifoldScholar/manifold/pull/2254) ([zdavis](https://api.github.com/users/zdavis))
-  Do not exclude CSS from user stylesheets [#2245](https://github.com/ManifoldScholar/manifold/pull/2245) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Include middle names in collaborative concern [#2288](https://github.com/ManifoldScholar/manifold/pull/2288) ([zdavis](https://api.github.com/users/zdavis))
-  Correctly set text slugs during ingestion [#2281](https://github.com/ManifoldScholar/manifold/pull/2281) ([zdavis](https://api.github.com/users/zdavis))
-  Improve call-to-action absolute link behavior [#2274](https://github.com/ManifoldScholar/manifold/pull/2274) ([zdavis](https://api.github.com/users/zdavis))
-  Correctly handle hashes in manifest ingest URLs [#2243](https://github.com/ManifoldScholar/manifold/pull/2243) ([zdavis](https://api.github.com/users/zdavis))
-  Ensure early resource notations are visible [#2230](https://github.com/ManifoldScholar/manifold/pull/2230) ([zdavis](https://api.github.com/users/zdavis))
-  Format resource titles in BE lists [#2229](https://github.com/ManifoldScholar/manifold/pull/2229) ([zdavis](https://api.github.com/users/zdavis))
-  Prevent CTAs with deleted texts causing exceptions [#2222](https://github.com/ManifoldScholar/manifold/pull/2222) ([zdavis](https://api.github.com/users/zdavis))
-  Improve p. collection and project serialization [#2202](https://github.com/ManifoldScholar/manifold/pull/2202) ([zdavis](https://api.github.com/users/zdavis))
-  Fix hidden resource thumbnails [#2163](https://github.com/ManifoldScholar/manifold/pull/2163) ([ConnorChristensen](https://api.github.com/users/ConnorChristensen))
-  Fix IE11 content block issues [#2171](https://github.com/ManifoldScholar/manifold/pull/2171) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Handle deleted associations in content blocks [#2174](https://github.com/ManifoldScholar/manifold/pull/2174) ([zdavis](https://api.github.com/users/zdavis))
-  Fix typo in project general form [#2160](https://github.com/ManifoldScholar/manifold/pull/2160) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix citations not being generated on children [#2159](https://github.com/ManifoldScholar/manifold/pull/2159) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Open relative CTA links in same tab [#2153](https://github.com/ManifoldScholar/manifold/pull/2153) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Require paperclip migrator in missed files [#2152](https://github.com/ManifoldScholar/manifold/pull/2152) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Do not show collections link of no collections exist [#2143](https://github.com/ManifoldScholar/manifold/pull/2143) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Prevent hyphens in FE resource &amp; event tiles [#2142](https://github.com/ManifoldScholar/manifold/pull/2142) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Standardize FE project list markup [#2141](https://github.com/ManifoldScholar/manifold/pull/2141) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v3.0.0](https://github.com/ManifoldScholar/manifold/tree/v3.0.0) - 04/09/19

### Features

-  Generate thumbnail images for PDF resources [#2073](https://github.com/ManifoldScholar/manifold/pull/2073) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve performance for ingestions with many sources [#1955](https://github.com/ManifoldScholar/manifold/pull/1955) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Fix hero image credit link style [#2135](https://github.com/ManifoldScholar/manifold/pull/2135) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v3.0.0-rc.3](https://github.com/ManifoldScholar/manifold/tree/v3.0.0-rc.3) - 04/08/19

### Bugs

-  Reindex only one time during upgrade [#2133](https://github.com/ManifoldScholar/manifold/pull/2133) ([zdavis](https://api.github.com/users/zdavis))
-  Improve eager loading upgrade files [#2132](https://github.com/ManifoldScholar/manifold/pull/2132) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Set fixed columns on grid entity lists [#2131](https://github.com/ManifoldScholar/manifold/pull/2131) ([zdavis](https://api.github.com/users/zdavis))

## [v3.0.0-rc.2](https://github.com/ManifoldScholar/manifold/tree/v3.0.0-rc.2) - 04/08/19

### Features

-  Add publish toggle to feature list [#2115](https://github.com/ManifoldScholar/manifold/pull/2115) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add created by me filter to projects lists [#2121](https://github.com/ManifoldScholar/manifold/pull/2121) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Bugs

-  Fix typo in BE header [#2129](https://github.com/ManifoldScholar/manifold/pull/2129) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Use small project placeholder on dashboard [#2128](https://github.com/ManifoldScholar/manifold/pull/2128) ([zdavis](https://api.github.com/users/zdavis))
-  Remove noop from seed upgrade call [#2126](https://github.com/ManifoldScholar/manifold/pull/2126) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Stack filters vertically on narrow project list [#2125](https://github.com/ManifoldScholar/manifold/pull/2125) ([zdavis](https://api.github.com/users/zdavis))
-  Remove duplicate paths from icon svgs [#2124](https://github.com/ManifoldScholar/manifold/pull/2124) ([zdavis](https://api.github.com/users/zdavis))
-  Set max-width on PC drawer form [#2122](https://github.com/ManifoldScholar/manifold/pull/2122) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Use correct font in DatePicker [#2123](https://github.com/ManifoldScholar/manifold/pull/2123) ([dananjohnson](https://api.github.com/users/dananjohnson))

### Refactored

-  Standardize frontend event lists with single class &quot;event-list&quot; [#2127](https://github.com/ManifoldScholar/manifold/pull/2127) ([dananjohnson](https://api.github.com/users/dananjohnson))

## [v3.0.0-rc.1](https://github.com/ManifoldScholar/manifold/tree/v3.0.0-rc.1) - 04/04/19

### Features

-  Add empty message to entities list [#2096](https://github.com/ManifoldScholar/manifold/pull/2096) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove IP addresses and reduce API log verbosity [#2071](https://github.com/ManifoldScholar/manifold/pull/2071) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Refactor and redesign backend lists [#2075](https://github.com/ManifoldScholar/manifold/pull/2075) ([zdavis](https://api.github.com/users/zdavis))
-  Add Storybook to Manifold [#2069](https://github.com/ManifoldScholar/manifold/pull/2069) ([zdavis](https://api.github.com/users/zdavis))
-  Refactor and improve full text search [#1999](https://github.com/ManifoldScholar/manifold/pull/1999) ([zdavis](https://api.github.com/users/zdavis))
-  Improve reader dark mode styles [#2051](https://github.com/ManifoldScholar/manifold/pull/2051) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add keyboard accessibility to PC icon picker [#2050](https://github.com/ManifoldScholar/manifold/pull/2050) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve manifest start section identification [#2032](https://github.com/ManifoldScholar/manifold/pull/2032) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add logging to ScaffoldProjectContent [#1987](https://github.com/ManifoldScholar/manifold/pull/1987) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Automatically parse video URLs for video resources [#1983](https://github.com/ManifoldScholar/manifold/pull/1983) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Bump rails to 5.1.6.2 [#2019](https://github.com/ManifoldScholar/manifold/pull/2019) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Restrict first and last names to 50 characters [#1989](https://github.com/ManifoldScholar/manifold/pull/1989) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add new project setup questions [#1963](https://github.com/ManifoldScholar/manifold/pull/1963) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Admins can unsubscribe a user from notifications [#1945](https://github.com/ManifoldScholar/manifold/pull/1945) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve &#39;restart ingestion&#39; icon [#1966](https://github.com/ManifoldScholar/manifold/pull/1966) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve radio button UX design [#1962](https://github.com/ManifoldScholar/manifold/pull/1962) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add original publication date to texts meta [#1944](https://github.com/ManifoldScholar/manifold/pull/1944) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement project content block scaffolding [#1916](https://github.com/ManifoldScholar/manifold/pull/1916) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Make project placeholder SVG mobile responsive [#1930](https://github.com/ManifoldScholar/manifold/pull/1930) ([zdavis](https://api.github.com/users/zdavis))
-  Improve projects endpoint performance [#1891](https://github.com/ManifoldScholar/manifold/pull/1891) ([zdavis](https://api.github.com/users/zdavis))
-  Support keyboard movements for action callouts [#1888](https://github.com/ManifoldScholar/manifold/pull/1888) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Upgrade Rails from 5.0 to 5.1 [#1886](https://github.com/ManifoldScholar/manifold/pull/1886) ([zdavis](https://api.github.com/users/zdavis))
-  Improve manifest ingestion TOC control [#1863](https://github.com/ManifoldScholar/manifold/pull/1863) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add image credits to project hero [#1878](https://github.com/ManifoldScholar/manifold/pull/1878) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Make reader iframes responsive; support H5P embeds [#1861](https://github.com/ManifoldScholar/manifold/pull/1861) ([zdavis](https://api.github.com/users/zdavis))
-  Enable project page customization with content blocks [#1747](https://github.com/ManifoldScholar/manifold/pull/1747) ([zdavis](https://api.github.com/users/zdavis))
-  Allow drag/drop reording of texts, stylesheets [#1801](https://github.com/ManifoldScholar/manifold/pull/1801) ([zdavis](https://api.github.com/users/zdavis))
-  User can configure # of visible projects on HP for a given PC [#1791](https://github.com/ManifoldScholar/manifold/pull/1791) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add programatic project collection visibility [#1788](https://github.com/ManifoldScholar/manifold/pull/1788) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add DatePicker form component [#1795](https://github.com/ManifoldScholar/manifold/pull/1795) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Expose plugin and style override interfaces [#1755](https://github.com/ManifoldScholar/manifold/pull/1755) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Restore email search to users [#2112](https://github.com/ManifoldScholar/manifold/pull/2112) ([zdavis](https://api.github.com/users/zdavis))
-  Improve list filter state management [#2086](https://github.com/ManifoldScholar/manifold/pull/2086) ([zdavis](https://api.github.com/users/zdavis))
-  Fix layout of FE &amp; BE event tiles [#2100](https://github.com/ManifoldScholar/manifold/pull/2100) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix size of project block header icon [#2102](https://github.com/ManifoldScholar/manifold/pull/2102) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix font-family in BE dashboard stats [#2098](https://github.com/ManifoldScholar/manifold/pull/2098) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Add search back to reader notations drawer [#2092](https://github.com/ManifoldScholar/manifold/pull/2092) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix incorrect feedback on invalid login [#2089](https://github.com/ManifoldScholar/manifold/pull/2089) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add new project button back to dashboard [#2088](https://github.com/ManifoldScholar/manifold/pull/2088) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Include open_in_new_tab in pages serializer [#2072](https://github.com/ManifoldScholar/manifold/pull/2072) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix form radio label text colors [#2065](https://github.com/ManifoldScholar/manifold/pull/2065) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix Utility.Toggle test prop type error [#2061](https://github.com/ManifoldScholar/manifold/pull/2061) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix TextsBlock texts scoping [#2060](https://github.com/ManifoldScholar/manifold/pull/2060) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove italic styling from hero image credits [#2039](https://github.com/ManifoldScholar/manifold/pull/2039) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix backend drawer button widths [#2047](https://github.com/ManifoldScholar/manifold/pull/2047) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add margin to text subtitle in list item [#2045](https://github.com/ManifoldScholar/manifold/pull/2045) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Ignore attachment changes in resource versions [#2040](https://github.com/ManifoldScholar/manifold/pull/2040) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix incomplete content block icon [#2042](https://github.com/ManifoldScholar/manifold/pull/2042) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Show close text in backend drawers [#2011](https://github.com/ManifoldScholar/manifold/pull/2011) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add describedby text to user menu buttons [#2027](https://github.com/ManifoldScholar/manifold/pull/2027) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add aria-describedby to Utility.Toggle [#2023](https://github.com/ManifoldScholar/manifold/pull/2023) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix PC visibility toggle accessibility [#2018](https://github.com/ManifoldScholar/manifold/pull/2018) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Remove secondary skip-to links [#2005](https://github.com/ManifoldScholar/manifold/pull/2005) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Use label tags for form switch labels [#2015](https://github.com/ManifoldScholar/manifold/pull/2015) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix content block scaffold in dev data [#1998](https://github.com/ManifoldScholar/manifold/pull/1998) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Adjust list margins between button/content [#1993](https://github.com/ManifoldScholar/manifold/pull/1993) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix backend project list item accessibility [#2013](https://github.com/ManifoldScholar/manifold/pull/2013) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Overwrite invalid or expired cookies [#1991](https://github.com/ManifoldScholar/manifold/pull/1991) ([zdavis](https://api.github.com/users/zdavis))
-  Adjust project draft switch label text [#1990](https://github.com/ManifoldScholar/manifold/pull/1990) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Ensure upgrades run in prod env [#1985](https://github.com/ManifoldScholar/manifold/pull/1985) ([zdavis](https://api.github.com/users/zdavis))
-  Adjust permissions authorization [#1982](https://github.com/ManifoldScholar/manifold/pull/1982) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix content block HasMany form fields [#1977](https://github.com/ManifoldScholar/manifold/pull/1977) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Don&#39;t show warnings on pending blocks [#1978](https://github.com/ManifoldScholar/manifold/pull/1978) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix proptype error in Login component test [#1946](https://github.com/ManifoldScholar/manifold/pull/1946) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Exclude blank headers from Doc TOC generation [#1942](https://github.com/ManifoldScholar/manifold/pull/1942) ([zdavis](https://api.github.com/users/zdavis))
-  Generate PDF thumbnails [#1940](https://github.com/ManifoldScholar/manifold/pull/1940) ([zdavis](https://api.github.com/users/zdavis))
-  Remove tag eager loading from projects [#1939](https://github.com/ManifoldScholar/manifold/pull/1939) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix event preventing project destruction [#1937](https://github.com/ManifoldScholar/manifold/pull/1937) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix OAuth sessions not setting cookie [#1932](https://github.com/ManifoldScholar/manifold/pull/1932) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix issue with deleted log items throwing error [#1934](https://github.com/ManifoldScholar/manifold/pull/1934) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix video thumbnail attachments not saving [#1764](https://github.com/ManifoldScholar/manifold/pull/1764) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Correct body class application on SSR [#1929](https://github.com/ManifoldScholar/manifold/pull/1929) ([zdavis](https://api.github.com/users/zdavis))
-  Fix Reader crashing when updating notations [#1845](https://github.com/ManifoldScholar/manifold/pull/1845) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix OAuth login options text [#1905](https://github.com/ManifoldScholar/manifold/pull/1905) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix current content blocks cursor styles [#1909](https://github.com/ManifoldScholar/manifold/pull/1909) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  ActionCallout attachment does not generate styles during processing [#1919](https://github.com/ManifoldScholar/manifold/pull/1919) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix backend event tile styles [#1902](https://github.com/ManifoldScholar/manifold/pull/1902) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix TextsBlock not showing subtitles [#1901](https://github.com/ManifoldScholar/manifold/pull/1901) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix action callout list margin [#1894](https://github.com/ManifoldScholar/manifold/pull/1894) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Add missing indexes to schema [#1895](https://github.com/ManifoldScholar/manifold/pull/1895) ([zdavis](https://api.github.com/users/zdavis))
-  Load slideshow resources on all pages [#1887](https://github.com/ManifoldScholar/manifold/pull/1887) ([zdavis](https://api.github.com/users/zdavis))
-  Set default PC number of projects to 8 [#1889](https://github.com/ManifoldScholar/manifold/pull/1889) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Misc style fixes to project hero/content blocks [#1883](https://github.com/ManifoldScholar/manifold/pull/1883) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Prevent wrapping in activity statistics [#1879](https://github.com/ManifoldScholar/manifold/pull/1879) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Add styles to text cover attachments [#1875](https://github.com/ManifoldScholar/manifold/pull/1875) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Address project collection edit premature close [#1877](https://github.com/ManifoldScholar/manifold/pull/1877) ([zdavis](https://api.github.com/users/zdavis))
-  Address resource import form regressions [#1873](https://github.com/ManifoldScholar/manifold/pull/1873) ([zdavis](https://api.github.com/users/zdavis))
-  Fix proptypes on H5p component [#1866](https://github.com/ManifoldScholar/manifold/pull/1866) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Show dropzone background when no blocks [#1865](https://github.com/ManifoldScholar/manifold/pull/1865) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Replace outdated model name [#1867](https://github.com/ManifoldScholar/manifold/pull/1867) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix nginx conf template upstreams [#1860](https://github.com/ManifoldScholar/manifold/pull/1860) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Correct social footer links padding [#1829](https://github.com/ManifoldScholar/manifold/pull/1829) ([zdavis](https://api.github.com/users/zdavis))
-  Add missing type attribute to HasMany buttons [#1821](https://github.com/ManifoldScholar/manifold/pull/1821) ([zdavis](https://api.github.com/users/zdavis))
-  Fix type styles on backend text &amp; ordered record lists [#1819](https://github.com/ManifoldScholar/manifold/pull/1819) ([dananjohnson](https://api.github.com/users/dananjohnson))
-  Fix password generator throwing exception [#1793](https://github.com/ManifoldScholar/manifold/pull/1793) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Add focusOnMount functionality to Select/Radios [#1768](https://github.com/ManifoldScholar/manifold/pull/1768) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Errorable always looks at attributes [#1757](https://github.com/ManifoldScholar/manifold/pull/1757) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

### Refactored

-  Restore persistent project list states [#2111](https://github.com/ManifoldScholar/manifold/pull/2111) ([zdavis](https://api.github.com/users/zdavis))
-  Refactor DrawerHeader buttons [#2090](https://github.com/ManifoldScholar/manifold/pull/2090) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve ingestion UI [#2103](https://github.com/ManifoldScholar/manifold/pull/2103) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Dump STACSS and reorganize sass partials [#2070](https://github.com/ManifoldScholar/manifold/pull/2070) ([zdavis](https://api.github.com/users/zdavis))
-  Refactor activity stats to not use table [#2007](https://github.com/ManifoldScholar/manifold/pull/2007) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Refactor icons and IconComposer [#2030](https://github.com/ManifoldScholar/manifold/pull/2030) ([zdavis](https://api.github.com/users/zdavis))
-  Make Text#toc_section an AR relationship [#1869](https://github.com/ManifoldScholar/manifold/pull/1869) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Refactor drawer headers [#1810](https://github.com/ManifoldScholar/manifold/pull/1810) ([zdavis](https://api.github.com/users/zdavis))
-  Refactor component confirmation into HOC [#1772](https://github.com/ManifoldScholar/manifold/pull/1772) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement HOC to map form input options [#1754](https://github.com/ManifoldScholar/manifold/pull/1754) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

## [v2.1.2](https://github.com/ManifoldScholar/manifold/tree/v2.1.2) - 01/14/19

### Features

-  Refactor client search to use store [#1741](https://github.com/ManifoldScholar/manifold/pull/1741) ([zdavis](https://api.github.com/users/zdavis))

### Bugs

-  Fix typo in route component name [#1762](https://github.com/ManifoldScholar/manifold/pull/1762) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Address OAuth regression [#1742](https://github.com/ManifoldScholar/manifold/pull/1742) ([zdavis](https://api.github.com/users/zdavis))
-  Hide tweet fetching if not configured [#1739](https://github.com/ManifoldScholar/manifold/pull/1739) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Implement flagging on annotations [#1731](https://github.com/ManifoldScholar/manifold/pull/1731) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Display base model errors in FormContainer [#1678](https://github.com/ManifoldScholar/manifold/pull/1678) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Include env domain in webpack dev hosts [#1737](https://github.com/ManifoldScholar/manifold/pull/1737) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Exclude retweets in twitter fetch [#1732](https://github.com/ManifoldScholar/manifold/pull/1732) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix frontend header menu positions [#1730](https://github.com/ManifoldScholar/manifold/pull/1730) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve upload file name previews [#1710](https://github.com/ManifoldScholar/manifold/pull/1710) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Improve unauthenticated authorization [#1675](https://github.com/ManifoldScholar/manifold/pull/1675) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Don’t touch new projects on event creation [#1735](https://github.com/ManifoldScholar/manifold/pull/1735) ([zdavis](https://api.github.com/users/zdavis))
-  Fix FF dropdown option styles [#1711](https://github.com/ManifoldScholar/manifold/pull/1711) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Fix error boundary lifecycle usages [#1706](https://github.com/ManifoldScholar/manifold/pull/1706) ([SMaxOwok](https://api.github.com/users/SMaxOwok))

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

### Refactored

-  Reorganize client modules [#1694](https://github.com/ManifoldScholar/manifold/pull/1694) ([zdavis](https://api.github.com/users/zdavis))

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

### Refactored

-  Refactor and reorganize Annotatable [#1607](https://github.com/ManifoldScholar/manifold/pull/1607) ([zdavis](https://api.github.com/users/zdavis))

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

-  Report file conversion during ingestion [#1628](https://github.com/ManifoldScholar/manifold/pull/1628) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Use PredictiveInput on TagList component [#1626](https://github.com/ManifoldScholar/manifold/pull/1626) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Migrate Paperclip to Shrine for attachments [#1524](https://github.com/ManifoldScholar/manifold/pull/1524) ([SMaxOwok](https://api.github.com/users/SMaxOwok))
-  Link URLs in comments and annotations [#1545](https://github.com/ManifoldScholar/manifold/pull/1545) ([zdavis](https://api.github.com/users/zdavis))
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
-  Correct handling of encoded URIs in EPUBs [#797](https://github.com/ManifoldScholar/manifold/pull/797) ([zdavis](https://api.github.com/users/zdavis))