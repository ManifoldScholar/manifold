require "rails_helper"

RSpec.describe Comment, type: :model do

  it "has a valid comment factory" do
    expect(FactoryGirl.build(:comment)).to be_valid
  end

  describe "is invalid when" do
    let(:comment) { FactoryGirl.build(:comment) }

    it "body is blank" do
      comment.body = ""
      expect(comment).to_not be_valid
    end

    it "subject is blank" do
      comment.subject = nil
      expect(comment).to_not be_valid
    end
  end
end
