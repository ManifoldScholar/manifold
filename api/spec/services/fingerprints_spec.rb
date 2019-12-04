require "rails_helper"

RSpec.describe Fingerprints, fingerprint_calculation: true do
  class << self
    def test_singleton_method_from(let_name, expected_value)
      it "finds #{expected_value.inspect} for let(:#{let_name})" do
        let_value =
          begin
            public_send let_name
          rescue NoMethodError
            raise "Expected let(:#{let_name}) to be defined"
          end

        expect(described_class.public_send(singleton_method_name, let_value)).to eq expected_value
      end
    end

    def with_singleton_method(singleton_method_name, &block)
      describe ".#{singleton_method_name}" do |args|
        let(:singleton_method_name) { singleton_method_name.to_sym }

        instance_exec(*args, &block)
      end
    end
  end

  let(:text) { FactoryBot.create :text }
  let(:collaborator) { FactoryBot.create :collaborator }
  let(:text_section) { FactoryBot.create :text_section }
  let(:text_title) { FactoryBot.create :text_title }
  let(:unfingerprintable) { FactoryBot.create :user }

  with_singleton_method :derive_fingerprint_interaction_for do
    test_singleton_method_from :collaborator, Collaborators::CalculateFingerprint
    test_singleton_method_from :text, Texts::CalculateFingerprint
    test_singleton_method_from :text_section, TextSections::CalculateFingerprint
    test_singleton_method_from :text_title, TextTitles::CalculateFingerprint

    it "raises an error for an unknown fingerprint" do
      expect do
        described_class.derive_fingerprint_interaction_for unfingerprintable
      end.to raise_error Fingerprints::UnknownFingerprintInteraction
    end
  end

  with_singleton_method :derive_fingerprint_interaction_key_for do
    test_singleton_method_from :collaborator, :collaborator
    test_singleton_method_from :text, :text
    test_singleton_method_from :text_section, :text_section
    test_singleton_method_from :text_title, :text_title
  end
end
