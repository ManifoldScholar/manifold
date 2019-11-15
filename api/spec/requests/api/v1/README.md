# Documenting a route

## Options to pass to a `include examples`

* **focus** (boolean): If set to true, rspec will only tests that are in focus
* **with_auth** (boolean): Will document that authorization is required for that route
* **partial** (boolean): Denotes that not all attributes will be represented in this route. The request will in this order:
  * Look for an array of symbols in the associated resource under the keyword `PARTIAL`
  * Get the associated relationships and attributes on the partial serializer (eg. for the `Text` definition it will get the `TextSerializer`)
  * Fall back on the default behavior of providing all attributes that are readable
* **auth_type** (symbol): Allows specification of which user type you would like to use during the test of the route. Available options are `:admin`, `:author`, and `:reader`
* **exclude_404** (boolean): Exclude a 404 test on the route.
* **exclude_403** (boolean): Exclude a 403 test on the route.
* **factory**: Allows an overwrite for which factory the code will use to generate a json structure. This json structure is used as the submission body during create or update tests.
* **resource_name** (string): The name of the resource that is being documented. This exists in the `Resources` module that contains the information needed to generate swagger documentation.
* **tags** (array of symbols): The tags that will be attached to the route. When swagger generates the route information, the tags is what decides what 'folders' or 'categories' the route will be nested under
* **model** (model class): Used to get the name of the `factory` and `resource_name` if not overwritten
* **additional_parameters** (array of hashes): Hashes that merge with the default parameters and are passed into the [rswag](https://github.com/rswag/rswag) tests
* **included** (array of symbols/strings): Used to document what kind of resources could be present in the `included` section of the route response
