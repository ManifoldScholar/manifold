# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Content::ScaffoldProjectContent do
  let(:project) { FactoryBot.create(:project) }

  shared_examples_for "scaffolded blocks" do |kind|
    template = Content::ScaffoldTemplate.new(kind)

    context "when kind is '#{kind}'" do
      before { described_class.run project: project, kind: kind }

      it "creates a content block for each block in #{template.kind} template" do
        expected = template.content_blocks.keys
        expect(project.content_blocks.pluck(:type)).to eq expected
      end
    end
  end

  shared_examples_for "configured blocks" do |option|
    block = "Content::#{option.to_s.camelize}Block"

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
          end.not_to change { project.content_blocks.where(type: block).count }.from(0)
        end
      end
    end
  end

  context "when kind is present" do
    it_behaves_like "scaffolded blocks", "simple"
    it_behaves_like "scaffolded blocks", "enhanced"
    it_behaves_like "scaffolded blocks", "journal_single"
    it_behaves_like "scaffolded blocks", "journal_multi"
    it_behaves_like "scaffolded blocks", "teaching_resource"
    it_behaves_like "scaffolded blocks", "report"
    it_behaves_like "scaffolded blocks", "resources"
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

      it_behaves_like "configured blocks", :resources
      it_behaves_like "configured blocks", :markdown
      it_behaves_like "configured blocks", :recent_activity
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
      end.not_to change(project.content_blocks, :count)
    end
  end

  context "when project has content blocks" do
    before { FactoryBot.create(:content_block, project: project) }

    it "does not create blocks" do
      expect do
        described_class.run project: project
      end.not_to change(project.content_blocks, :count)
    end
  end
end
