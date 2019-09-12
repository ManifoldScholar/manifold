# spec

This project uses [rswag](https://github.com/domaindrivendev/rswag) to automatically generate a swagger specification of the API based on the tests that rely on the swagger_helper library.

To run a test and make sure the rswag spec matches the project: `rspec -fd spec/requests`

If all of those tests pass, you can safely assume that the documentation will accurately reflect the project.
To generate a swagger doc with rswag: `rake rswag:specs:swaggerize`

The swagger documentation will be generated in `api/swagger/v1/swagger.json`
