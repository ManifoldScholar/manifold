require "rails_helper"
require "api_docs/definitions"
require "api_docs/definitions/resource"
require "api_docs/helpers/inflections"
require "api_docs/helpers/request"

include_dirs = [
  "api_docs/examples/*.rb",
  "api_docs/definitions/resources/*.rb",
  "api_docs/definitions/resources/analytics/*.rb",
  "api_docs/definitions/resources/analytics/reports/*.rb"

]

include_dirs.each do |include_dir|
  Dir.glob(File.join(__dir__, include_dir)).each do |path|
    require path
  end
end

require "api_docs/config"

# Dir.glob(File.join(__dir__, "definitions/types/*.rb")).each do |path|
#   require path
# end

# get all definitions in the swagger_definitions folder
Dir[File.join(File.dirname(__FILE__), "swagger_definitions/*.rb")].each do |file|
  require file
end

RSpec.configure do |config|
  # Specify a root folder where Swagger JSON files are generated
  # NOTE: If you're using the rswag-api to serve API descriptions, you'll need
  # to ensure that it's configured to serve Swagger from the same folder
  config.swagger_root = ::APIDocs::Config.swagger_root

  # Define one or more Swagger documents and provide global metadata for each one
  # When you run the 'rswag:specs:to_swagger' rake task, the complete Swagger will
  # be generated at the provided relative path under swagger_root
  # By default, the operations defined in spec files are added to the first
  # document below. You can override this behavior by adding a swagger_doc tag to the
  # the root example_group in your specs, e.g. describe '...', swagger_doc: 'v2/swagger.json'
  config.swagger_docs = APIDocs::Config.swagger_docs
end
