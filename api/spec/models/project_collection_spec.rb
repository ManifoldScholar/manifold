require 'rails_helper'

RSpec.describe ProjectCollection, type: :model do

  it "has a valid factory" do
    expect(FactoryBot.build(:project_collection)).to be_valid
  end

  describe "its collection_project relationship" do
    let(:project_a) { FactoryBot.create(:project, title: "A") }
    let(:project_b) { FactoryBot.create(:project, title: "B") }
    let(:project_c) { FactoryBot.create(:project, title: "C") }
    let(:project_d) { FactoryBot.create(:project, title: "D") }
    let(:project_collection) do
      pc = FactoryBot.create(:project_collection, sort_order: "title_desc")
      pc.projects << [project_c, project_b, project_d, project_a]
      pc
    end

    it "has a scope that orders based on position" do
      project_titles = project_collection.collection_projects.with_manual_order.map { |cp| cp.project.title }
      expect(project_titles).to eq %w(C B D A)
    end

    it "has a scope that orders based on specified attribute" do
      project_titles = project_collection.collection_projects.with_dynamic_order.map { |cp| cp.project.title }
      expect(project_titles).to eq %w(D C B A)
    end

    it "maintains consecutive positions when removing project" do
      project_collection.projects = project_collection.projects.where.not(id: project_b.id)
      project_collection.save
      expect(project_collection.collection_projects.pluck(:position)).to eq [1, 2, 3]
    end
  end

  describe "#project_sorting" do
    let(:project_collection) { FactoryBot.create(:project_collection, sort_order: "updated_at_desc") }

    it "returns a string order argument joined to project" do
      expect(project_collection.project_sorting).to eq "projects.updated_at desc"
    end

    it "works with input of varying lengths" do
      project_collection.update sort_order: "some_really_long_column_name_direction"
      expect(project_collection.project_sorting).to eq "projects.some_really_long_column_name direction"
    end
  end

  context "when switching from manual to smart" do
    context "when sort_order was manual" do
      it "restores the default sort_order" do
        pc = FactoryBot.create(:project_collection, sort_order: "manual")
        pc.smart = true
        expect { pc.save }.to change(pc, :sort_order).to "created_at_asc"
      end
    end

    context "when sort_order was attribute" do
      it "does not change the sort_order" do
        pc = FactoryBot.create(:project_collection, sort_order: "title_asc")
        pc.smart = true
        expect { pc.save }.to_not change(pc, :sort_order)
      end
    end
  end
end
