# frozen_string_literal: true

require "rails_helper"

RSpec.describe Packaging::EpubV3::TextSectionCompilation::Pipeline, packaging: true do
  let_it_be(:pipeline) { described_class.new }

  let_it_be(:text) { FactoryBot.create :text }

  let_it_be(:stylesheet) { FactoryBot.create :stylesheet, text: text }

  shared_examples_for "a valid compilation" do
    it "compiles the text section" do
      expect do
        @result = pipeline.call text_section
      end.to execute_safely

      expect(@result).to be_a_success

      @text_section_item = @result.value!

      aggregate_failures "the compiled text section has the expected properties" do
        expect(@text_section_item.text_section).to be text_section

        expect(@text_section_item.stylesheets).to have(1).item
      end
    end
  end

  context "with a text section with a simple body" do
    let!(:text_section) { FactoryBot.create :text_section, :with_simple_body, stylesheets: [stylesheet] }

    include_examples "a valid compilation"
  end

  context "with a text section with an empty body" do
    let!(:text_section) { FactoryBot.create :text_section, :with_empty_body, stylesheets: [stylesheet] }

    include_examples "a valid compilation"
  end
end
