require 'rails_helper'

RSpec.describe Content::ScaffoldProjectContent do
  let(:project) { FactoryBot.create(:project) }

  shared_examples_for "scaffolded blocks" do |kind|
    template = Content::ScaffoldTemplate.new(kind)

    context "when kind is '#{kind}'" do
      before(:each) { described_class.run project: project, kind: kind }

      it "creates a content block for each block in #{template.kind} template" do
        expected = template.content_blocks.keys
        expect(project.content_blocks.pluck(:type)).to eq expected
      end
    end
  end

  shared_examples_for "configured blocks" do |option|
    block = "Content::" + option.to_s.camelize + "Block"

    describe ":#{option}" do
      context "when true" do
        it "creates a #{block} block" do
          configuration[option] = true

          expect do
            described_class.run project: project, configuration: configuration
          end.to change { project.content_blocks.where(type: block).count }.from(0).to(1)
        end
      end

      context "when false" do
        it "does not create a #{block} block" do
          configuration[option] = false

          expect do
            described_class.run project: project, configuration: configuration
          end.to_not change { project.content_blocks.where(type: block).count }.from(0)
        end
      end
    end
  end

  context "when kind is present" do
    include_examples "scaffolded blocks", "simple"
    include_examples "scaffolded blocks", "enhanced"
    include_examples "scaffolded blocks", "journal_single"
    include_examples "scaffolded blocks", "journal_multi"
    include_examples "scaffolded blocks", "teaching_resource"
    include_examples "scaffolded blocks", "report"
    include_examples "scaffolded blocks", "resources"
  end

  context "when configuration object is present" do
    let(:configuration) do
      { multiple_texts: false, resources: false, markdown: false, recent_activity: false }
    end

    describe "the options" do
      describe ":multiple_texts" do
        context "when true" do
          it "creates a TextsBlock" do
            configuration[:multiple_texts] = true

            expect do
              described_class.run project: project, configuration: configuration
            end.to change { project.content_blocks.where(type: "Content::TextsBlock").count }.from(0).to(1)
          end
        end

        context "when false" do
          it "creates a TableOfContentsBlock" do
            expect do
              described_class.run project: project, configuration: configuration
            end.to change { project.content_blocks.where(type: "Content::TableOfContentsBlock").count }.from(0).to(1)
          end
        end
      end

      include_examples "configured blocks", :resources
      include_examples "configured blocks", :markdown
      include_examples "configured blocks", :recent_activity
    end

    it "always creates a metadata block" do
      expect do
        described_class.run project: project, configuration: configuration
      end.to change { project.content_blocks.where(type: "Content::MetadataBlock").count }.from(0).to(1)
    end
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
