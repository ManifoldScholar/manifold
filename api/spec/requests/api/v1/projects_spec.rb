# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Projects API", type: :request do
  included_relationships = [
    :creators,
    :contributors,
    :texts,
    :text_categories,
    :events,
    :resource_collections,
    :resources,
    :subjects,
    :permitted_users,
    :content_blocks,
    :action_callouts
  ]

  path "/projects/{id}" do
    include_examples "an API show request",
                     model: Project,
                     description: "Authorization required when trying to access a draft project",
                     paginated: true,
                     included_relationships: included_relationships

    include_examples "an API update request",
                     model: Project,
                     authorized_user: :admin,
                     included_relationships: included_relationships

    include_examples "an API destroy request", model: Project, authorized_user: :admin
  end

  path "/projects" do
    let(:'filter[draft]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[featured]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[subject]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[keyword]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[order]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[typeahead]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[with_update_ability]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[collection_order]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[with_creator_role]') { nil } # rubocop:todo RSpec/VariableName
    let(:'filter[standalone_mode_enforced]') { nil } # rubocop:todo RSpec/VariableName

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
    ], included_relationships: [:creators]

    include_examples "an API create request", model: Project, authorized_user: :admin
  end

  context "my favorite projects" do
    let!(:project) { FactoryBot.create(:project) }
    let!(:favorite) { FactoryBot.create(:user_collected_project, user: admin, project: project) }

    path "/me/relationships/favorite_projects" do
      include_examples "an API index request",
                       tags: "Me",
                       parent: "current user",
                       model: Project,
                       authorized_user: :admin,
                       paginated: true
    end
  end
end
