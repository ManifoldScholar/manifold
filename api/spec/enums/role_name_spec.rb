require "rails_helper"

RSpec.describe RoleName do
  subject { described_class.new }

  let(:admin) { FactoryBot.create :user, :admin }
  let(:editor) { FactoryBot.create :user, :editor }
  let(:project_creator) { FactoryBot.create :user, :project_creator }
  let(:marketeer) { FactoryBot.create :user, :marketeer }
  let(:reader) { FactoryBot.create :user, :reader }

  let(:project) { FactoryBot.create :project }

  let(:project_author) { FactoryBot.create(:user).tap { |u| u.add_role :project_author, project } }
  let(:project_resource_editor) { FactoryBot.create(:user).tap { |u| u.add_role :project_resource_editor, project } }
  let(:project_editor) { FactoryBot.create(:user).tap { |u| u.add_role :project_editor, project } }

  describe RoleName::Admin, enum: true do
    it { is_expected.to be_an_admin }
    it { is_expected.to be_global }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
    it { is_expected.to be_visible_to_admin }
    it { is_expected.not_to be_visible_to_editor }
    it { is_expected.to be_applicable_for admin }
    it { is_expected.to be_applicable_for_kind admin }
  end

  describe RoleName::Editor, enum: true do
    it { is_expected.to be_an_editor }
    it { is_expected.to be_global }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
    it { is_expected.not_to be_visible_to_admin }
    it { is_expected.to be_visible_to_editor }
    it { is_expected.to be_applicable_for editor }
    it { is_expected.to be_applicable_for_kind editor }
  end

  describe RoleName::ProjectCreator, enum: true do
    it { is_expected.to be_a_project_creator }
    it { is_expected.to be_global }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
    it { is_expected.to be_applicable_for project_creator }
    it { is_expected.to be_applicable_for_kind project_creator }
  end

  describe RoleName::Marketeer, enum: true do
    it { is_expected.to be_a_marketeer }
    it { is_expected.to be_global }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
    it { is_expected.to be_applicable_for marketeer }
    it { is_expected.to be_applicable_for_kind marketeer }
  end

  describe RoleName::ProjectEditor, enum: true do
    it { is_expected.to be_a_project_editor }
    it { is_expected.to be_scoped }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.to have_expected_resource }
    it { is_expected.not_to be_visible_to_admin }
    it { is_expected.to be_visible_to_editor }
    it { is_expected.not_to be_applicable_for project_editor }
    it { is_expected.to be_applicable_for_kind project_editor }
  end

  describe RoleName::ProjectResourceEditor, enum: true do
    it { is_expected.to be_a_project_resource_editor }
    it { is_expected.to be_scoped }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.to have_expected_resource }
    it { is_expected.not_to be_visible_to_editor }
    it { is_expected.not_to be_applicable_for project_resource_editor }
    it { is_expected.to be_applicable_for_kind project_resource_editor }
  end

  describe RoleName::ProjectAuthor, enum: true do
    it { is_expected.to be_a_project_author }
    it { is_expected.to be_scoped }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.to have_expected_resource }
    it { is_expected.not_to be_visible_to_admin }
    it { is_expected.not_to be_visible_to_editor }
    it { is_expected.not_to be_applicable_for project_author }
    it { is_expected.to be_applicable_for_kind project_author }
  end

  describe RoleName::Reader, enum: true do
    it { is_expected.to be_a_reader }
    it { is_expected.to be_global }
    it { is_expected.not_to be_an_entitlement }
    it { is_expected.not_to have_expected_resource }
    it { is_expected.to be_applicable_for reader }
    it { is_expected.to be_applicable_for project_author }
    it { is_expected.to be_applicable_for project_editor }
    it { is_expected.to be_applicable_for project_resource_editor }
    it { is_expected.to be_applicable_for_kind reader }
  end

  describe RoleName::Subscriber, enum: true do
    it { is_expected.to be_a_subscriber }
    it { is_expected.to be_an_entitlement }
    it { is_expected.to be_a_global_entitlement }
    it { is_expected.not_to have_expected_resource }
    it { is_expected.not_to be_applicable_for reader }
  end

  describe RoleName::ReadAccess, enum: true do
    it { is_expected.to be_a_read_access }
    it { is_expected.to be_an_entitlement }
    it { is_expected.to be_a_scoped_entitlement }
    it { is_expected.to have_expected_resource }
    it { is_expected.not_to be_applicable_for reader }
  end

  describe ".editor_roles" do
    it "fetches a list of editor roles" do
      expect(described_class.editor_roles).to all(be_visible_to_editor)
    end
  end

  describe ".entitlements" do
    it "fetches a list of entitlement roles" do
      expect(described_class.entitlements).to all(be_an_entitlement)
    end
  end

  describe ".globals" do
    it "fetches all global enums by default" do
      expect(described_class.globals).to all(be_global)
    end
  end

  describe ".scoped" do
    it "fetches all scoped enums by default" do
      expect(described_class.scoped).to all(be_scoped)
    end
  end

  describe ".scoped_predicates" do
    it "fetches a list of predicates" do
      expect(described_class.scoped_predicates).to all(match(/\A\w+\?\z/))
    end
  end

  describe ".fetch_for_kind" do
    it "fetches the expected kinds" do
      aggregate_failures do
        expect(described_class.fetch_for_kind(admin)).to be_an_admin
        expect(described_class.fetch_for_kind(editor)).to be_an_editor
        expect(described_class.fetch_for_kind(project_creator)).to be_a_project_creator
        expect(described_class.fetch_for_kind(marketeer)).to be_a_marketeer
        expect(described_class.fetch_for_kind(project_author)).to be_a_project_author
        expect(described_class.fetch_for_kind(project_editor)).to be_a_project_editor
        expect(described_class.fetch_for_kind(project_resource_editor)).to be_a_project_resource_editor
        expect(described_class.fetch_for_kind(reader)).to be_a_reader
      end
    end
  end
end
