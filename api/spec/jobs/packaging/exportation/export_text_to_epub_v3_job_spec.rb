require 'rails_helper'

RSpec.describe Packaging::Exportation::ExportTextToEpubV3Job, packaging: true, type: :job do
  let(:force) { false }
  let(:text) { FactoryBot.create :text }

  shared_examples_for "a called interaction" do
    it "calls the interaction" do
      expect(Packaging::Exportation::ExportTextToEpubV3).to receive(:run!).with(force: force, text: text)

      expect do
        described_class.perform_now(text, force: force)
      end.not_to raise_error
    end
  end

  include_examples "a called interaction"

  context "when forced" do
    let(:force) { true }

    include_examples "a called interaction"
  end
end
