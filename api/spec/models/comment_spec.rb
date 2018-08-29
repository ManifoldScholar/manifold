require "rails_helper"

RSpec.describe Comment, type: :model do

  it "has a valid comment factory" do
    expect(FactoryBot.build(:comment)).to be_valid
  end

  it "enqueues a COMMENT_CREATED event on creation" do
    subject = FactoryBot.create(:annotation)
    expect(CreateEventJob).to receive(:perform_later).with(EventType[:comment_created], any_args)
    FactoryBot.create(:comment, subject: subject)
  end

  it "enqueues a EnqueueCommentNotificationsJob on creation" do
    expect do
      FactoryBot.create(:comment)
    end.to have_enqueued_job(Notifications::EnqueueCommentNotificationsJob)
  end

  describe "is invalid when" do
    let(:comment) { FactoryBot.build(:comment) }

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
        @comment = FactoryBot.create(:comment)
      end

      it 'is correct when a root' do
        expect(@comment.sort_order).to eq 0
      end

      it 'is correct when child' do
        comment = FactoryBot.create(:comment, parent: @comment)
        expect(comment.sort_order).to eq 0
      end
    end
  end
end
