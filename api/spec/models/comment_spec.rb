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

  describe 'its hierarchical tree' do
    it 'is ordered by :sort_order' do
      is_expected.to be_a_closure_tree.ordered(:sort_order)
    end

    context 'assigning the sort order' do
      before(:each) do
        @comment = FactoryGirl.create(:comment)
      end

      it 'is correct when a root' do
        expect(@comment.sort_order).to eq 0
      end

      it 'is correct when child' do
        comment = FactoryGirl.create(:comment, parent: @comment)
        expect(comment.sort_order).to eq 0
      end
    end
  end
end
