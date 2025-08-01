# frozen_string_literal: true

require "rails_helper"

shared_examples_for "a controller handling flattened collaborators" do |factory|
  let_it_be(:maker_one) { FactoryBot.create(:maker) }
  let_it_be(:maker_two) { FactoryBot.create(:maker) }
  let_it_be(:object) { FactoryBot.create(factory) }

  describe "creates collaborators from a list of roles" do
    let(:params) do
      {
          roles: [ "author", "editor" ],
          maker: maker_one
      }
    end
    let(:path) do
      url_for([:create_from_roles, :api, :v1, object, :relationships, :collaborators])
    end

    context "when the user is a project_creator" do
      let(:headers) { project_creator_headers }

      it "creates one collaborator per role" do
        expect do
          post path, headers: headers, params: params.to_json
        end.to change(object.collaborators, :count).by(2)
      end
    end

    context "when there is no authenticated user" do
      let(:headers) { anonymous_headers }

      it "does not create collaborators" do
        expect do
          post path, headers: headers, params: params.to_json
        end.to keep_the_same { object.collaborators.count }
      end
    end
  end

  describe "creates and deletes collaborators from a list of roles" do
    let_it_be(:collaborator_one) do
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :author, position: 2)
    end
    let_it_be(:collaborator_two) do
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :edited_by, position: 3)
    end
    let(:params) do
      {
          roles: [ "author", "editor", "translator" ],
          maker: maker_one,
          position: collaborator_one.position
      }
    end
    let(:path) do
      url_for([:update_from_roles, :api, :v1, object, :relationships, :collaborators])
    end

    context "when the user is a project_creator" do
      let(:headers) { project_creator_headers }

      it "updates roles correctly" do
        expect do
          post path, headers: headers, params: params.to_json
        end.to change(object.collaborators.where(maker_id: maker_one.id), :count).by(1)

        expect(object.collaborators.where(maker_id: maker_one.id, role: :editor).count).to eq(1)
        expect(object.collaborators.where(maker_id: maker_one.id, role: :edited_by).count).to eq(0)
        expect(object.collaborators.where(maker_id: maker_one.id, role: :author).count).to eq(1)
        expect(object.collaborators.where(maker_id: maker_one.id, role: :translator).count).to eq(1)
      end

      it "does not update roles when no maker id is provided" do
        expect do
          post path, headers: headers
        end.to keep_the_same { object.collaborators.count }
      end
    end

    context "when there is no authenticated user" do
      let(:headers) { anonymous_headers }

      it "does not update roles" do
        expect do
          post path, headers: headers, params: params.to_json
        end.to keep_the_same { object.collaborators.count }
        .and keep_the_same { object.collaborators.where(maker_id: maker_one.id).count }
      end
    end
  end

  describe "deletes all collaborators associated with a maker" do
    let_it_be(:collaborator_one) do
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :author)
    end
    let_it_be(:collaborator_two) do
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :editor)
    end
    let_it_be(:collaborator_three) do
      FactoryBot.create(:collaborator, maker: maker_two, collaboratable: object, role: :editor)
    end

    let(:filter) { { maker: maker_one.id } }
    let(:params) { { filter: filter } }
    let(:path) do
      url_for([:api, :v1, object, :relationships, :collaborators])
    end

    context "when the user is a project_creator" do
      let(:headers) { project_creator_headers }

      it "deletes collaborator records when a maker id is supplied" do
        expect do
          delete path, headers: headers, params: params.to_json
        end.to change(object.collaborators, :count).by(-2)
        .and change(object.collaborators.where(maker_id: maker_one.id), :count).to(0)
      end

      it "does not delete records when no maker id is provided" do
        expect do
          delete path, headers: headers
        end.to keep_the_same { object.collaborators.count }
      end
    end

    context "when there is no authenticated user" do
      let(:headers) { anonymous_headers }

      it "does not delete collaborators" do
        expect do
          delete path, headers: headers, params: params.to_json
        end.to keep_the_same { object.collaborators.count }
        .and keep_the_same { object.collaborators.where(maker_id: maker_one.id).count }
      end
    end
  end
end
