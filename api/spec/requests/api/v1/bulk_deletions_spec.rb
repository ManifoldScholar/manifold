# frozen_string_literal: true

RSpec.describe "Bulk Deletions", type: :request do
  include_context "simple auth request"

  let_it_be(:admin_user, refind: true) { FactoryBot.create :user, :admin }
  let_it_be(:other_user, refind: true) { FactoryBot.create :user }
  let_it_be(:deleted_user, refind: true) { User.deleted_user }

  let!(:current_user) { admin_user }

  let(:filters) { { foo: "bar" } }
  let(:ids) { [SecureRandom.uuid] }
  let(:params) do
    {
      bulk_delete: {
        filters: filters,
        ids: ids,
      }
    }
  end

  let(:headers) do
    auth_headers
  end

  let(:request_options) do
    {
      headers: headers,
      params: params.to_json,
    }
  end

  describe "DELETE /api/v1/bulk_delete/annotations" do
    let_it_be(:annotation_1, refind: true) { FactoryBot.create :annotation }
    let_it_be(:annotation_2, refind: true) { FactoryBot.create :annotation }
    let_it_be(:annotation_3, refind: true) { FactoryBot.create :annotation }

    let(:ids) { [annotation_1.id, annotation_2.id] }

    it "deletes records as expected", :aggregate_failures do
      expect do
        delete(api_v1_bulk_delete_annotations_path, **request_options)
      end.to change(Annotation.only_deleted, :count).by(2)
        .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(annotation_1)
        .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(annotation_2)

      expect(response).to have_http_status :ok
    end
  end

  describe "DELETE /api/v1/bulk_delete/comments" do
    let_it_be(:comment, refind: true) { FactoryBot.create :comment }
    let_it_be(:subcomment, refind: true) { FactoryBot.create :comment, parent: comment }

    let(:ids) { [comment.id] }

    it "deletes the record and its children", :aggregate_failures do
      expect do
        delete(api_v1_bulk_delete_comments_path, **request_options)
      end.to change(Comment.only_deleted, :count).by(2)
        .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(comment)
        .and have_enqueued_job(SoftDeletions::PurgeJob).exactly(0).times.with(subcomment)

      expect(response).to have_http_status :ok
    end
  end

  describe "DELETE /api/v1/bulk_delete/reading_groups" do
    let_it_be(:reading_group_1, refind: true) { FactoryBot.create :reading_group }
    let_it_be(:reading_group_2, refind: true) { FactoryBot.create :reading_group }
    let_it_be(:reading_group_3, refind: true) { FactoryBot.create :reading_group }

    let(:ids) { [reading_group_1.id, reading_group_2.id] }

    it "deletes records as expected", :aggregate_failures do
      expect do
        delete(api_v1_bulk_delete_reading_groups_path, **request_options)
      end.to change(ReadingGroup.only_deleted, :count).by(2)
        .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(reading_group_1)
        .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(reading_group_2)

      expect(response).to have_http_status :ok
    end
  end

  describe "DELETE /api/v1/bulk_delete/users" do
    let_it_be(:untouched_user, refind: true) { FactoryBot.create :user }

    let(:ids) { [other_user.id, admin_user.id] }

    it "deletes other records as expected, but will NOT delete the current user", :aggregate_failures do
      expect do
        delete(api_v1_bulk_delete_users_path, **request_options)
      end.to change(User.only_deleted, :count).by(1)
        .and keep_the_same { current_user.reload.soft_deleted? }
        .and keep_the_same { untouched_user.reload.soft_deleted? }
        .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(other_user)

      expect(response).to have_http_status :ok
    end

    context "when a bulk-deleted user has created reading groups" do
      let_it_be(:spammy_reading_group, refind: true) { FactoryBot.create :reading_group, name: "Spammy Group", creator: other_user }
      let_it_be(:preserved_reading_group, refind: true) { FactoryBot.create :reading_group, name: "Preserved Group", creator: other_user, with_user: untouched_user }

      it "soft-deletes the spammy group and preserves groups with other members" do
        expect do
          delete(api_v1_bulk_delete_users_path, **request_options)
        end.to change(User.only_deleted, :count).by(1)
          .and change(ReadingGroup.only_deleted, :count).by(1)
          .and have_enqueued_job(SoftDeletions::PurgeJob).once.with(spammy_reading_group)
          .and change { preserved_reading_group.reload.creator }.from(other_user).to(deleted_user)
          .and change { spammy_reading_group.reload.soft_deleted? }.from(false).to(true)
          .and keep_the_same { spammy_reading_group.reload.creator }
      end
    end
  end
end
