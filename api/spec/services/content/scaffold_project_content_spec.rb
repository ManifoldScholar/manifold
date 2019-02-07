require 'rails_helper'

RSpec.describe Content::ScaffoldProjectContent do
  before(:each) { allow_any_instance_of(Project).to receive(:scaffold_content_blocks!) }

  let(:project) { FactoryBot.create(:project) }

  describe "a recent activity block" do
    it "is created" do
      expect do
        described_class.run project: project
      end.to change { project.content_blocks.where(type: "Content::RecentActivityBlock").count }.to(1).from(0)
    end
  end

  describe "a texts block" do
    it "is created" do
      expect do
        described_class.run project: project
      end.to change { project.content_blocks.where(type: "Content::TextsBlock").count }.to(1).from(0)
    end
  end

  describe "a resources block" do
    it "is created" do
      expect do
        described_class.run project: project
      end.to change { project.content_blocks.where(type: "Content::ResourcesBlock").count }.to(1).from(0)
    end
  end


  describe "a metadata block" do
    it "is created" do
      expect do
        described_class.run project: project
      end.to change { project.content_blocks.where(type: "Content::MetadataBlock").count }.to(1).from(0)
    end
  end

  context "when a block of matching type exists on project" do
    let(:project) { FactoryBot.create(:project) }

    before(:each) { FactoryBot.create(:recent_activity_block, project: project) }

    it "does not create a block of that type" do
      expect do
        described_class.run project: project
      end.to_not change { project.content_blocks.where(type: "Content::RecentActivityBlock").count }
    end
  end
end
