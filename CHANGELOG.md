# Changelog

## [9.2.9](https://github.com/ManifoldScholar/manifold/compare/10.0.0-beta...9.2.9) (2026-11-17)


### ⚠ BREAKING CHANGES

* upgrade react-router from v5 to v7

### Features

* add color picker; improve theme previews ([6837992](https://github.com/ManifoldScholar/manifold/commit/68379923803401ec33d4cb605258bdc673b05f27))
* add deep-linking API endpoints to client ([35d90ed](https://github.com/ManifoldScholar/manifold/commit/35d90eda3996d63b8abb51fda08ca9a2e58de4a1))
* add enforce canonical domain mechanism to client ([5090a17](https://github.com/ManifoldScholar/manifold/commit/5090a17c3fbe3cf6aa89f662e4d179054373d307))
* add explicit LTI registration support for additional LMSes ([349b8cf](https://github.com/ManifoldScholar/manifold/commit/349b8cfc2c54202c58720890af845c3c6bcda708))
* add extensible support for specific LTI platforms ([cef6006](https://github.com/ManifoldScholar/manifold/commit/cef60066a0f23981094b87ae906b5fe125d0bd5a))
* add fallback direct download for Google Doc ingestion ([8839897](https://github.com/ManifoldScholar/manifold/commit/883989735df98ebf17ef8624cfa395d81c90bd7e))
* add LTI course role and requested resource parsing ([44a02f0](https://github.com/ManifoldScholar/manifold/commit/44a02f04864bb018678dbf729aca3437f2f7fead))
* add LTI options to settings ([5e0b91f](https://github.com/ManifoldScholar/manifold/commit/5e0b91f4caa5888725da8bf9cc85886dbc4f2d2a))
* add Manifold OAI-PMH and directory settings ([8151379](https://github.com/ManifoldScholar/manifold/commit/8151379070b7d0601d32cd529a4f62a1418daf55))
* add parent to omniauth redirect params ([f041030](https://github.com/ManifoldScholar/manifold/commit/f041030e0927b68abc39a6f91e83c335071777da))
* allow cross-site LTI auth ([25d8bd7](https://github.com/ManifoldScholar/manifold/commit/25d8bd7ed2ff2ec614bddf07def8e4f45e3f1b09))
* attempt automatic redirect for LTI auth requests ([f1774b9](https://github.com/ManifoldScholar/manifold/commit/f1774b9720b74fd0d7ecda6b3c648329ea14c846))
* **auth:** autoconfirm email for omniauth users ([67ac21b](https://github.com/ManifoldScholar/manifold/commit/67ac21b46d7643e52ca6472153e0e2f148b3db31))
* **auth:** conditionally create LTI Deployment during registration ([3423664](https://github.com/ManifoldScholar/manifold/commit/342366415583d7d8887bd2e901003c111710a6c0))
* **auth:** finalize LTI OIDC flow and resource linking ([d5c1a89](https://github.com/ManifoldScholar/manifold/commit/d5c1a895bf84884f13c6e8648a4076515e328c2f))
* **auth:** handle LTI target_link_uri in omniauth strategy and callback ([82a8df1](https://github.com/ManifoldScholar/manifold/commit/82a8df14fc6c3a3ee9a088b4828d237e39612e20))
* **auth:** implement LTI JWKS caching ([eb48432](https://github.com/ManifoldScholar/manifold/commit/eb4843295ee6619a9819564b9a9791c2264db6ff))
* autoenroll LTI launch users in associated reading group, if exists ([ab2aff8](https://github.com/ManifoldScholar/manifold/commit/ab2aff8e93c2959617dcfeabcb65ccaffb64bf2d))
* change resource lists to display alphabetically by default ([402d8ec](https://github.com/ManifoldScholar/manifold/commit/402d8ec042fd91a0b7c38c4cd71a066cb63a8834))
* clear stored token after successful submission ([65f1d36](https://github.com/ManifoldScholar/manifold/commit/65f1d36f13fef5574c5f6f146560d2a285a905c3))
* **collecting:** refactor collecting modal into popover ([7868aec](https://github.com/ManifoldScholar/manifold/commit/7868aec530eb1db334eaf63c14521af18a32ffda))
* find or create LTI deployment records JIT on LTI auth ([9fffeb3](https://github.com/ManifoldScholar/manifold/commit/9fffeb3b3650ab8f89a26d08f058992e8264f0c9))
* implement LTI autodiscovery and registration ([f828e13](https://github.com/ManifoldScholar/manifold/commit/f828e1388fa0eb2d08304a0728470268d569c553))
* implement OIDC authentication ([cda3f09](https://github.com/ManifoldScholar/manifold/commit/cda3f09c89591e4f2993dac9673cc04dfbba494a))
* improve entitlement subject UI ([227d14e](https://github.com/ManifoldScholar/manifold/commit/227d14e763aab84d742b188d70d1bd8f9b4e3cfd))
* improve journal + project collection discoverability ([0d00ab5](https://github.com/ManifoldScholar/manifold/commit/0d00ab5e0ce2e1e9c691cd51323433b91b765128))
* **lti:** add LTI Deep Linking context handling ([64804f6](https://github.com/ManifoldScholar/manifold/commit/64804f611f51a92fe07abee9f657a0de94443f16))
* **lti:** clean up and finalize LTI DL reading group provisioning and enrollment ([30134c3](https://github.com/ManifoldScholar/manifold/commit/30134c3cb104701893d582dc2b9fb4f3fe0bde2c))
* **lti:** complete deep linking response flow ([7d440a1](https://github.com/ManifoldScholar/manifold/commit/7d440a1822aed1ad2a8abb1fee860585a7107ad3))
* **lti:** create LTI Course context ([abb4419](https://github.com/ManifoldScholar/manifold/commit/abb44194a24c244304d503c0996486bb4aec46b7))
* **lti:** implement deep linking handler ([3767fa7](https://github.com/ManifoldScholar/manifold/commit/3767fa7304e509e73007e7d2be23c75bcd12dd18))
* migrate admin dnd interfaces to pragmatic-drag-and-drop ([ecc00f8](https://github.com/ManifoldScholar/manifold/commit/ecc00f809934e00c6e336a5a9c65404f8ced3f22))
* modernize authorization UX ([4960d5e](https://github.com/ManifoldScholar/manifold/commit/4960d5e1910fc5177e65ad55e313d82e8cf8e86a))
* move routes to /lti/deep_linking ([4f0aff2](https://github.com/ManifoldScholar/manifold/commit/4f0aff276d8269ab574747637d3f40d518e21426))
* new Manifold editor features ([1147486](https://github.com/ManifoldScholar/manifold/commit/1147486195f8519f20ae09d7747238ca14a8061c))
* persist LTI registrations and deployments ([c02d568](https://github.com/ManifoldScholar/manifold/commit/c02d5681c06ed6a95e72e685a6958b0c855e913f))
* port LTI components + search helpers from framework mode ([ea07fcd](https://github.com/ManifoldScholar/manifold/commit/ea07fcd926bf47283f0ebf17c9d1a80caf64aa5a))
* port LTI routes from deep-linking ([5fd483e](https://github.com/ManifoldScholar/manifold/commit/5fd483eb94157fc9078d9bce2290db7ef9e18b44))
* port search refactor from deep-linking ([0b13ca0](https://github.com/ManifoldScholar/manifold/commit/0b13ca0bb352a4ba3ab0b51e2bcdfef2c117e1ec))
* provision reading group (if it doesn't exist) on LTI DL submission ([9e9567e](https://github.com/ManifoldScholar/manifold/commit/9e9567e6101b0fded49667ed54d407182d4d2d11))
* resources redesign ([c12238b](https://github.com/ManifoldScholar/manifold/commit/c12238b6da4317a5949560872b91dde574de6268))
* unify selection + session in single context ([b0ac9f5](https://github.com/ManifoldScholar/manifold/commit/b0ac9f5fc7de11de9ec0f53ce312ea0f91f23f8d))
* update LTI landing copy ([4ec369e](https://github.com/ManifoldScholar/manifold/commit/4ec369e471d5e054aaf530289ea6d71badfe5921))
* wire up submission to LMS ([7f726d8](https://github.com/ManifoldScholar/manifold/commit/7f726d899913dd5cffab088bd06e1db42ef03e94))


### Bug Fixes

* **a11y:** fix TOS page button contrast ([40a0ac3](https://github.com/ManifoldScholar/manifold/commit/40a0ac321ec98c4c4a465fd885e2929cba8c52ae))
* add all LTI redirect types to OAuth route ([667b103](https://github.com/ManifoldScholar/manifold/commit/667b103a86ab91a978ed713ac6e1f05242c80856))
* add form markup in reader resource drawer ([98cfc77](https://github.com/ManifoldScholar/manifold/commit/98cfc77d241011cea92eb43bb2180fa9dfb77268))
* add instructions + correct UI for user group entitlements on entity access pages ([9e429e0](https://github.com/ManifoldScholar/manifold/commit/9e429e09e7d0eb2f21eff4ae40cab340866e380d))
* add maker full name to collaborator; show in project hero ([762309a](https://github.com/ManifoldScholar/manifold/commit/762309af8cb4daf1da2137f5df291c27d06dacae))
* add missing reingest page title ([cae296e](https://github.com/ManifoldScholar/manifold/commit/cae296ebd176ebe14fda20135f17917bce607007))
* add withOptionalRouter hoc ([8b684e5](https://github.com/ManifoldScholar/manifold/commit/8b684e5a4719d35e8441326a254b2a8d4dc34382))
* address a11y issues in admin routes ([448ae04](https://github.com/ManifoldScholar/manifold/commit/448ae042477c19639a6ce1e9e35a409205ca3128))
* adjust see all logic on project collection homepage blade ([dd9c233](https://github.com/ManifoldScholar/manifold/commit/dd9c2331c48b735ce7f2f04a9a8c8b0b737fc5ff))
* **admin:** switch top bar color field to color input ([d00b24b](https://github.com/ManifoldScholar/manifold/commit/d00b24b658a0c976bb7fad0c63c9e3595d78bc0c))
* allow authors/editors to make resource annotations ([e207319](https://github.com/ManifoldScholar/manifold/commit/e207319cca7534faf1aaba856ec944b5c56a1d66))
* **api:** remove repeated inclusion of cookie middleware ([cd3a31b](https://github.com/ManifoldScholar/manifold/commit/cd3a31baa83fa20095cee46d9e98340ddea8b5b9))
* backport multi-drawer OutletWithDrawers from framework-mode ([8fa2c47](https://github.com/ManifoldScholar/manifold/commit/8fa2c47042bc7d77598af7db8c818b73f257bea2))
* check name safety of extracted files; skip on failure ([0a657ae](https://github.com/ManifoldScholar/manifold/commit/0a657aeba8398daf4e32c969836935da79243ef8))
* clean up ingestion tempfiles proactively ([fbf31e7](https://github.com/ManifoldScholar/manifold/commit/fbf31e7b49a4400caf3336271a24ee27cd68f1ad))
* convert project-collection Detail to OutletWithDrawers ([8fa2c47](https://github.com/ManifoldScholar/manifold/commit/8fa2c47042bc7d77598af7db8c818b73f257bea2))
* correct rebase syntax error in journal_serializer ([8e0ac95](https://github.com/ManifoldScholar/manifold/commit/8e0ac9593256e22ebb2ee7addeb3f1eeb9bfa8f5))
* do not check trusted user input for spam ([91396d0](https://github.com/ManifoldScholar/manifold/commit/91396d0a7989213cbc746539b1f5bace6579184e))
* do not submit spam checks for verified users ([edd444c](https://github.com/ManifoldScholar/manifold/commit/edd444cd8e6ab3a8a997ff890938e0a7b102fde3))
* DRY and fix MIME and extension check for image detection ([d712288](https://github.com/ManifoldScholar/manifold/commit/d712288f5808ac2616a659e30dcc87007d429dae))
* ensure alt field isn't cleared too eagerly ([2cd959d](https://github.com/ManifoldScholar/manifold/commit/2cd959d90d3838df422c1b47ee91cc9fbaf25054))
* ensure BodyClass has a single child ([3eec26a](https://github.com/ManifoldScholar/manifold/commit/3eec26adec5b5bee52d1357c5a2e42e18ed59ae3))
* ensure feature preview respects mode toggle ([48180a2](https://github.com/ManifoldScholar/manifold/commit/48180a2c1de211383b3a16ac1ddedd35c0028303))
* ensure project restricted access errors persist across multiple failed fetches ([03068c1](https://github.com/ManifoldScholar/manifold/commit/03068c1c6134009cc43b0c234daf1f3aa94e23a2))
* ensure resource collections sort filter uses title ([e6f7cf1](https://github.com/ManifoldScholar/manifold/commit/e6f7cf1d1b0bbf728ee6cdecdad9639c9fc95907))
* ensure section tooltip is above next section ([0928a37](https://github.com/ManifoldScholar/manifold/commit/0928a37c4faa6b9280ad712e28115c2c657d1302))
* ensure select elements are visible ([5c7ff0f](https://github.com/ManifoldScholar/manifold/commit/5c7ff0f4f3be3e19dd879d806573d75656623995))
* fix CSRF and CSP frame ancestor issues in omniauth ([a61962f](https://github.com/ManifoldScholar/manifold/commit/a61962fe99335aeff2870b685f47e1a39868d6d2))
* fix header subnav stacking order ([e83fcc8](https://github.com/ManifoldScholar/manifold/commit/e83fcc829a07a3791d9fbedfe4c1f45a3c5ce469))
* fix RC slideshow pagination dispatch error ([55bf7a3](https://github.com/ManifoldScholar/manifold/commit/55bf7a31b067def10b2231d6c9383c38123363e7))
* fix resource annotation link handler ([41a2955](https://github.com/ManifoldScholar/manifold/commit/41a29557438a4ef232b06431c4911e2ee2882bc5))
* fix resource caption/description display logic ([440af4a](https://github.com/ManifoldScholar/manifold/commit/440af4a1e76d5147b26da7b40725e0d7e3b76f50))
* fix resource sort order UX ([653ae1f](https://github.com/ManifoldScholar/manifold/commit/653ae1fe5bbaec192a9e783e08d3ab8204c4ee40))
* give annotation lists a default sort order ([5f30237](https://github.com/ManifoldScholar/manifold/commit/5f30237bacfc9456fd40aedd25e7dad4885adf3a))
* improve project restricted notification display in standalone mode ([8c01c0b](https://github.com/ManifoldScholar/manifold/commit/8c01c0b28c1e60cc4e001fb893b96bd96dd1e7dd))
* journals list library nav layout ([ec893f1](https://github.com/ManifoldScholar/manifold/commit/ec893f1013a45d4d8bbb053d5bf4d8ef008d70ae))
* match admin project list collaborator names to frontend ([ab2cbf4](https://github.com/ManifoldScholar/manifold/commit/ab2cbf44349e4f0ae034270a7aa8d8e6a7179d43))
* missing prop on uploaded video variants ([b6860bb](https://github.com/ManifoldScholar/manifold/commit/b6860bbf1c964a170b1ef38387fbac389be5ca49))
* move API request params to body ([2d306a2](https://github.com/ManifoldScholar/manifold/commit/2d306a26e6376736e11ff256b1c0509521337486))
* only load necessary collection projects on home page ([0da4b24](https://github.com/ManifoldScholar/manifold/commit/0da4b2441cbff8278103b8cb7c7b52aa0c38bcc2))
* pass keyword options to Dry::Initializer operations and errors ([6e667c2](https://github.com/ManifoldScholar/manifold/commit/6e667c26258e4b7139ccdcb8a140b6a141d315b6))
* pin swagger react version to 18.3 ([e043228](https://github.com/ManifoldScholar/manifold/commit/e043228c61a129655b7536297d62f50dceb5305c))
* preserve cover image and ingestion source original filenames ([b7098ab](https://github.com/ManifoldScholar/manifold/commit/b7098abbd5b088b04d2b43c9296ba016faa046ac))
* proxy robots.txt request ([592d900](https://github.com/ManifoldScholar/manifold/commit/592d900f7a2aaf0aaf6921d4ec74acf70a54a448))
* pull correct LTI DL context object from DL callback ([79a1618](https://github.com/ManifoldScholar/manifold/commit/79a16188d13fa00294e23ba65920a92750872781))
* **reader:** correctly derive iframe and video aspect ratio ([6e19951](https://github.com/ManifoldScholar/manifold/commit/6e199517a066d4148aa6f9e6796782d59b679d2f))
* **reader:** hydrate resource in annotation dialog ([3089b3d](https://github.com/ManifoldScholar/manifold/commit/3089b3dc0dbf58dd04a9d01fd6e12400573b2442))
* recalculate text fingerprint on text section or stylesheet change ([33d65c3](https://github.com/ManifoldScholar/manifold/commit/33d65c371b4b531665f41df33ad0e205af195fad))
* regression preventing errors not bound to an input from rendering ([13f0aa5](https://github.com/ManifoldScholar/manifold/commit/13f0aa5cd0634a3a8100ec0f3417124c9546535b))
* regression that reinstated ResourceDetail redux key via rebase ([ddc40fa](https://github.com/ManifoldScholar/manifold/commit/ddc40fa7f6fac79f1be03769c56e465c9643fd88))
* reinstate user groups route auth check ([b5d3edd](https://github.com/ManifoldScholar/manifold/commit/b5d3eddd24fc6cc2ea0c4c0f12232adf08da7703))
* remove constant redux keys from project collection drawers ([df2e75a](https://github.com/ManifoldScholar/manifold/commit/df2e75a6fd3df08e5d93fe5cf00fbd9449aa3571))
* remove extra selector bracket ([bf51a26](https://github.com/ManifoldScholar/manifold/commit/bf51a2608acaa98b508facd21af21f2aa5be246b))
* remove rebase artifact ([1c6157f](https://github.com/ManifoldScholar/manifold/commit/1c6157ffe074977a341436047493e290b6c0103d))
* remove remaining migrated useFetch constant redux keys ([84c6e6e](https://github.com/ManifoldScholar/manifold/commit/84c6e6eb4a08d836aaa5a6087015df48d6a2f8f2))
* render allowDownload field based on active type selection ([ae04021](https://github.com/ManifoldScholar/manifold/commit/ae0402119745968f67ae527fd06bf4962a6ea739))
* replace jsx extensions with js ([b0c0a56](https://github.com/ManifoldScholar/manifold/commit/b0c0a56a28afab9bc7b2220b818f1d46fc53fdbb))
* replace minio with seaweedfs in dev ([870f843](https://github.com/ManifoldScholar/manifold/commit/870f84320d1bcd85016f42d19b39580f7c30152d))
* **resources:** add null guard to render of image resource while processing ([03fea90](https://github.com/ManifoldScholar/manifold/commit/03fea90eae9a5473a42c16242ca5c20cef1e8336))
* **resources:** fix RC slideshow margin bug ([7542dc9](https://github.com/ManifoldScholar/manifold/commit/7542dc9311f0c02f381b556d4a958882fa4b491d))
* **resources:** pass slideshow request key correctly ([b729a72](https://github.com/ManifoldScholar/manifold/commit/b729a72afcbd0db7dc9df361d6413398c30bfeb4))
* rever react-router imports ([703055f](https://github.com/ManifoldScholar/manifold/commit/703055f7d086e6e974caa958b152e156a1433d68))
* revert Rack major version upgrade ([98a24a7](https://github.com/ManifoldScholar/manifold/commit/98a24a76f3e33fa24f480865f026192618130c26))
* scope reader resource create UI to permitted users ([7ef05a1](https://github.com/ManifoldScholar/manifold/commit/7ef05a1dec7f4f81ab0ad79f6e579d68765370f8))
* scope useFetch loop guard to a time window ([5563a42](https://github.com/ManifoldScholar/manifold/commit/5563a429da6f0bf26e15da739463d2d09080d601))
* set min gap between analytics chart ticks ([8a807f4](https://github.com/ManifoldScholar/manifold/commit/8a807f42098b7c73e8db8acb8b342e183b6bc198))
* set UserRow add/remove button label correctly ([0311b6d](https://github.com/ManifoldScholar/manifold/commit/0311b6d7b26c8b758e0d893472ad521b910c2efb))
* show first 3 ordered collaborators on project thumbnails ([fd5665c](https://github.com/ManifoldScholar/manifold/commit/fd5665c6138798f320b6c8546aec6e52c36674db))
* show unverified account warning in reader annotation drawers ([15368ea](https://github.com/ManifoldScholar/manifold/commit/15368ea1279569bb607ec0a1e77bc17f4b72e839))
* update admin redirect for /journals/issues ([b96a0d3](https://github.com/ManifoldScholar/manifold/commit/b96a0d33d29c92c205d919c00e507317384d1d30))
* update aria labels for alignment buttons ([1091781](https://github.com/ManifoldScholar/manifold/commit/10917818545e4d1464b79200b6836a9d759278ed))
* update navigation blocker behavior on form submit ([afe8b7e](https://github.com/ManifoldScholar/manifold/commit/afe8b7e53d946eb304d92e311f71bee62dde3f24))
* update pinned seaweedfs version ([1dc179b](https://github.com/ManifoldScholar/manifold/commit/1dc179b8f5a69387557fcad4b168459c7a96c800))
* use full url for video track ([07fa613](https://github.com/ManifoldScholar/manifold/commit/07fa613a85b74fd21d181a293b57a4ee08ebabde))
* various bug fixes + enhancements ([8f5104a](https://github.com/ManifoldScholar/manifold/commit/8f5104aa80d055a7df85df0d49a881b3b8ae0b2e))
* various small regressions + behavior improvements ([6416916](https://github.com/ManifoldScholar/manifold/commit/64169166ad5e9d1b0d9620a3bb28493f35692dd1))


### Miscellaneous Chores

* release 9.2.9 ([8c7a9b5](https://github.com/ManifoldScholar/manifold/commit/8c7a9b54dd976cc7e80f871fedf603d58d9c426c))


### Code Refactoring

* upgrade react-router from v5 to v7 ([d48c308](https://github.com/ManifoldScholar/manifold/commit/d48c30808bf86b8219d003d806091506713b1ef2))

## [10.0.0-beta](https://github.com/ManifoldScholar/manifold/compare/9.2.9...10.0.0-beta) (2026-10-28)


### ⚠ BREAKING CHANGES

* upgrade react-router from v5 to v7

### Features

* add color picker; improve theme previews ([7936990](https://github.com/ManifoldScholar/manifold/commit/79369904e49ba7e8f5fd98063da3e868f8cd8428))
* add deep-linking API endpoints to client ([c8dd62f](https://github.com/ManifoldScholar/manifold/commit/c8dd62f4c7c96817f30a3988ab3d854b0a08c633))
* add explicit LTI registration support for additional LMSes ([79d6e89](https://github.com/ManifoldScholar/manifold/commit/79d6e89c89d0887de892f9af046f6ce5484486c1))
* add extensible support for specific LTI platforms ([8164640](https://github.com/ManifoldScholar/manifold/commit/8164640fec83f5bdfeaef51e29e5640c6eebac06))
* add LTI course role and requested resource parsing ([f553a6d](https://github.com/ManifoldScholar/manifold/commit/f553a6d36a605b9e6df22bf8ebd8e858ae3ca671))
* add LTI options to settings ([dd9a285](https://github.com/ManifoldScholar/manifold/commit/dd9a285195187a56c73c4e95c6af0fd74691d853))
* add Manifold OAI-PMH and directory settings ([456f075](https://github.com/ManifoldScholar/manifold/commit/456f0750485d74f2d5bd22339e030b514f863c2a))
* add parent to omniauth redirect params ([e1e27a1](https://github.com/ManifoldScholar/manifold/commit/e1e27a1cab25095ed4494ea6e5b91f9c47f12591))
* allow cross-site LTI auth ([0586205](https://github.com/ManifoldScholar/manifold/commit/058620511be73842853aefce563bac164b0c8efe))
* attempt automatic redirect for LTI auth requests ([eb29bd3](https://github.com/ManifoldScholar/manifold/commit/eb29bd314371cd67d06e32fc8fae5a3594b2d1e4))
* **auth:** autoconfirm email for omniauth users ([603006d](https://github.com/ManifoldScholar/manifold/commit/603006de3075577b33c7e77bf898625598dd7f2b))
* **auth:** conditionally create LTI Deployment during registration ([2a017cf](https://github.com/ManifoldScholar/manifold/commit/2a017cff5b82330308396122ae0dca4c740b7c4d))
* **auth:** finalize LTI OIDC flow and resource linking ([b24236c](https://github.com/ManifoldScholar/manifold/commit/b24236c3827116fe05950f4bc8ed62b44ba1173c))
* **auth:** handle LTI target_link_uri in omniauth strategy and callback ([87fd790](https://github.com/ManifoldScholar/manifold/commit/87fd790af3a62ef275d4235d6913343826126b76))
* **auth:** implement LTI JWKS caching ([540db23](https://github.com/ManifoldScholar/manifold/commit/540db23a0d2a1ac7864175a5d2df9b65c1a82673))
* autoenroll LTI launch users in associated reading group, if exists ([19af52f](https://github.com/ManifoldScholar/manifold/commit/19af52fb2a760cdc0c6f8d05c325e850d8aeaa38))
* clear stored token after successful submission ([0cd129b](https://github.com/ManifoldScholar/manifold/commit/0cd129b00ce282a5e75cffe05562cb53355abc24))
* **collecting:** refactor collecting modal into popover ([2ed2ac1](https://github.com/ManifoldScholar/manifold/commit/2ed2ac1b8a9319f64b977aa9b5d19ed5ad405b89))
* find or create LTI deployment records JIT on LTI auth ([1103480](https://github.com/ManifoldScholar/manifold/commit/1103480a4b283f36dfc3fa235df452de3f3b911a))
* implement LTI autodiscovery and registration ([9391d2e](https://github.com/ManifoldScholar/manifold/commit/9391d2e6d2e21b9bb952b2a7dcc7356a2761649f))
* implement OIDC authentication ([d57349d](https://github.com/ManifoldScholar/manifold/commit/d57349de8fb32898cc8dd229483c472bfe0e4d5c))
* improve entitlement subject UI ([bc1e1de](https://github.com/ManifoldScholar/manifold/commit/bc1e1de39a45098708b666d6ac4740f7394cf258))
* improve journal + project collection discoverability ([cd1885e](https://github.com/ManifoldScholar/manifold/commit/cd1885efb0a614cb2eb2ddced8e828cfa462f502))
* **lti:** add LTI Deep Linking context handling ([2eb3ead](https://github.com/ManifoldScholar/manifold/commit/2eb3ead2911e242e4ead12e82e8b322f2f345f11))
* **lti:** clean up and finalize LTI DL reading group provisioning and enrollment ([1026510](https://github.com/ManifoldScholar/manifold/commit/1026510e70234e2687af68786b1efe2966044ec2))
* **lti:** complete deep linking response flow ([f29a542](https://github.com/ManifoldScholar/manifold/commit/f29a542f14ba13cd4b8eaddb5c1523a1fde81bf3))
* **lti:** create LTI Course context ([4c953af](https://github.com/ManifoldScholar/manifold/commit/4c953af033a809f807c3ef9fec877788c386cc20))
* **lti:** implement deep linking handler ([4081072](https://github.com/ManifoldScholar/manifold/commit/4081072a9b7e5ac0ec663924e24fea935222157d))
* migrate admin dnd interfaces to pragmatic-drag-and-drop ([5c92873](https://github.com/ManifoldScholar/manifold/commit/5c928733830422bae46fe3e63edb060bea699b15))
* modernize authorization UX ([5800559](https://github.com/ManifoldScholar/manifold/commit/58005591eac59ee0848d10f69190e92bdfbcf2ff))
* move routes to /lti/deep_linking ([64d8c15](https://github.com/ManifoldScholar/manifold/commit/64d8c15a14157a7f3346653269e96008c8bb49e7))
* new Manifold editor features ([12a5bd4](https://github.com/ManifoldScholar/manifold/commit/12a5bd415a534763e3e54a9c76b2e8033019d6eb))
* persist LTI registrations and deployments ([156ca51](https://github.com/ManifoldScholar/manifold/commit/156ca51ffc1f88de60f4a6d9d8407a01c7bdf539))
* port LTI components + search helpers from framework mode ([e47994d](https://github.com/ManifoldScholar/manifold/commit/e47994d1e65d74a391e9d585d3e1bcbdc6904d5a))
* port LTI routes from deep-linking ([35a843f](https://github.com/ManifoldScholar/manifold/commit/35a843f16027553afef38896da1c1ecc17c76a3c))
* port search refactor from deep-linking ([3ef2558](https://github.com/ManifoldScholar/manifold/commit/3ef25587b7f37c6f80317f005ee807a0766382c2))
* provision reading group (if it doesn't exist) on LTI DL submission ([1c5feb2](https://github.com/ManifoldScholar/manifold/commit/1c5feb29bec17be32b8479da68b03a4d0272a49c))
* resources redesign ([ee8e20b](https://github.com/ManifoldScholar/manifold/commit/ee8e20ba748150c19ffb242706e9a2e67f0727cd))
* unify selection + session in single context ([88a46fb](https://github.com/ManifoldScholar/manifold/commit/88a46fbff7b81782b604e00d4a63f50e97d2467e))
* update LTI landing copy ([9c83972](https://github.com/ManifoldScholar/manifold/commit/9c839720e42516f7264531ae99bd538772a7087a))
* wire up submission to LMS ([fb4aadc](https://github.com/ManifoldScholar/manifold/commit/fb4aadc017a768bf6a95a3bf80cae87045fa97eb))


### Bug Fixes

* **a11y:** fix TOS page button contrast ([49be039](https://github.com/ManifoldScholar/manifold/commit/49be03974316826c99e42c5a447ba0b4e37f97c1))
* add all LTI redirect types to OAuth route ([d2fce2e](https://github.com/ManifoldScholar/manifold/commit/d2fce2e3e02846aa4fc8e1ba6a55bfc142931c2d))
* add form markup in reader resource drawer ([f89b258](https://github.com/ManifoldScholar/manifold/commit/f89b25839a100a4475466549e787940dc8095452))
* add missing reingest page title ([26a7575](https://github.com/ManifoldScholar/manifold/commit/26a75752eba36747d3cf0f9bfe5a72a92c3eab51))
* address a11y issues in admin routes ([09e3696](https://github.com/ManifoldScholar/manifold/commit/09e3696efa42ea0c3efac607729b04a86f2388d2))
* **admin:** switch top bar color field to color input ([dfeec04](https://github.com/ManifoldScholar/manifold/commit/dfeec04fb2da1175fab3ae1c703634c82ba6c902))
* backport multi-drawer OutletWithDrawers from framework-mode ([7b576db](https://github.com/ManifoldScholar/manifold/commit/7b576dbf5184e66f87d16f73ef15b81694ef81c7))
* convert project-collection Detail to OutletWithDrawers ([7b576db](https://github.com/ManifoldScholar/manifold/commit/7b576dbf5184e66f87d16f73ef15b81694ef81c7))
* correct rebase syntax error in journal_serializer ([179551d](https://github.com/ManifoldScholar/manifold/commit/179551d50a3d7304f502ca3b6e89b0187ebf1091))
* ensure alt field isn't cleared too eagerly ([91615d4](https://github.com/ManifoldScholar/manifold/commit/91615d48b68627cea38d68203b8aec11de804a37))
* ensure BodyClass has a single child ([5c7003e](https://github.com/ManifoldScholar/manifold/commit/5c7003ea9ec83a20a3726f0390b8763c6b5c8641))
* ensure feature preview respects mode toggle ([70e2939](https://github.com/ManifoldScholar/manifold/commit/70e2939ed6e24ba13f95a43794cbef3b30486c1f))
* ensure resource collections sort filter uses title ([190b391](https://github.com/ManifoldScholar/manifold/commit/190b391ccfcdd2a410546745b902862ac22fb90d))
* ensure section tooltip is above next section ([3e418a1](https://github.com/ManifoldScholar/manifold/commit/3e418a194bf9b84fadd42ab38f8f77bfed952c6c))
* fix CSRF and CSP frame ancestor issues in omniauth ([536e378](https://github.com/ManifoldScholar/manifold/commit/536e378e8cacfb1701f79e08745767ebf3471662))
* fix RC slideshow pagination dispatch error ([55bf7a3](https://github.com/ManifoldScholar/manifold/commit/55bf7a31b067def10b2231d6c9383c38123363e7))
* fix resource annotation link handler ([d8c5c11](https://github.com/ManifoldScholar/manifold/commit/d8c5c11c662c43a88eb238203556b06b5294d0e2))
* fix resource caption/description display logic ([04981dd](https://github.com/ManifoldScholar/manifold/commit/04981dde9f4ef8f8b04fdddcff0bc85dec6648ee))
* journals list library nav layout ([f6d43f6](https://github.com/ManifoldScholar/manifold/commit/f6d43f662f9e0dee7372e4e4bc8014809b955c09))
* missing prop on uploaded video variants ([a8862ff](https://github.com/ManifoldScholar/manifold/commit/a8862ffc54e797469fd21c816c582e98e26b496d))
* pull correct LTI DL context object from DL callback ([fb43051](https://github.com/ManifoldScholar/manifold/commit/fb4305101a3beb9a466816f0fd7b2604461b6026))
* regression preventing errors not bound to an input from rendering ([5292428](https://github.com/ManifoldScholar/manifold/commit/52924284b0d151eba103f3374d8221da68749713))
* regression that reinstated ResourceDetail redux key via rebase ([82ba832](https://github.com/ManifoldScholar/manifold/commit/82ba832420cc3f9043a92c6b6a717c4054f333bf))
* reinstate user groups route auth check ([16ad495](https://github.com/ManifoldScholar/manifold/commit/16ad495bf8f77a20938d98afc3d162de30609b31))
* remove constant redux keys from project collection drawers ([0b1865a](https://github.com/ManifoldScholar/manifold/commit/0b1865a99aada9baf9de63a5c8831f9cd8fae58b))
* remove extra selector bracket ([277a602](https://github.com/ManifoldScholar/manifold/commit/277a6022798a938bc2939a243b85c2bc5b76e6a0))
* remove rebase artifact ([c347ac7](https://github.com/ManifoldScholar/manifold/commit/c347ac7118f852286348b40c10a9dbf37542bd3f))
* remove remaining migrated useFetch constant redux keys ([4e7a45c](https://github.com/ManifoldScholar/manifold/commit/4e7a45c3cbb8cbd7c4bbad42e56d9f64041fe089))
* render allowDownload field based on active type selection ([7790f41](https://github.com/ManifoldScholar/manifold/commit/7790f41bf28c3301992e3fa1aa94fe44a177d7d0))
* replace jsx extensions with js ([e83c9ef](https://github.com/ManifoldScholar/manifold/commit/e83c9efa773f6686eff6a1c6cc2d2d4fb4819624))
* **resources:** pass slideshow request key correctly ([1b50576](https://github.com/ManifoldScholar/manifold/commit/1b5057632cb3e82ce4e531b53df0ea67fffba94a))
* rever react-router imports ([7681751](https://github.com/ManifoldScholar/manifold/commit/76817516c96c526765b71937ac4145ccd1eb2dcf))
* revert Rack major version upgrade ([d804298](https://github.com/ManifoldScholar/manifold/commit/d804298eb0a0669d647cc60ae5da4a73b17cf309))
* scope reader resource create UI to permitted users ([427b939](https://github.com/ManifoldScholar/manifold/commit/427b939bdbc405954508d4acacaaebd4693f4962))
* set UserRow add/remove button label correctly ([f24bab6](https://github.com/ManifoldScholar/manifold/commit/f24bab64fe651cdfc63a16c765bc52f4c4169210))
* show unverified account warning in reader annotation drawers ([8b1b445](https://github.com/ManifoldScholar/manifold/commit/8b1b445d6a9ca9f74af1002e663f8dc143226f4b))
* update admin redirect for /journals/issues ([8360dc4](https://github.com/ManifoldScholar/manifold/commit/8360dc4bf123bfb8beacd4bda377b59c81fc4035))
* update aria labels for alignment buttons ([4ddf4f0](https://github.com/ManifoldScholar/manifold/commit/4ddf4f0a394584540ca60efca5f0ec95cf17d2c9))
* update navigation blocker behavior on form submit ([4b416fe](https://github.com/ManifoldScholar/manifold/commit/4b416fef39edda3030cb3a551cf80961c01c68b7))
* various bug fixes + enhancements ([738f3f7](https://github.com/ManifoldScholar/manifold/commit/738f3f76c7993118bce7bf3d749c1676a34a7817))
* various small regressions + behavior improvements ([bb20b6e](https://github.com/ManifoldScholar/manifold/commit/bb20b6e97e940805fe9597f8dfddb9a806ccf6f4))


### Code Refactoring

* upgrade react-router from v5 to v7 ([6404407](https://github.com/ManifoldScholar/manifold/commit/6404407014cc1c785fa397b2afd71d3de33e4454))


## [9.2.10](https://github.com/ManifoldScholar/manifold/compare/9.2.9...9.2.10) (2026-11-12)


### Bug Fixes

* fix RC slideshow pagination dispatch error ([55bf7a3](https://github.com/ManifoldScholar/manifold/commit/55bf7a31b067def10b2231d6c9383c38123363e7))
* scope useFetch loop guard to a time window ([5563a42](https://github.com/ManifoldScholar/manifold/commit/5563a429da6f0bf26e15da739463d2d09080d601))
* ensure select elements are visible ([5c7ff0f](https://github.com/ManifoldScholar/manifold/commit/5c7ff0f4f3be3e19dd879d806573d75656623995))
* **reader:** correctly derive iframe and video aspect ratio ([6e19951](https://github.com/ManifoldScholar/manifold/commit/6e199517a066d4148aa6f9e6796782d59b679d2f))

## [9.2.10-rc.2](https://github.com/ManifoldScholar/manifold/compare/9.2.10-rc.1...9.2.10-rc.2) (2026-11-12)


### Bug Fixes

* ensure select elements are visible ([5c7ff0f](https://github.com/ManifoldScholar/manifold/commit/5c7ff0f4f3be3e19dd879d806573d75656623995))

## [9.2.10-rc.1](https://github.com/ManifoldScholar/manifold/compare/9.2.10-rc...9.2.10-rc.1) (2026-11-05)


### Bug Fixes

* scope useFetch loop guard to a time window ([5563a42](https://github.com/ManifoldScholar/manifold/commit/5563a429da6f0bf26e15da739463d2d09080d601))

## [9.2.10-rc](https://github.com/ManifoldScholar/manifold/compare/9.2.9...9.2.10-rc) (2026-10-29)


### Bug Fixes

* fix RC slideshow pagination dispatch error ([55bf7a3](https://github.com/ManifoldScholar/manifold/commit/55bf7a31b067def10b2231d6c9383c38123363e7))

## [9.2.9](https://github.com/ManifoldScholar/manifold/compare/9.2.9-rc.1...9.2.9) (2026-10-15)


### Features

* change resource lists to display alphabetically by default ([402d8ec](https://github.com/ManifoldScholar/manifold/commit/402d8ec042fd91a0b7c38c4cd71a066cb63a8834))


### Miscellaneous Chores

* release 9.2.9 ([8c7a9b5](https://github.com/ManifoldScholar/manifold/commit/8c7a9b54dd976cc7e80f871fedf603d58d9c426c))

## [9.2.9-rc.1](https://github.com/ManifoldScholar/manifold/compare/9.2.9-rc...9.2.9-rc.1) (2026-10-13)


### Bug Fixes

* proxy robots.txt request ([592d900](https://github.com/ManifoldScholar/manifold/commit/592d900f7a2aaf0aaf6921d4ec74acf70a54a448))

## [9.2.9-rc](https://github.com/ManifoldScholar/manifold/compare/9.2.8...9.2.9-rc) (2026-10-12)


### Bug Fixes

* replace minio with seaweedfs in dev ([870f843](https://github.com/ManifoldScholar/manifold/commit/870f84320d1bcd85016f42d19b39580f7c30152d))
* update pinned seaweedfs version ([1dc179b](https://github.com/ManifoldScholar/manifold/commit/1dc179b8f5a69387557fcad4b168459c7a96c800))

## [9.2.8](https://github.com/ManifoldScholar/manifold/compare/9.2.7...9.2.8) (2026-09-21)


### Bug Fixes

* check name safety of extracted files; skip on failure ([0a657ae](https://github.com/ManifoldScholar/manifold/commit/0a657aeba8398daf4e32c969836935da79243ef8))

## [9.2.7](https://github.com/ManifoldScholar/manifold/compare/9.2.6...9.2.7) (2026-09-18)


### Bug Fixes

* fix resource sort order UX ([653ae1f](https://github.com/ManifoldScholar/manifold/commit/653ae1fe5bbaec192a9e783e08d3ab8204c4ee40))
* give annotation lists a default sort order ([5f30237](https://github.com/ManifoldScholar/manifold/commit/5f30237bacfc9456fd40aedd25e7dad4885adf3a))
* pass keyword options to Dry::Initializer operations and errors ([6e667c2](https://github.com/ManifoldScholar/manifold/commit/6e667c26258e4b7139ccdcb8a140b6a141d315b6))
* set min gap between analytics chart ticks ([8a807f4](https://github.com/ManifoldScholar/manifold/commit/8a807f42098b7c73e8db8acb8b342e183b6bc198))

## [9.2.6](https://github.com/ManifoldScholar/manifold/compare/9.2.5...9.2.6) (2026-09-15)


### Bug Fixes

* move API request params to body ([2d306a2](https://github.com/ManifoldScholar/manifold/commit/2d306a26e6376736e11ff256b1c0509521337486))

## [9.2.5](https://github.com/ManifoldScholar/manifold/compare/9.2.4...9.2.5) (2026-08-25)


### Bug Fixes

* **api:** remove repeated inclusion of cookie middleware ([cd3a31b](https://github.com/ManifoldScholar/manifold/commit/cd3a31baa83fa20095cee46d9e98340ddea8b5b9))

## [9.2.4](https://github.com/ManifoldScholar/manifold/compare/9.2.3...9.2.4) (2026-08-20)


### Bug Fixes

* allow authors/editors to make resource annotations ([e207319](https://github.com/ManifoldScholar/manifold/commit/e207319cca7534faf1aaba856ec944b5c56a1d66))
* do not submit spam checks for verified users ([edd444c](https://github.com/ManifoldScholar/manifold/commit/edd444cd8e6ab3a8a997ff890938e0a7b102fde3))

## [9.2.3](https://github.com/ManifoldScholar/manifold/compare/9.2.2...9.2.3) (2026-08-13)


### Bug Fixes

* recalculate text fingerprint on text section or stylesheet change ([33d65c3](https://github.com/ManifoldScholar/manifold/commit/33d65c371b4b531665f41df33ad0e205af195fad))

## [9.2.2](https://github.com/ManifoldScholar/manifold/compare/9.2.1...9.2.2) (2026-07-16)


### Bug Fixes

* clean up ingestion tempfiles proactively ([fbf31e7](https://github.com/ManifoldScholar/manifold/commit/fbf31e7b49a4400caf3336271a24ee27cd68f1ad))
* do not check trusted user input for spam ([91396d0](https://github.com/ManifoldScholar/manifold/commit/91396d0a7989213cbc746539b1f5bace6579184e))

## [9.2.1](https://github.com/ManifoldScholar/manifold/compare/9.2.0...9.2.1) (2026-07-09)


### Bug Fixes

* adjust see all logic on project collection homepage blade ([dd9c233](https://github.com/ManifoldScholar/manifold/commit/dd9c2331c48b735ce7f2f04a9a8c8b0b737fc5ff))
* match admin project list collaborator names to frontend ([ab2cbf4](https://github.com/ManifoldScholar/manifold/commit/ab2cbf44349e4f0ae034270a7aa8d8e6a7179d43))
* pin swagger react version to 18.3 ([e043228](https://github.com/ManifoldScholar/manifold/commit/e043228c61a129655b7536297d62f50dceb5305c))

## [9.2.0](https://github.com/ManifoldScholar/manifold/compare/9.1.0...9.2.0) (2026-07-02)


### Features

* add fallback direct download for Google Doc ingestion ([8839897](https://github.com/ManifoldScholar/manifold/commit/883989735df98ebf17ef8624cfa395d81c90bd7e))


### Bug Fixes

* DRY and fix MIME and extension check for image detection ([d712288](https://github.com/ManifoldScholar/manifold/commit/d712288f5808ac2616a659e30dcc87007d429dae))
* preserve cover image and ingestion source original filenames ([b7098ab](https://github.com/ManifoldScholar/manifold/commit/b7098abbd5b088b04d2b43c9296ba016faa046ac))

## [9.1.0](https://github.com/ManifoldScholar/manifold/compare/9.0.2...9.1.0) (2026-06-29)


### Features

* add enforce canonical domain mechanism to client ([5090a17](https://github.com/ManifoldScholar/manifold/commit/5090a17c3fbe3cf6aa89f662e4d179054373d307))


### Bug Fixes

* only load necessary collection projects on home page ([0da4b24](https://github.com/ManifoldScholar/manifold/commit/0da4b2441cbff8278103b8cb7c7b52aa0c38bcc2))

## [9.0.2](https://github.com/ManifoldScholar/manifold/compare/9.0.1...9.0.2) (2026-06-18)


### Bug Fixes

* add withOptionalRouter hoc ([8b684e5](https://github.com/ManifoldScholar/manifold/commit/8b684e5a4719d35e8441326a254b2a8d4dc34382))
* ensure project restricted access errors persist across multiple failed fetches ([03068c1](https://github.com/ManifoldScholar/manifold/commit/03068c1c6134009cc43b0c234daf1f3aa94e23a2))
* improve project restricted notification display in standalone mode ([8c01c0b](https://github.com/ManifoldScholar/manifold/commit/8c01c0b28c1e60cc4e001fb893b96bd96dd1e7dd))
* show first 3 ordered collaborators on project thumbnails ([fd5665c](https://github.com/ManifoldScholar/manifold/commit/fd5665c6138798f320b6c8546aec6e52c36674db))

## [9.0.1](https://github.com/ManifoldScholar/manifold/compare/9.0.0...9.0.1) (2026-06-11)


### Bug Fixes

* add instructions + correct UI for user group entitlements on entity access pages ([9e429e0](https://github.com/ManifoldScholar/manifold/commit/9e429e09e7d0eb2f21eff4ae40cab340866e380d))
* add maker full name to collaborator; show in project hero ([762309a](https://github.com/ManifoldScholar/manifold/commit/762309af8cb4daf1da2137f5df291c27d06dacae))
* use full url for video track ([07fa613](https://github.com/ManifoldScholar/manifold/commit/07fa613a85b74fd21d181a293b57a4ee08ebabde))
