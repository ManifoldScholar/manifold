require "rails_helper"

RSpec.describe TextTitle, type: :model do
  it "belongs to a text" do
    text_title = TextTitle.new
    text = Text.new
    text_title.text = text
    expect(text_title.text).to be text
  end

  it_should_behave_like "a model with formatted attributes" do
    describe "with specific values" do
      let(:raw) { "_italic_ a **bold**" }
      let(:formatted) { "<em>italic</em> a <strong>bold</strong>" }
      let(:plaintext) { "italic a bold" }

      let!(:text_title) { FactoryBot.create :text_title, value: raw }

      subject { text_title }

      it { is_expected.to have_attributes value_formatted: formatted, value_plaintext: plaintext }
    end
  end
end
