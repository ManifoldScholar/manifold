require "rails_helper"

RSpec.describe Search::QueryBuilder, elasticsearch: true, interaction: true do
  let(:options) { Search::Options.new }
  let(:phrases) { [] }
  let(:needle) { nil }
  let(:negated_needle) { nil }
  let(:negated_phrases) { [] }

  let(:instance) { described_class.new(options: options, phrases: phrases, needle: needle, negated_needle: negated_needle, negated_phrases: negated_phrases) }

  subject { instance }

  shared_examples_for "a valid query" do
    its(:body) { is_expected.to be_present }

    it { is_expected.to have_something_to_search }

    it { is_expected.to be_valid }
  end

  shared_examples_for "handles negation" do
    context "with a negated needle" do
      let(:negated_needle) { "baz" }

      it { is_expected.to have_something_to_exclude }

      include_examples "a valid query"
    end

    context "with negated phrases" do
      let(:negated_phrases) { ["baz quux"] }

      it { is_expected.to have_something_to_exclude }

      include_examples "a valid query"
    end
  end

  context "with nothing provided" do
    its(:body) { is_expected.to be_present }
    it { is_expected.to be_invalid }
    it { is_expected.to have(1).error_on(:base) }
  end

  context "with a needle" do
    let(:needle) { "foo" }

    it { is_expected.to have_needle }

    include_examples "a valid query"

    include_examples "handles negation"
  end

  context "with some phrases" do
    let(:phrases) { ["foo bar"] }

    it { is_expected.to have_phrases }

    include_examples "a valid query"

    include_examples "handles negation"
  end
end
