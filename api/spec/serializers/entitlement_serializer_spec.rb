require "rails_helper"

RSpec.describe V1::EntitlementSerializer do
  let(:main_trait) { raise "must set" }
  let(:target_trait) { :for_user }
  let(:other_traits) { :read_access }
  let!(:entitlement) { FactoryBot.create :entitlement, main_trait, target_trait, *Array(other_traits)}
  let(:serialized_object) { entitlement }

  shared_examples_for "multiple variations" do
    include_examples "a serializer"

    context "with an expiration" do
      let(:other_traits) { [:with_expiration, :read_access] }

      include_examples "a serializer"
    end

    context "for a reading group" do
      let(:target_trait) { :for_reading_group }

      include_examples "a serializer"
    end
  end

  context "for a project" do
    let(:main_trait) { :project_read_access }

    include_examples "multiple variations"
  end

  context "for a project collection" do
    let(:main_trait) { :collection_read_access }

    include_examples "multiple variations"
  end

  context "for a global subscription" do
    let(:main_trait) { :global_subscriber }

    include_examples "multiple variations"
  end
end
