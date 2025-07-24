# frozen_string_literal: true

RSpec.describe CollectionProject, type: :model do
  it "has a valid factory" do
    expect do
      FactoryBot.create(:collection_project)
    end.to change(described_class, :count).by(1)
  end

  describe "oai behavior" do
    let(:project) { FactoryBot.create(:project, :with_metadata) }
    let(:project_collection) { FactoryBot.create(:project_collection) }

    it "adds project OAI record to set when adding project to collection" do
      expect do
        FactoryBot.create(:collection_project, project:, project_collection:)
      end.to change(project.manifold_oai_record.sets, :count).by 1
    end

    it "removes project OAI record from set when collection_project is deleted" do
      collection_project = FactoryBot.create(:collection_project, project:, project_collection:)
      expect do
        collection_project.destroy!
      end.to change(project.manifold_oai_record.sets, :count).by(-1)
    end
  end
end
