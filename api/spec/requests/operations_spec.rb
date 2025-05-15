# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Operations API", type: :request do
  include_context("simple auth request")

  let(:manifold_client) do
    Testing::ManifoldClient.new user: current_user
  end

  def expect_operation_result_to_include_json(shape, data_index: 0)
    data = response.parsed_body.dig("atomic:results", data_index)

    expect(data).to include_json shape
  end

  describe "collectable operations" do
    let(:collector_definition) { Collections::Mapping[collector] }
    let(:collectable_definition) { collector_definition[collectable] }
    let(:entry_klass) { collectable_definition.entry.klass }
    let(:collectable_mapping_key) { collectable_definition.associations.collectable.collection }

    shared_examples_for "a collectable operation" do
      let(:update_params) do
        manifold_client.collection_operation_body collectable, collector: collector, op: :update
      end

      let(:remove_params) do
        manifold_client.collection_operation_body collectable, collector: collector, op: :remove
      end

      it "adds and removes successfuly" do
        expect do
          post api_v1_operations_path, headers: auth_headers, params: update_params.to_json
        end.to change(entry_klass, :count).by(1)

        expect(response).to be_successful

        expect_operation_result_to_include_json({
          data: {
            attributes: {
              categories: [],
              categoryMappings: {
                "$uncategorized$" => {
                  collectable_mapping_key => [collectable.id],
                },
              },
            },
          },
        })

        expect do
          post api_v1_operations_path, headers: auth_headers, params: remove_params.to_json
        end.to change(entry_klass, :count).by(-1)

        expect(response).to be_successful
      end
    end

    context "when a user is collecting (favoriting) a project" do
      let!(:collector) { current_user }
      let_it_be(:collectable, refind: true) { FactoryBot.create :project }

      include_examples "a collectable operation"
    end

    context "when a user is collecting a project for a reading group" do
      let_it_be(:collector, refind: true) { FactoryBot.create :reading_group, creator: current_user }
      let_it_be(:collectable, refind: true) { FactoryBot.create :project }

      include_examples "a collectable operation"
    end

    context "when a user is reordering multiple projects in a reading group" do
      let_it_be(:collector, refind: true) { FactoryBot.create :reading_group, creator: current_user }

      let_it_be(:collectable_1, refind: true) { FactoryBot.create :project }
      let_it_be(:collectable_2, refind: true) { FactoryBot.create :project }
      let_it_be(:collectable_3, refind: true) { FactoryBot.create :project }
      let_it_be(:collectable_4, refind: true) { FactoryBot.create :project }

      let_it_be(:collectable_entry_1, refind: true) { collector.collect_model! collectable_1 }
      let_it_be(:collectable_entry_2, refind: true) { collector.collect_model! collectable_2 }
      let_it_be(:collectable_entry_3, refind: true) { collector.collect_model! collectable_3 }
      let_it_be(:collectable_entry_4, refind: true) { collector.collect_model! collectable_4 }

      let(:collector_definition) { Collections::Mapping[collector] }
      let(:collectable_definition) { collector_definition[collectable_1] }
      let(:entry_klass) { collectable_definition.entry.klass }
      let(:collectable_mapping_key) { collectable_definition.associations.collectable.collection }

      let(:reorder_params) do
        orderings = [
          { collectable: collectable_1, position: 3 },
          { collectable: collectable_3, position: 1 },
        ]

        manifold_client.collection_operation_body *orderings, collector: collector, op: :update
      end

      it "swaps the positions correctly without affecting the other collectables" do
        expect do
          post api_v1_operations_path, headers: auth_headers, params: reorder_params.to_json
        end.to change { collectable_entry_1.reload.position }.from(1).to(3)
          .and change { collectable_entry_3.reload.position }.from(3).to(1)
          .and keep_the_same { collectable_entry_2.reload.position }
          .and keep_the_same { collectable_entry_4.reload.position }
          .and keep_the_same(entry_klass, :count)

        expect(response).to be_successful

        expect_operation_result_to_include_json({
          data: {
            attributes: {
              categories: [],
              categoryMappings: {
                "$uncategorized$" => {
                  collectable_mapping_key => [collectable_3.id, collectable_2.id, collectable_1.id, collectable_4.id],
                },
              },
            },
          },
        })
      end
    end
  end
end
