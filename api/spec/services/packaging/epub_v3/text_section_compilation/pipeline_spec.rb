require "rails_helper"

RSpec.describe Packaging::EpubV3::TextSectionCompilation::Pipeline, packaging: true do
  let!(:pipeline) { described_class.new }

  let!(:text) { FactoryBot.create :text }

  let!(:stylesheet) { FactoryBot.create :stylesheet, text: text }

  let!(:text_section) { FactoryBot.create :text_section, :with_simple_body, stylesheets: [stylesheet] }

  it "compiles the text section" do
    expect do
      @result = pipeline.call text_section
    end.not_to raise_error

    expect(@result).to be_a_success

    @text_section_item = @result.value!

    aggregate_failures "the compiled text section has the expected properties" do
      expect(@text_section_item.text_section).to be text_section

      expect(@text_section_item.stylesheets).to have(1).item
    end
  end
end
