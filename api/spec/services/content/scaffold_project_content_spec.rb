require 'rails_helper'

RSpec.describe Content::ScaffoldProjectContent do
  let(:project) { FactoryBot.create(:project) }

  shared_examples_for "scaffolded blocks" do |kind|
    before(:each) { described_class.run project: project, kind: kind }
    template = Content::ScaffoldTemplate.new(kind)

    it "creates a content block for each block in #{template.kind} template" do
      expected = template.content_blocks.keys
      expect(project.content_blocks.pluck(:type)).to eq expected
    end
  end

  context "when kind is not present" do
    describe "the content blocks created" do
      it_behaves_like "scaffolded blocks"
    end
  end

  context "when kind is 'simple'" do
    it_behaves_like "scaffolded blocks", "simple"
  end

  context "when kind is 'enhanced'" do
    it_behaves_like "scaffolded blocks", "enhanced"
  end

  context "when kind is 'journal_single'" do
    it_behaves_like "scaffolded blocks", "journal_single"
  end

  context "when kind is 'journal_multi'" do
    it_behaves_like "scaffolded blocks", "journal_multi"
  end

  context "when kind is 'teaching_resource'" do
    it_behaves_like "scaffolded blocks", "teaching_resource"
  end

  context "when kind is 'report'" do
    it_behaves_like "scaffolded blocks", "report"
  end

  context "when kind is 'resources'" do
    it_behaves_like "scaffolded blocks", "resources"
  end

  context "when project has not been saved" do
    it "does not create blocks" do
      expect do
        described_class.run project: FactoryBot.build(:project)
      end.to_not change(project.content_blocks, :count)
    end
  end

  context "when project has content blocks" do
    before(:each) { FactoryBot.create(:content_block, project: project) }

    it "does not create blocks" do
      expect do
        described_class.run project: project
      end.to_not change(project.content_blocks, :count)
    end
  end
end
