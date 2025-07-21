# frozen_string_literal: true

require "rails_helper"

RSpec.describe ProjectCollection, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:project_collection)).to be_valid
  end

  describe "#projects" do
    let(:project_a) { FactoryBot.create(:project, title: "A") }
    let(:project_b) { FactoryBot.create(:project, title: "B") }
    let(:project_c) { FactoryBot.create(:project, title: "C") }
    let(:project_d) { FactoryBot.create(:project, title: "D") }
    let(:sort_order) { "title_desc" }
    let(:positioned_projects) { [project_c, project_b, project_d, project_a] }
    let!(:project_collection) do
      pc = FactoryBot.create(:project_collection, sort_order: sort_order)
      pc.projects << positioned_projects
      pc.reload
    end

    subject { project_collection.projects.reload.to_a }

    context "when the scope is based on position" do
      let(:sort_order) { "manual" }

      it { is_expected.to eq positioned_projects }
    end

    context "when the scope is based on specified attribute" do
      let(:sort_order) { "title_desc" }

      it { is_expected.to eq [project_d, project_c, project_b, project_a] }
    end

    it "allows projects to be removed" do
      project_collection.projects = []
      expect(project_collection.reload.projects.count).to be 0
    end

    it "allows projects to be replaced" do
      project_collection.projects = [project_a, project_b]
      expect(project_collection.reload.projects.count).to be 2
    end
  end

  describe "#project_sorting" do
    let(:project_collection) { FactoryBot.create(:project_collection, sort_order: "updated_at_desc") }

    it "returns a string order argument joined to project" do
      expect(project_collection.project_sorting).to contain_exactly(["updated_at", "desc"])
    end

    it "defaults to created_at desc if invalid attribute" do
      project_collection.update sort_order: "bad_attribute"

      expect(project_collection.project_sorting).to contain_exactly(["created_at", "desc"])
    end
  end

  context "when switching from manual to smart" do
    context "when sort_order was manual" do
      it "restores the default sort_order" do
        pc = FactoryBot.create(:project_collection, sort_order: "manual")
        pc.smart = true
        expect { pc.save }.to change(pc, :sort_order).to "created_at_desc"
      end
    end

    context "when sort_order was attribute" do
      it "does not change the sort_order" do
        pc = FactoryBot.create(:project_collection, sort_order: "title_asc")
        pc.smart = true
        expect { pc.save }.not_to change(pc, :sort_order)
      end
    end
  end

  describe "its by_visible_on_homepage scope" do
    let(:no_homepage) { FactoryBot.create(:project_collection, homepage: false) }
    let(:not_visible) { FactoryBot.create(:project_collection, visible: false) }
    let(:no_range) { FactoryBot.create(:project_collection, homepage: true) }
    let(:pending) { FactoryBot.create(:project_collection, homepage: true, homepage_start_date: Date.today + 1.week, homepage_end_date: Date.today + 2.weeks) }
    let(:current) { FactoryBot.create(:project_collection, homepage: true, homepage_start_date: Date.today - 1.week, homepage_end_date: Date.today + 1.week) }
    let(:open_ended) { FactoryBot.create(:project_collection, homepage: true, homepage_start_date: Date.today - 1.week) }
    let(:expired) { FactoryBot.create(:project_collection, homepage: true, homepage_start_date: Date.today - 2.weeks, homepage_end_date: Date.today - 1.week) }

    context "when homepage == false" do
      it "excludes the collection" do
        expect(described_class.by_visible_on_homepage).not_to include no_homepage
      end
    end

    context "when visible == false" do
      it "excludes the collection" do
        expect(described_class.by_visible_on_homepage).not_to include not_visible
      end
    end

    context "when homepage == true && visible == true" do
      context "when no date range" do
        it "includes the collection" do
          expect(described_class.by_visible_on_homepage).to include no_range
        end
      end

      context "when current date in date range" do
        it "includes the collection" do
          expect(described_class.by_visible_on_homepage).to include current
        end
      end

      context "when current date after start and no end date specified" do
        it "includes the collection" do
          expect(described_class.by_visible_on_homepage).to include open_ended
        end
      end

      context "when current date before date range" do
        it "excludes the collection" do
          expect(described_class.by_visible_on_homepage).not_to include pending
        end
      end

      context "when current date after date range" do
        it "excludes the collection" do
          expect(described_class.by_visible_on_homepage).not_to include expired
        end
      end
    end
  end

  describe "oai behavior" do
    it "creates a set for every collection" do
      collections = []
      expect do
        collections = FactoryBot.create_list :project_collection, 5
      end.to change(ManifoldOAISet, :count).by(5)
      expect(collections.any? { |c| c.manifold_oai_set.nil? }).to be false
    end

    it "does not create sets when project collections are excluded" do
      expect do
        FactoryBot.create_list :project_collection, 5, exclude_from_oai: true
      end.not_to change(ManifoldOAISet, :count)
    end

    it "deletes OAI records when a project collection is hidden" do
      collection = FactoryBot.create :project_collection
      expect do
        collection.exclude_from_oai = true
        collection.save!
      end.to change(ManifoldOAISet, :count).by(-1)
    end
  end
end
