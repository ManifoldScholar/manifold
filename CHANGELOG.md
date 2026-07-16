# Changelog

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
