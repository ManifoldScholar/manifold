require "rails_helper"

RSpec.describe Packaging::Shared::ReferenceSelector, packaging: true do
  let(:tag) { nil }
  let(:attribute) { nil }

  let(:reference_selector) { described_class.new tag, attribute }

  subject { reference_selector }

  class << self
    def with_tuple(tag, attribute, &block)
      selector = "#{tag}[#{attribute}]"

      context "when #{selector}" do
        let(:tag) { tag }
        let(:attribute) { attribute }

        it "has the expected selector" do
          expect(reference_selector.selector).to eq selector
        end

        instance_eval(&block)
      end
    end
  end
  RSpec::Matchers.define :maybe_refer_to_an_external_resource do
    match { |actual| actual.can_refer_to_external_resource? }
  end

  with_tuple "a", "href" do
    it { is_expected.not_to maybe_refer_to_an_external_resource }
  end

  with_tuple "anything", "else" do
    it { is_expected.not_to maybe_refer_to_an_external_resource }
  end

  with_tuple "iframe", "src" do
    it { is_expected.not_to maybe_refer_to_an_external_resource }
  end

  with_tuple "img", "src" do
    it { is_expected.to maybe_refer_to_an_external_resource }
  end

  with_tuple "link", "href" do
    it { is_expected.to maybe_refer_to_an_external_resource }
  end

  with_tuple "video", "poster" do
    it { is_expected.to maybe_refer_to_an_external_resource }
  end
end
