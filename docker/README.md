# Local Development

Manifold now supports dockerized local environments for development.

Rails & all dependent services are contained in docker, while the client application continues to run in the local environment.

## Minimum Requirements

* docker (and docker compose)
* nodenv (or similar tool able to use .node-version)

## Initial setup

From the `manifold` project root, run the following:

```sh
nodenv install -s "$(cat .node-version)"

docker/set_up_local.sh
```

## Launching the full stack

From the `manifold` project root, run the following:

```sh
bin/localdev
```

This will ensure that docker is running, then launch the client in the current terminal table.
