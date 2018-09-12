require "rails_helper"

RSpec.describe ProjectCollections::CacheCollectionProjects do
  before do
    ProjectCollection.skip_callback(:save, :after, :cache_collection_projects!)
  end

  after do
    ProjectCollection.set_callback(:save, :after, :cache_collection_projects!)
  end

  let!(:subject_a) { FactoryBot.create(:subject, name: "A") }
  let!(:subject_b) { FactoryBot.create(:subject, name: "B") }
  let!(:subject_c) { FactoryBot.create(:subject, name: "C") }
  let!(:project_a) { FactoryBot.create(:project, title: "A", tag_list: "a, b", subjects: [subject_a], featured: true) }
  let!(:project_b) { FactoryBot.create(:project, title: "B", tag_list: "b", subjects: [subject_b]) }
  let!(:project_c) { FactoryBot.create(:project, title: "C", tag_list: "c", subjects: [subject_b, subject_c]) }
  let!(:project_d) { FactoryBot.create(:project, title: "D", tag_list: "d, e", subjects: [subject_a, subject_c], featured: true) }

  describe "the assigned projects" do
    it "has the correct count" do
      project_collection = FactoryBot.create(:project_collection, number_of_projects: 2, smart: true)
      expect do
        described_class.run project_collection: project_collection
      end.to change{ project_collection.projects.count }.from(0).to(2)
    end

    context "when no parameters are included" do
      it "includes all projects" do
        project_collection = FactoryBot.create(:project_collection, smart: true)
        described_class.run project_collection: project_collection
        expect(project_collection.projects.count).to eq Project.count
      end
    end

    context "when parameters include featured projects only" do
      it "has the correct projects" do
        project_collection = FactoryBot.create(:project_collection, featured_only: true, smart: true)
        described_class.run project_collection: project_collection
        expect(project_collection.projects).to contain_exactly(project_a, project_d)
      end
    end

    context "when parameters include subjects" do
      before(:each) do
        @project_collection = FactoryBot.create(:project_collection, smart: true)
        @project_collection.subjects = [subject_a, subject_c]
      end

      it "has the correct projects" do
        described_class.run project_collection: @project_collection
        expect(@project_collection.projects).to contain_exactly(project_a, project_c, project_d)
      end
    end

    context "when parameters include tags" do
      before(:each) do
        @project_collection = FactoryBot.create(:project_collection, smart: true)
        @project_collection.update tag_list: "b, e"
      end

      it "has the correct projects" do
        described_class.run project_collection: @project_collection
        expect(@project_collection.projects).to contain_exactly(project_a, project_b, project_d)
      end
    end

    context "when parameters include tags and subjects" do
      before(:each) do
        @project_collection = FactoryBot.create(:project_collection, smart: true)
        @project_collection.subjects = [subject_a]
        @project_collection.update tag_list: "c"
      end

      it "has the correct projects" do
        described_class.run project_collection: @project_collection
        expect(@project_collection.projects).to contain_exactly(project_a, project_c, project_d)
      end
    end
  end
end
