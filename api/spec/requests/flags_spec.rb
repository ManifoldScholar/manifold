# frozen_string_literal: true

RSpec.describe "Flags API", type: :request do
  let(:comment) { FactoryBot.create(:comment, creator: reader) }

  describe "flags a comment" do
    let(:path) { api_v1_comment_relationships_flags_path(comment) }

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it("returns the flagged comment") do
        post path, headers: headers
        api_response = JSON.parse(response.body)
        expect(api_response["data"]["id"]).to eq comment.id
      end

      it("saves the flag on the comment") do
        post path, headers: headers
        api_response = JSON.parse(response.body)
        reloaded_comment = Comment.find(comment.id)
        expect(reloaded_comment.flags.count).to eq 1
      end

      it("increments the counter cache on the comment") do
        post path, headers: headers
        api_response = JSON.parse(response.body)
        reloaded_comment = Comment.find(comment.id)
        expect(reloaded_comment.flags_count).to eq 1
      end
    end
  end

  describe "unflags a comment" do
    let(:path) { api_v1_comment_relationships_flags_path(comment) }
    let(:flag) { FactoryBot.create(:flag, creator: reader, flaggable: comment) }

    context "when the user is a reader" do
      let(:headers) { reader_headers }

      it("returns the unflagged comment") do
        flag
        delete path, headers: headers
        api_response = JSON.parse(response.body)
        expect(api_response["data"]["id"]).to eq comment.id
      end

      it("removes the flag on the comment") do
        flag
        delete path, headers: headers
        reloaded_comment = Comment.find(comment.id)
        expect(reloaded_comment.flags.count).to eq 0
      end

      it("increments the counter cache on the comment") do
        flag
        delete path, headers: headers
        reloaded_comment = Comment.find(comment.id)
        expect(reloaded_comment.flags_count).to eq 0
      end
    end
  end
end
