# frozen_string_literal: true

RSpec.describe "Resource Abilities", :authorizer, :project_role_tests do # rubocop:todo RSpec/DescribeClass
  let_it_be(:resource, refind: true) { FactoryBot.create(:resource, project: project) }

  let(:object) { resource }

  include_examples "unauthenticated user", Resource
end
