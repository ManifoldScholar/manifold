require 'rails_helper'

RSpec.describe CommentDecorator do
  let(:resource) { FactoryBot.create(:resource) }
  let(:annotation) { FactoryBot.create(:annotation) }

  describe "#title" do
    context "when subject is a resource" do
      let(:comment) { FactoryBot.create(:comment, subject: resource).decorate }

      it "returns the correct title" do
        expect(comment.title).to eq resource.title
      end
    end

    context "when subject is a annotation" do
      let(:comment) { FactoryBot.create(:comment, subject: annotation).decorate }

      it "returns the correct title" do
        expect(comment.title).to eq annotation.text.title
      end
    end
  end
end
