# frozen_string_literal: true

RSpec.shared_context "project role tests" do
  let_it_be(:project, refind: true) { FactoryBot.create :project }

  let_it_be(:admin, refind: true) { FactoryBot.create :user, :admin }
  let_it_be(:editor, refind: true) { FactoryBot.create :user, :editor }
  let_it_be(:project_creator, refind: true) { FactoryBot.create :user, :project_creator }
  let_it_be(:marketeer, refind: true) { FactoryBot.create(:user, :marketeer) }
  let_it_be(:project_author, refind: true) { FactoryBot.create(:user, authored_projects: [project]) }
  let_it_be(:project_editor, refind: true) { FactoryBot.create(:user, edited_projects: [project]) }
  let_it_be(:project_property_manager, refind: true) { FactoryBot.create(:user, property_managed_projects: [project]) }
  let_it_be(:reader, refind: true) { FactoryBot.create :user, :reader }
end

RSpec.configure do |c|
  c.include_context "project role tests", project_role_tests: true
end
