# Changelog

## [9.2.9](https://github.com/ManifoldScholar/manifold/compare/10.0.0-beta.0...9.2.9) (2026-10-22)


### ⚠ BREAKING CHANGES

* upgrade react-router from v5 to v7

### Features

* add color picker; improve theme previews ([8482785](https://github.com/ManifoldScholar/manifold/commit/8482785f687c6dca4a7a65ff70f85f5003cf9fb5))
* add deep-linking API endpoints to client ([b1b8be5](https://github.com/ManifoldScholar/manifold/commit/b1b8be5e7f38dc04fe37d690f7d1da39395ebe0a))
* add enforce canonical domain mechanism to client ([5090a17](https://github.com/ManifoldScholar/manifold/commit/5090a17c3fbe3cf6aa89f662e4d179054373d307))
* add explicit LTI registration support for additional LMSes ([63dab54](https://github.com/ManifoldScholar/manifold/commit/63dab54a67430925d93af5792783a4b3186ff49e))
* add extensible support for specific LTI platforms ([6cd9408](https://github.com/ManifoldScholar/manifold/commit/6cd940891e389b14a47cb7fa5b2fd8dc9c4cbdac))
* add fallback direct download for Google Doc ingestion ([8839897](https://github.com/ManifoldScholar/manifold/commit/883989735df98ebf17ef8624cfa395d81c90bd7e))
* add LTI course role and requested resource parsing ([ae1df5d](https://github.com/ManifoldScholar/manifold/commit/ae1df5d30372d09017d57164809cfe507118d88c))
* add LTI options to settings ([c94b08b](https://github.com/ManifoldScholar/manifold/commit/c94b08baf8e7a9d1582ab3abcdb0aaf7943173a9))
* add Manifold OAI-PMH and directory settings ([3c8a942](https://github.com/ManifoldScholar/manifold/commit/3c8a942ef7ee4ae2d9e671cd34968e6b27b34d74))
* add parent to omniauth redirect params ([00ab9ad](https://github.com/ManifoldScholar/manifold/commit/00ab9ad14f8b0e8821a63db37f28f95b216ce92e))
* allow cross-site LTI auth ([ad31ec6](https://github.com/ManifoldScholar/manifold/commit/ad31ec65dd3359f96b109b22ce9a240cb27a0dcb))
* attempt automatic redirect for LTI auth requests ([8b2464b](https://github.com/ManifoldScholar/manifold/commit/8b2464b773033c3fc264bd3902ec874d537a83ec))
* **auth:** autoconfirm email for omniauth users ([c4ae088](https://github.com/ManifoldScholar/manifold/commit/c4ae088e67179a4f10e82a59668e9f745f4b19e7))
* **auth:** conditionally create LTI Deployment during registration ([108fc3d](https://github.com/ManifoldScholar/manifold/commit/108fc3d693f123f84baaef692a3d803270c7569f))
* **auth:** finalize LTI OIDC flow and resource linking ([e6b9551](https://github.com/ManifoldScholar/manifold/commit/e6b95513c4bc63b8f31c28b566680e4a12d132b8))
* **auth:** handle LTI target_link_uri in omniauth strategy and callback ([69b3cff](https://github.com/ManifoldScholar/manifold/commit/69b3cff12cd263264ffa5ac81a84ec7621797f18))
* **auth:** implement LTI JWKS caching ([2e82e3b](https://github.com/ManifoldScholar/manifold/commit/2e82e3b4965edcd796c699b12c790b999283b725))
* autoenroll LTI launch users in associated reading group, if exists ([2f99edf](https://github.com/ManifoldScholar/manifold/commit/2f99edf28609ad226188f81e6b6afde059ef68b0))
* change resource lists to display alphabetically by default ([402d8ec](https://github.com/ManifoldScholar/manifold/commit/402d8ec042fd91a0b7c38c4cd71a066cb63a8834))
* clear stored token after successful submission ([ccb4c48](https://github.com/ManifoldScholar/manifold/commit/ccb4c48dae420a9890f8891b4799ce80a015a037))
* find or create LTI deployment records JIT on LTI auth ([f51533c](https://github.com/ManifoldScholar/manifold/commit/f51533c0407dac315f1e66996b9bd0ab87952634))
* implement LTI autodiscovery and registration ([8dff9dd](https://github.com/ManifoldScholar/manifold/commit/8dff9dd8172a67ba9c64b6b41d4e2f13d53d717b))
* implement OIDC authentication ([15678e0](https://github.com/ManifoldScholar/manifold/commit/15678e02cf9bccf40c605b04efaef6817cd0c1ef))
* improve entitlement subject UI ([89cb6d1](https://github.com/ManifoldScholar/manifold/commit/89cb6d1ceb12a15fcf9e37e93c08d3cf81f49b5e))
* improve journal + project collection discoverability ([5a23788](https://github.com/ManifoldScholar/manifold/commit/5a23788a9db334aaa205dfa76270ef33dc8a5e66))
* **lti:** add LTI Deep Linking context handling ([baa0b33](https://github.com/ManifoldScholar/manifold/commit/baa0b33d598adf4a48bb7ee51096340b7a28656b))
* **lti:** clean up and finalize LTI DL reading group provisioning and enrollment ([8413e64](https://github.com/ManifoldScholar/manifold/commit/8413e640789a96cabfd4a885850c351596cb0ad2))
* **lti:** complete deep linking response flow ([fb7d868](https://github.com/ManifoldScholar/manifold/commit/fb7d8685b89011bb63148d5dd3741369e86c30d3))
* **lti:** create LTI Course context ([37d05ca](https://github.com/ManifoldScholar/manifold/commit/37d05ca389a1c02035da1569a968de5632084db7))
* **lti:** implement deep linking handler ([3adc8ae](https://github.com/ManifoldScholar/manifold/commit/3adc8ae639f55140013db2cf6f8adb3e9ac12130))
* migrate admin dnd interfaces to pragmatic-drag-and-drop ([ef75f88](https://github.com/ManifoldScholar/manifold/commit/ef75f88c571fb1aafbc692c03c8ba95230222a17))
* modernize authorization UX ([31d25a7](https://github.com/ManifoldScholar/manifold/commit/31d25a7caaa1cfe8ebf06b544f272d4ab7357d5b))
* move routes to /lti/deep_linking ([189a22a](https://github.com/ManifoldScholar/manifold/commit/189a22acb2a79be097a844cd6d99f9fa6de56095))
* new Manifold editor features ([e50a1fb](https://github.com/ManifoldScholar/manifold/commit/e50a1fb7398be5e34cc59f727d807becb0888d4d))
* persist LTI registrations and deployments ([b68ea98](https://github.com/ManifoldScholar/manifold/commit/b68ea9804acfc84b618ef1960d13adc03d2320e5))
* port LTI components + search helpers from framework mode ([d647a28](https://github.com/ManifoldScholar/manifold/commit/d647a28af464a97df4018b8e8f1826ce207e9df9))
* port LTI routes from deep-linking ([1a868be](https://github.com/ManifoldScholar/manifold/commit/1a868be6e55c5faa007419ebf784962ddf883288))
* port search refactor from deep-linking ([5fc6d1e](https://github.com/ManifoldScholar/manifold/commit/5fc6d1e39b76d5648815986077321f319b72820f))
* provision reading group (if it doesn't exist) on LTI DL submission ([22a4623](https://github.com/ManifoldScholar/manifold/commit/22a4623e6c018c637376e959ea4ec4e014768699))
* resources redesign ([02149cb](https://github.com/ManifoldScholar/manifold/commit/02149cb5d930a381a848ae8586de24b13bcf54a7))
* unify selection + session in single context ([cfc03c6](https://github.com/ManifoldScholar/manifold/commit/cfc03c604d0d9a9fe983fec360fb2eecdb759062))
* update LTI landing copy ([5a0fe0c](https://github.com/ManifoldScholar/manifold/commit/5a0fe0ca1cda1a5736a3f526c9935abae5ce89a8))
* wire up submission to LMS ([5d21554](https://github.com/ManifoldScholar/manifold/commit/5d2155421fc1e83a9003b867d5d1c985eb003342))


### Bug Fixes

* add all LTI redirect types to OAuth route ([b04bdb3](https://github.com/ManifoldScholar/manifold/commit/b04bdb3a7fac3fb1253974028a61eec5cb5bb959))
* add form markup in reader resource drawer ([b3986ea](https://github.com/ManifoldScholar/manifold/commit/b3986ea2c54cb8bec7a7077d20195b7b7e8dfe84))
* add instructions + correct UI for user group entitlements on entity access pages ([9e429e0](https://github.com/ManifoldScholar/manifold/commit/9e429e09e7d0eb2f21eff4ae40cab340866e380d))
* add maker full name to collaborator; show in project hero ([762309a](https://github.com/ManifoldScholar/manifold/commit/762309af8cb4daf1da2137f5df291c27d06dacae))
* add missing reingest page title ([6687bc2](https://github.com/ManifoldScholar/manifold/commit/6687bc2eaff17b1140823861b45f2306e3a840c9))
* add withOptionalRouter hoc ([8b684e5](https://github.com/ManifoldScholar/manifold/commit/8b684e5a4719d35e8441326a254b2a8d4dc34382))
* address a11y issues in admin routes ([a7bc52d](https://github.com/ManifoldScholar/manifold/commit/a7bc52d0c82709bf9ed62355d6c81486d3db2c48))
* adjust see all logic on project collection homepage blade ([dd9c233](https://github.com/ManifoldScholar/manifold/commit/dd9c2331c48b735ce7f2f04a9a8c8b0b737fc5ff))
* allow authors/editors to make resource annotations ([e207319](https://github.com/ManifoldScholar/manifold/commit/e207319cca7534faf1aaba856ec944b5c56a1d66))
* **api:** remove repeated inclusion of cookie middleware ([cd3a31b](https://github.com/ManifoldScholar/manifold/commit/cd3a31baa83fa20095cee46d9e98340ddea8b5b9))
* backport multi-drawer OutletWithDrawers from framework-mode ([faf66c7](https://github.com/ManifoldScholar/manifold/commit/faf66c70938b328829bdd81aabb7d0f6e968d193))
* check name safety of extracted files; skip on failure ([0a657ae](https://github.com/ManifoldScholar/manifold/commit/0a657aeba8398daf4e32c969836935da79243ef8))
* clean up ingestion tempfiles proactively ([fbf31e7](https://github.com/ManifoldScholar/manifold/commit/fbf31e7b49a4400caf3336271a24ee27cd68f1ad))
* convert project-collection Detail to OutletWithDrawers ([faf66c7](https://github.com/ManifoldScholar/manifold/commit/faf66c70938b328829bdd81aabb7d0f6e968d193))
* correct rebase syntax error in journal_serializer ([dea0ba2](https://github.com/ManifoldScholar/manifold/commit/dea0ba2ee883890df943a936b9b07406dfb93a25))
* do not check trusted user input for spam ([91396d0](https://github.com/ManifoldScholar/manifold/commit/91396d0a7989213cbc746539b1f5bace6579184e))
* do not submit spam checks for verified users ([edd444c](https://github.com/ManifoldScholar/manifold/commit/edd444cd8e6ab3a8a997ff890938e0a7b102fde3))
* DRY and fix MIME and extension check for image detection ([d712288](https://github.com/ManifoldScholar/manifold/commit/d712288f5808ac2616a659e30dcc87007d429dae))
* ensure alt field isn't cleared too eagerly ([aeab72d](https://github.com/ManifoldScholar/manifold/commit/aeab72df6e24bb1410f7d52a00f6146214c3cc6b))
* ensure BodyClass has a single child ([d18594d](https://github.com/ManifoldScholar/manifold/commit/d18594d2013795a61f8933196c2cd6788441ab7c))
* ensure feature preview respects mode toggle ([955ca31](https://github.com/ManifoldScholar/manifold/commit/955ca310e4672645b7be6b812ddecb8571800aa0))
* ensure project restricted access errors persist across multiple failed fetches ([03068c1](https://github.com/ManifoldScholar/manifold/commit/03068c1c6134009cc43b0c234daf1f3aa94e23a2))
* ensure resource collections sort filter uses title ([c1788f0](https://github.com/ManifoldScholar/manifold/commit/c1788f0f9f6c02367defb7651bf40864a37455b7))
* ensure section tooltip is above next section ([5c57437](https://github.com/ManifoldScholar/manifold/commit/5c57437798c6d58b38ee1f15d0dfad9970ca386a))
* fix CSRF and CSP frame ancestor issues in omniauth ([a7efe69](https://github.com/ManifoldScholar/manifold/commit/a7efe690b7f9284fc37fa1a0a892266d789a1687))
* fix resource annotation link handler ([1a35b6b](https://github.com/ManifoldScholar/manifold/commit/1a35b6bffaf331f84f67570caf206087a125cb21))
* fix resource caption/description display logic ([51f0bfb](https://github.com/ManifoldScholar/manifold/commit/51f0bfb1b0c9de55936445bb47c96ac9d0ac3ae4))
* fix resource sort order UX ([653ae1f](https://github.com/ManifoldScholar/manifold/commit/653ae1fe5bbaec192a9e783e08d3ab8204c4ee40))
* give annotation lists a default sort order ([5f30237](https://github.com/ManifoldScholar/manifold/commit/5f30237bacfc9456fd40aedd25e7dad4885adf3a))
* improve project restricted notification display in standalone mode ([8c01c0b](https://github.com/ManifoldScholar/manifold/commit/8c01c0b28c1e60cc4e001fb893b96bd96dd1e7dd))
* journals list library nav layout ([f814272](https://github.com/ManifoldScholar/manifold/commit/f814272f7e170c4d3b456704682f8db612684b79))
* match admin project list collaborator names to frontend ([ab2cbf4](https://github.com/ManifoldScholar/manifold/commit/ab2cbf44349e4f0ae034270a7aa8d8e6a7179d43))
* missing prop on uploaded video variants ([fafb80e](https://github.com/ManifoldScholar/manifold/commit/fafb80e72b8b78a84f82323bb8daeec7db4cd69a))
* move API request params to body ([2d306a2](https://github.com/ManifoldScholar/manifold/commit/2d306a26e6376736e11ff256b1c0509521337486))
* only load necessary collection projects on home page ([0da4b24](https://github.com/ManifoldScholar/manifold/commit/0da4b2441cbff8278103b8cb7c7b52aa0c38bcc2))
* pass keyword options to Dry::Initializer operations and errors ([6e667c2](https://github.com/ManifoldScholar/manifold/commit/6e667c26258e4b7139ccdcb8a140b6a141d315b6))
* pin swagger react version to 18.3 ([e043228](https://github.com/ManifoldScholar/manifold/commit/e043228c61a129655b7536297d62f50dceb5305c))
* preserve cover image and ingestion source original filenames ([b7098ab](https://github.com/ManifoldScholar/manifold/commit/b7098abbd5b088b04d2b43c9296ba016faa046ac))
* proxy robots.txt request ([592d900](https://github.com/ManifoldScholar/manifold/commit/592d900f7a2aaf0aaf6921d4ec74acf70a54a448))
* pull correct LTI DL context object from DL callback ([f9615f0](https://github.com/ManifoldScholar/manifold/commit/f9615f03d9c9e771e058016091ca66571214b86d))
* recalculate text fingerprint on text section or stylesheet change ([33d65c3](https://github.com/ManifoldScholar/manifold/commit/33d65c371b4b531665f41df33ad0e205af195fad))
* regression preventing errors not bound to an input from rendering ([ed857ce](https://github.com/ManifoldScholar/manifold/commit/ed857ce4640fc6f1e00ba7f35c8499ed2d2496e4))
* regression that reinstated ResourceDetail redux key via rebase ([f7f32be](https://github.com/ManifoldScholar/manifold/commit/f7f32bea96e5dbad5730c69000eeef1021897381))
* reinstate user groups route auth check ([2a31ce5](https://github.com/ManifoldScholar/manifold/commit/2a31ce53bf25e5df36869f0290c410edb0a2ad43))
* remove constant redux keys from project collection drawers ([6992fdb](https://github.com/ManifoldScholar/manifold/commit/6992fdb368378efda380b80d664eae7b8f67c0c9))
* remove extra selector bracket ([2e4c449](https://github.com/ManifoldScholar/manifold/commit/2e4c44960444913a3692c94f0697a2ff57582e7d))
* remove rebase artifact ([4b7dbb1](https://github.com/ManifoldScholar/manifold/commit/4b7dbb18fc0d83b4cb61233e7f26857e6f8e39aa))
* remove remaining migrated useFetch constant redux keys ([d119b07](https://github.com/ManifoldScholar/manifold/commit/d119b07c84286126f8ef00c9a90e1c21c8c02d4a))
* render allowDownload field based on active type selection ([bce6275](https://github.com/ManifoldScholar/manifold/commit/bce6275d1fb2cc78e33c4ccddbeff48439e6adab))
* replace jsx extensions with js ([52a663b](https://github.com/ManifoldScholar/manifold/commit/52a663be7010e58837d5f9b705f17c2ef68503cc))
* replace minio with seaweedfs in dev ([870f843](https://github.com/ManifoldScholar/manifold/commit/870f84320d1bcd85016f42d19b39580f7c30152d))
* rever react-router imports ([df20a31](https://github.com/ManifoldScholar/manifold/commit/df20a31c4331c01c137209bfc9d970a74c317ba1))
* revert Rack major version upgrade ([c500989](https://github.com/ManifoldScholar/manifold/commit/c50098928e716abe1aad7134086efc49d4930271))
* scope reader resource create UI to permitted users ([b24fd80](https://github.com/ManifoldScholar/manifold/commit/b24fd8023135ba6fa8666f872751194c402ac7a1))
* set min gap between analytics chart ticks ([8a807f4](https://github.com/ManifoldScholar/manifold/commit/8a807f42098b7c73e8db8acb8b342e183b6bc198))
* set UserRow add/remove button label correctly ([1d40b76](https://github.com/ManifoldScholar/manifold/commit/1d40b764d3b95dc555ed93fcf771f5817ff8eec6))
* show first 3 ordered collaborators on project thumbnails ([fd5665c](https://github.com/ManifoldScholar/manifold/commit/fd5665c6138798f320b6c8546aec6e52c36674db))
* show unverified account warning in reader annotation drawers ([41b90d7](https://github.com/ManifoldScholar/manifold/commit/41b90d7db3b8980d9eec2c1adebe935ca65b8b50))
* update admin redirect for /journals/issues ([1d24cf7](https://github.com/ManifoldScholar/manifold/commit/1d24cf723d96cea9489f551f2b37c093d60d3808))
* update aria labels for alignment buttons ([89f2dce](https://github.com/ManifoldScholar/manifold/commit/89f2dce720ac8062d18f421f40d7d70f32779bad))
* update navigation blocker behavior on form submit ([87b7c24](https://github.com/ManifoldScholar/manifold/commit/87b7c24d2e7ce875f37e1f8062e5248cb3db6d44))
* update pinned seaweedfs version ([1dc179b](https://github.com/ManifoldScholar/manifold/commit/1dc179b8f5a69387557fcad4b168459c7a96c800))
* use full url for video track ([07fa613](https://github.com/ManifoldScholar/manifold/commit/07fa613a85b74fd21d181a293b57a4ee08ebabde))
* various bug fixes + enhancements ([1df6dcb](https://github.com/ManifoldScholar/manifold/commit/1df6dcb6e71209e0c0fb46184248badce26fff0d))
* various small regressions + behavior improvements ([81508a0](https://github.com/ManifoldScholar/manifold/commit/81508a0b7de7902a187d58a5daafe79a670dfb50))


### Miscellaneous Chores

* release 9.2.9 ([8c7a9b5](https://github.com/ManifoldScholar/manifold/commit/8c7a9b54dd976cc7e80f871fedf603d58d9c426c))


### Code Refactoring

* upgrade react-router from v5 to v7 ([1beaf2d](https://github.com/ManifoldScholar/manifold/commit/1beaf2db7049f5378ec668df573c42e17b6829a7))

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
