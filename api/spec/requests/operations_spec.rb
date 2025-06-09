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

    context "when a user is reordering multiple record types in a reading group" do
      let_it_be(:collector, refind: true) { FactoryBot.create :reading_group, creator: current_user }

      let_it_be(:project_1, refind: true) { FactoryBot.create :project }
      let_it_be(:project_2, refind: true) { FactoryBot.create :project }
      let_it_be(:project_3, refind: true) { FactoryBot.create :project }
      let_it_be(:project_4, refind: true) { FactoryBot.create :project }

      let_it_be(:text_section_1, refind: true) { FactoryBot.create :text_section }
      let_it_be(:text_section_2, refind: true) { FactoryBot.create :text_section }
      let_it_be(:text_section_3, refind: true) { FactoryBot.create :text_section }
      let_it_be(:text_section_4, refind: true) { FactoryBot.create :text_section }

      let_it_be(:project_entry_1, refind: true) { collector.collect_model! project_1 }
      let_it_be(:project_entry_2, refind: true) { collector.collect_model! project_2 }
      let_it_be(:project_entry_3, refind: true) { collector.collect_model! project_3 }
      let_it_be(:project_entry_4, refind: true) { collector.collect_model! project_4 }

      let_it_be(:text_section_entry_1, refind: true) { collector.collect_model! text_section_1 }
      let_it_be(:text_section_entry_2, refind: true) { collector.collect_model! text_section_2 }
      let_it_be(:text_section_entry_3, refind: true) { collector.collect_model! text_section_3 }
      let_it_be(:text_section_entry_4, refind: true) { collector.collect_model! text_section_4 }

      let(:collector_definition) { Collections::Mapping[collector] }
      let(:project_definition) { collector_definition[project_1] }
      let(:project_entry_klass) { project_definition.entry.klass }
      let(:project_mapping_key) { project_definition.associations.collectable.collection.to_s.camelize(:lower) }
      let(:text_section_definition) { collector_definition[text_section_1] }
      let(:text_section_entry_klass) { text_section_definition.entry.klass }
      let(:text_section_mapping_key) { text_section_definition.associations.collectable.collection.to_s.camelize(:lower) }

      let(:reorder_params) do
        orderings = [
          { collectable: project_1, position: 3 },
          { collectable: project_3, position: 1 },
          { collectable: text_section_2, position: 4 },
          { collectable: text_section_4, position: 2 },
        ]

        manifold_client.collection_operation_body *orderings, collector:, op: :update
      end

      it "swaps the positions correctly without affecting the other collectables" do
        expect do
          post api_v1_operations_path, headers: auth_headers, params: reorder_params.to_json
        end.to change { project_entry_1.reload.position }.from(1).to(3)
          .and change { project_entry_3.reload.position }.from(3).to(1)
          .and change { text_section_entry_2.reload.position }.from(2).to(4)
          .and change { text_section_entry_4.reload.position }.from(4).to(2)
          .and keep_the_same { project_entry_2.reload.position }
          .and keep_the_same { project_entry_4.reload.position }
          .and keep_the_same { text_section_entry_1.reload.position }
          .and keep_the_same { text_section_entry_3.reload.position }
          .and keep_the_same(project_entry_klass, :count)
          .and keep_the_same(text_section_entry_klass, :count)

        expect(response).to be_successful

        expect_operation_result_to_include_json({
          data: {
            attributes: {
              categories: [],
              categoryMappings: {
                "$uncategorized$" => {
                  project_mapping_key => [project_3.id, project_2.id, project_1.id, project_4.id],
                  text_section_mapping_key => [text_section_1.id, text_section_4.id, text_section_3.id, text_section_2.id],
                },
              },
            },
          },
        })
      end
    end
  end
end
