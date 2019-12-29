require "rails_helper"

RSpec.describe TwitterQuery, type: :model do
  it "has a valid factory" do
    expect(FactoryBot.build(:twitter_query)).to be_valid
  end

  context "its most_recent_tweet_id" do

    let(:query) {
      query = FactoryBot.create(:twitter_query)
      query.most_recent_tweet_id = 5
      query.save
      query
    }

    it "is reset when query is changed" do
      query.query = "#changed"
      expect{ query.save }.to change{query.most_recent_tweet_id}.to nil
    end

    it "is not reset when query is unchanged" do
      query.result_type = "popular"
      expect{ query.save }.to_not change{query.most_recent_tweet_id}
    end
  end

  it "has a truncated, single search param display name" do
    query = FactoryBot.create(:twitter_query, query: "from:manifoldscholar #celtics")
    expect(query.display_name).to eq "from:manifoldscholar..."
  end
end
