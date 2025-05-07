# frozen_string_literal: true

RSpec.describe "Flags API", type: :request do
  shared_examples_for "a flaggable relationship" do |model_klass|
    model_klass.model_name.i18n_key

    url_base = "/api/v1/#{model_klass.model_name.plural}/:#{model_klass.model_name.singular}_id/flags"

    let!(:flaggable) { raise "need to have set!" }

    let!(:path) do
      url_for([:api, :v1, flaggable, :relationships, :flags])
    end

    describe "POST #{url_base}" do
      context "when the user is anonymous" do
        let(:headers) { anonymous_headers }

        it "is forbidden", :aggregate_failures do
          expect do
            post path, headers: headers
          end.to keep_the_same(Flag, :count)

          expect(response).to have_http_status :unauthorized
        end
      end

      context "when the user is a reader" do
        let(:headers) { reader_headers }

        it "flags the comment", :aggregate_failures do
          expect do
            post path, headers: headers
          end.to change(Flag, :count).by(1)

          expect(response).to have_http_status(:created)

          expect(response.parsed_body).to include_json(data: { id: flaggable.id, attributes: { flagged: true } })
        end

        context "when the user has already flagged the comment" do
          let!(:existing_flag) { FactoryBot.create(:flag, creator: reader, flaggable: flaggable) }

          it "is idempotent", :aggregate_failures do
            expect do
              post path, headers: headers
            end.to keep_the_same(Flag, :count)
              .and keep_the_same { existing_flag.reload.updated_at }

            expect(response).to have_http_status(:created)

            expect(response.parsed_body).to include_json(data: { id: flaggable.id, attributes: { flagged: true } })
          end
        end
      end
    end

    describe "DELETE #{url_base}" do
      context "when the user is anonymous" do
        let(:headers) { anonymous_headers }

        it "is forbidden" do
          expect do
            post path, headers: headers
          end.to keep_the_same(Flag, :count)

          expect(response).to have_http_status :unauthorized
        end
      end

      context "when the user is a reader" do
        let(:headers) { reader_headers }

        context "when the comment is unflagged" do
          it "does nothing" do
            expect do
              delete path, headers: headers
            end.to keep_the_same(Flag, :count)

            expect(response).to have_http_status :not_found
          end
        end

        context "when the user has flagged the comment" do
          let!(:existing_flag) { FactoryBot.create(:flag, creator: reader, flaggable: flaggable) }

          it "resolves the flag", :aggregate_failures do
            expect do
              delete path, headers: headers
            end.to keep_the_same(Flag, :count)
              .and change { existing_flag.reload.resolved? }.from(false).to(true)

            expect(response).to have_http_status(:ok)

            expect(response.parsed_body).to include_json(data: { id: flaggable.id, attributes: { flagged: false } })
          end

          context "when the flag has already been resolved by an admin" do
            before do
              existing_flag.resolve!
            end

            it "records that the user resolved it themselves as well", :aggregate_failures do
              expect do
                delete path, headers: headers
              end.to keep_the_same(Flag, :count)
                .and keep_the_same { existing_flag.reload.resolved? }
                .and change { existing_flag.reload.resolved_by_creator }.from(false).to(true)

              expect(response).to have_http_status(:ok)

              expect(response.parsed_body).to include_json(data: { id: flaggable.id, attributes: { flagged: false } })
            end
          end
        end
      end
    end

    describe "DELETE #{url_base}/resolve_all" do
      let!(:unresolved_flag) { FactoryBot.create(:flag, flaggable: flaggable) }
      let!(:resolved_flag) { FactoryBot.create(:flag, :resolved, flaggable: flaggable) }

      let(:path) do
        url_for([:resolve_all, :api, :v1, flaggable, :relationships, :flags])
      end

      context "when the user is an admin" do
        let(:headers) { admin_headers }

        it "resolves all unresolved flags" do
          expect do
            delete path, headers: headers
          end.to change(Flag.only_resolved, :count).by(1)
            .and change { unresolved_flag.reload.resolved? }.from(false).to(true)
            .and keep_the_same { resolved_flag.reload.resolved? }
        end
      end

      context "when the user is a reader" do
        let(:headers) { reader_headers }

        it "is forbidden" do
          expect do
            delete path, headers: headers
          end.to keep_the_same(Flag.only_resolved, :count)
            .and keep_the_same { unresolved_flag.reload.resolved? }
        end
      end

      context "when the user is a anonymous" do
        let(:headers) { anonymous_headers }

        it "is forbidden" do
          expect do
            delete path, headers: headers
          end.to keep_the_same(Flag.only_resolved, :count)
            .and keep_the_same { unresolved_flag.reload.resolved? }
        end
      end
    end
  end

  context "when working with annotations" do
    let_it_be(:annotation, refind: true) { FactoryBot.create(:annotation, creator: reader) }

    include_examples "a flaggable relationship", Annotation do
      let(:flaggable) { annotation }
    end
  end

  context "when working with comments" do
    let_it_be(:comment, refind: true) { FactoryBot.create(:comment, creator: reader) }

    include_examples "a flaggable relationship", Comment do
      let(:flaggable) { comment }
    end
  end
end
