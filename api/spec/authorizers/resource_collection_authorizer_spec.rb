# frozen_string_literal: true

RSpec.describe "ResourceCollection Abilities", :authorizer, :project_role_tests do # rubocop:todo RSpec/DescribeClass
  let_it_be(:resource_collection, refind: true) { FactoryBot.create(:resource_collection, project: project) }

  let(:object) { resource_collection }

  include_examples "unauthenticated user", ResourceCollection
end
