require "rails_helper"

RSpec.describe "Export Target Abilities", :authorizer do
  context "when the subject is an admin" do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_ADMIN) }

    the_subject_behaves_like "class abilities", ExportTarget, all: true
  end

  context "when the subject is a reader" do
    let(:subject) { FactoryBot.create(:user) }

    the_subject_behaves_like "class abilities", ExportTarget, none: true
  end

  context "when the subject is a global editor" do
    let(:subject) { FactoryBot.create(:user, role: Role::ROLE_EDITOR) }
    let(:another_user) { FactoryBot.create(:user) }
    let(:object) { FactoryBot.create(:export_target) }
    the_subject_behaves_like "instance abilities", ExportTarget, read_only: true
  end
end
