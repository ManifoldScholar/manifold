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
        end.to change { entry_klass.count }.by(1)

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
        end.to change { entry_klass.count }.by(-1)

        expect(response).to be_successful
      end
    end

    context "when a user is collecting (favoriting) a project" do
      let!(:collector) { current_user }
      let!(:collectable) { FactoryBot.create :project }

      include_examples "a collectable operation"
    end

    context "when a user is collecting a project for a reading group" do
      let!(:collector) { FactoryBot.create :reading_group, creator: current_user }
      let!(:collectable) { FactoryBot.create :project }

      include_examples "a collectable operation"
    end
  end
end
