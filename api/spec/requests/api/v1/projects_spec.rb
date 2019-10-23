require "rails_helper"
require "swagger_helper"

RSpec.describe "Projects API", type: :request do
  path "/projects/{id}" do
    include_examples "an API show request", model: Project
    include_examples "an API update request", model: Project, auth_type: :admin
    include_examples "an API destroy request", model: Project, auth_type: :admin
  end

  path "/projects" do
    Type = ApiDocs::Definition::Type

    let(:'filter[draft]') { nil }
    let(:'filter[featured]') { nil }
    let(:'filter[subject]') { nil }
    let(:'filter[keyword]') { nil }
    let(:'filter[order]') { nil }
    let(:'filter[typeahead]') { nil }
    let(:'filter[with_update_ability]') { nil }
    let(:'filter[collection_order]') { nil }
    let(:'filter[with_creator_role]') { nil }
    let(:'filter[standalone_mode_enforced]') { nil }

    include_examples "an API index request", model: Project, additional_parameters: [
      { name: "filter[draft]", in: :query, type: :boolean },
      { name: "filter[featured]", in: :query, type: :boolean },
      { name: "filter[subject]", in: :query, type: :string },
      { name: "filter[keyword]", in: :query, type: :string },
      { name: "filter[order]", in: :query, type: :string },
      { name: "filter[typeahead]", in: :query, type: :string },
      { name: "filter[with_update_ability]", in: :query, type: :boolean },
      { name: "filter[collection_order]", in: :query, type: :boolean },
      { name: "filter[with_creator_role]", in: :query, type: :boolean },
      { name: "filter[standalone_mode_enforced]", in: :query, type: :boolean }
    ]

    include_examples "an API create request", model: Project, auth_type: :admin
  end
end
