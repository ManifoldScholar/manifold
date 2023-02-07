require "rails_helper"

RSpec.describe "Project Abilities", :authorizer do
  include TestHelpers::AuthorizationHelpers

  let!(:user) { FactoryBot.create :user, *user_traits }
  let!(:project) { FactoryBot.create :project, *project_traits }
  let(:draft) { false }
  let(:restricted_access) { false }

  let(:project_traits) do
    [].tap do |traits|
      traits << :as_draft if draft
      traits << :with_restricted_access if restricted_access
    end
  end

  let(:user_traits) do
    []
  end

  subject { user }

  let(:project_children_abilities) do
    %i[
      manage_resources create_resources
      manage_resource_collections create_resource_collections
      manage_texts create_texts
      manage_twitter_queries create_twitter_queries
      manage_events create_events
      update_makers
      read_log
    ]
  end

  shared_examples_for "authorized to manage project children" do
    it "can manage project children" do
      is_expected.to be_able_to(*project_children_abilities).on(project)
    end
  end

  shared_examples_for "authorized to manage project entitlements" do
    it "is able to manage project entitlements" do
      is_expected.to be_able_to(:manage_entitlements, :create_entitlements).on(project)
    end
  end

  shared_examples_for "authorized to manage project exportations" do
    it "is able to manage project exporations" do
      is_expected.to be_able_to(:manage_project_exportations, :create_project_exportations).on(project)
    end
  end

  shared_examples_for "authorized to manage project permissions" do
    it "is able to manage project permissions" do
      is_expected.to be_able_to(:manage_permissions, :create_permissions).on(project)
    end
  end

  shared_examples_for "unauthorized to manage project children" do
    it "cannot manage project children" do
      is_expected.not_to be_able_to(*project_children_abilities).on(project)
    end
  end

  shared_examples_for "unauthorized to manage project entitlements" do
    it "cannot manage project entitlements" do
      is_expected.to be_unable_to(:manage_entitlements, :create_entitlements).on(project)
    end
  end

  shared_examples_for "unauthorized to manage project exportations" do
    it "cannot manage project exportations" do
      is_expected.not_to be_able_to(:manage_project_exportations, :create_project_exportations).on(project)
    end
  end

  shared_examples_for "unauthorized to manage project permissions" do
    it "cannot manage project permissions" do
      is_expected.not_to be_able_to(:manage_permissions, :create_permissions).on(project)
    end
  end

  shared_examples_for "no access" do
    it { is_expected.to be_unable_to(:read, :create, :update, :destroy).on(project) }
  end

  shared_examples_for "read only" do
    it "can only read the project" do
      expect(user).to be_able_to(:read).on(project).and be_unable_to(:create, :update, :destroy).on(project)
    end
  end

  shared_examples_for "full access" do
    it("can perform all CRUD actions") { is_expected.to be_able_to(:create, :read, :update, :destroy).on(project) }

    include_examples "authorized to manage project children"
    include_examples "authorized to manage project entitlements"
    include_examples "authorized to manage project exportations"
    include_examples "authorized to manage project permissions"
  end

  context "when unauthenticated" do
    let(:user) { anonymous_user }

    context "when the project is a draft" do
      let(:draft) { true }

      include_examples "no access"
      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end

    context "when the project is published" do
      it { is_expected.to be_able_to(:read).on(project).and be_unable_to(:create, :update, :destroy).on(project) }

      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end
  end

  context "when the user is an admin" do
    let(:user_traits) { [:admin] }

    context "and the project is a draft" do
      let(:draft) { true }

      include_examples "full access"
    end

    context "with a published project" do
      include_examples "full access"
    end
  end

  context "when the user is an editor" do
    let(:user_traits) { [:editor] }

    context "and the project is a draft" do
      let(:draft) { true }

      include_examples "full access"
    end

    context "with a published project" do
      include_examples "full access"
    end
  end

  context "when the user is a project creator" do
    let(:user_traits) { [:project_creator] }

    context "and the project is a draft" do
      let(:draft) { true }

      it "can only create a draft project" do
        is_expected.to be_able_to(:create).on(project).and be_unable_to(:destroy, :update, :read).on(project)
      end

      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end
  end

  context "when the user is a marketeer" do
    let(:user_traits) { [:marketeer] }

    context "and the project is a draft" do
      let(:draft) { true }

      it("can only read and update a project") do
        is_expected.to be_able_to(:read, :update).on(project).and be_unable_to(:create, :delete).on(project)
      end

      include_examples "authorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end
  end

  context "when the user is a reader and project editor of a specific draft project" do
    let(:draft) { true }

    before do
      user.add_role :project_editor, project
    end

    it "can read, update, and destroy the project" do
      is_expected.to be_able_to(:read, :update, :destroy).on(project).and be_unable_to(:create).on(project)
    end

    include_examples "authorized to manage project children"
    include_examples "unauthorized to manage project entitlements"
    include_examples "unauthorized to manage project exportations"
    include_examples "unauthorized to manage project permissions"
  end

  context "when the user is a reader and a project resource editor for a specific draft project" do
    let(:draft) { true }

    before do
      user.add_role :project_resource_editor, project
    end

    include_examples "read only"

    it "can only manage a project's resources" do
      other_actions = project_children_abilities.without(:manage_resources)

      expect(user).to be_able_to(:manage_resources).on(project).and be_unable_to(*other_actions).on(project)
    end

    include_examples "unauthorized to manage project entitlements"
    include_examples "unauthorized to manage project exportations"
    include_examples "unauthorized to manage project permissions"
  end

  context "when the user is a reader and an author of a specific project" do
    before do
      user.add_role :project_author, project
    end

    context "that is a draft" do
      let(:draft) { true }

      include_examples "no access"
      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end

    context "that is published" do
      include_examples "read only"
      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end
  end

  context "when the user is a regular reader" do
    let(:user_traits) { [:reader] }

    context "for a draft project" do
      include_examples "no access"
      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end

    context "for a published project" do
      include_examples "read only"
      include_examples "unauthorized to manage project children"
      include_examples "unauthorized to manage project entitlements"
      include_examples "unauthorized to manage project exportations"
      include_examples "unauthorized to manage project permissions"
    end
  end

  context "with entitlements" do
    let!(:user) { FactoryBot.create :user, *user_traits }
    let(:user_traits) do
      []
    end
    let!(:project) { FactoryBot.create :project, :with_restricted_access }

    subject { user }

    context "when the user is an author of the project" do
      before do
        user.add_role :project_author, project
      end

      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.to be_authorized_to :fully_read, project }
    end

    context "when the user is a project resource editor for the project" do
      before do
        user.add_role :project_resource_editor, project
      end

      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.to be_authorized_to :fully_read, project }
    end

    context "when the user is an editor of the project" do
      before do
        user.add_role :project_editor, project
      end

      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.to be_authorized_to :fully_read, project }
    end

    context "when the user is an admin" do
      let!(:user) { FactoryBot.create :user, :admin }

      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.to be_authorized_to :fully_read, project }
    end

    context "when the user is a subscriber" do
      let!(:entitlement) { FactoryBot.create :entitlement, :global_subscriber, user: user }

      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.to be_authorized_to :fully_read, project }
    end

    context "when the user has been granted a specific entitlement" do
      let!(:entitlement) { FactoryBot.create :entitlement, :read_access, user: user, subject: project }

      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.to be_authorized_to :fully_read, project }
    end

    context "when the user is just a regular user" do
      it { is_expected.to be_authorized_to :read, project }
      it { is_expected.not_to be_authorized_to :fully_read, project }
    end
  end
end
