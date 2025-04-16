# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Journals API", type: :request do
  included_relationships = [
    :creators,
    :contributors,
    :permitted_users
  ]

  path "/journals/{id}" do
    include_examples "an API show request",
                     model: Journal,
                     description: "Authorization required when trying to access a draft journal",
                     paginated: true,
                     included_relationships: included_relationships

    include_examples "an API update request",
                     model: Journal,
                     authorized_user: :admin,
                     included_relationships: included_relationships

    include_examples "an API destroy request", model: Journal, authorized_user: :admin
  end

  path "/journals" do
    let(:'filter[draft]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[keyword]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[typeahead]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[with_update_ability]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[with_creator_role]') { nil } # rubocop:todo RSpec/VariableName

    include_examples "an API index request", model: Journal, additional_parameters: [
      { name: "filter[draft]", in: :query, type: :boolean },
      { name: "filter[keyword]", in: :query, type: :string },
      { name: "filter[typeahead]", in: :query, type: :string },
      { name: "filter[with_update_ability]", in: :query, type: :boolean },
      { name: "filter[with_creator_role]", in: :query, type: :boolean },
    ], included_relationships: [:creators]

    include_examples "an API create request", model: Journal, authorized_user: :admin
  end
end
