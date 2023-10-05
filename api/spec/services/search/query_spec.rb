require "rails_helper"

RSpec.describe Search::Query, elasticsearch: true, interaction: true do
  let!(:bovary) { FactoryBot.create :project, title: "Madame Bovary", description: "The force will be with you, always" }
  let!(:babble) { FactoryBot.create :project, title: "Madame Babble", description: "Peace be with you" }

  before do
    bovary && babble

    Journal.reindex
    Project.reindex
    Journal.searchkick_index.refresh
    Project.searchkick_index.refresh
  end

  let_input!(:keyword) { raise "must be set" }

  def expect_the_search_results
    @matched ||= perform_within_expectation!

    expect(@outcome.result)
  end

  context "with a negated needle" do
    let(:keyword) { "madame -bovary" }

    it "should match only what is expected" do
      expect_the_search_results.to have_matched_model(babble).and be_missing_model(bovary)
    end
  end

  context "with a negated phrase" do
    let(:keyword) { %["be with you" -"the force"] }

    it "should match only what is expected" do
      expect_the_search_results.to have_matched_model(babble).and be_missing_model(bovary)
    end
  end

  context "with only a negated needle" do
    let(:keyword) { %[-bovary] }

    it "should return no results" do
      expect_the_search_results.to be_blank
    end

    context "when set to raise errors" do
      let_input!(:raise_search_errors) { true }

      it "should raise an error" do
        perform_within_expectation! valid: false, raises: true do |e|
          e.to raise_error(Searchkick::InvalidQueryError)
        end
      end
    end
  end

  context "with only a negated phrase" do
    let(:keyword) { %[-"the force"] }

    it "should return no results" do
      expect_the_search_results.to be_blank
    end

    context "when set to raise errors" do
      let_input!(:raise_search_errors) { true }

      it "should raise an error" do
        perform_within_expectation! valid: false, raises: true do |e|
          e.to raise_error(Searchkick::InvalidQueryError)
        end
      end
    end
  end
end
