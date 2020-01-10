# Manifold (Rails Backend)

## Testing

By default and in CI, Manifold's test suite uses the battle-tested `rspec-rails` integration.

```sh
bin/rspec
# OR
bundle exec rspec
```

### Parallel Testing

Optionally, you can use [parallel_tests](https://github.com/grosser/parallel_tests) to run the test suite in parallel processes that are based on the number of CPUs. It requires a little more set up, but it can speed things up _significantly_, particularly with how many of the integration tests in Manifold deal with complex parsing and filesystem tasks, and so are unavoidably slow.

#### Setting up the databases

To set it up, first execute in a shell:

```sh
# This task only needs to be run once per installation
bin/rake parallel:create
```

This will try to create a series of databases, starting with `manifold_test`, along with `manifold_test2`, `manifold_test3`, `manifold_test4`, etc.

#### Migrating the databases

Once that is done, you'll need to load up the schema in each:

```sh
# This task is run after creation, and after any migration / schema changes
# Don't forget the RAILS_ENV!
RAILS_ENV=test bin/rake parallel:rake[db:schema:load]
```

**IMPORTANT!** The `RAILS_ENV` must be specified for the `parallel:prepare` task, or it will clobber your local development database.

You'll have to re-run this task after any change to the development schema as well.

Finally, the tests!

```sh
# the default way
bin/rake parallel:spec

# a helpful wrapper written to wrap around `bin/parallel_rspec` that loads up runtime logs,
# which helps parallel_tests divide up the specs more evenly across processes so they all
# finish at around the same time
bin/pspec

# similar to the above, a way to run `rspec --only-failures` in parallelized mode.
bin/pspec-failures
```

You can still use regular rspec commands for specific tags or individual spec files if you should need to. Parallelization is intended mainly for speeding up global test runs when necessary.

`SimpleCov` transparently detects the presence of `parallel_tests`, and handles the merging the coverage information without any intervention on our part.
