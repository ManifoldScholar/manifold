require "rails_helper"

shared_examples_for "a controller handling flattened collaborators" do | factory |
  let_it_be(:maker_one) { FactoryBot.create(:maker) }
  let_it_be(:maker_two) { FactoryBot.create(:maker) }
  let_it_be(:object) { FactoryBot.create(factory) }

  describe "creates users from a list of roles" do
    let(:params) do
      {
        data: {
          roles: [ "author", "editor" ],
          maker: { data: maker_one }
        }
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

  describe "deletes all collaborators associated with a maker" do
    let_it_be(:collaborator_one) {
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :author)
    }
    let_it_be(:collaborator_two) {
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :editor)
    }
    let_it_be(:collaborator_three) {
      FactoryBot.create(:collaborator, maker: maker_two, collaboratable: object, role: :editor)
    }

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

  describe "updates collaborator positions" do
    let_it_be(:collaborator_one) {
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :author, position: 1)
    }
    let_it_be(:collaborator_two) {
      FactoryBot.create(:collaborator, maker: maker_one, collaboratable: object, role: :editor, position: 2)
    }
    let_it_be(:collaborator_three) {
      FactoryBot.create(:collaborator, maker: maker_two, collaboratable: object, role: :editor, position: 3)
    }

    let(:collaborators) do
      [
        { id: collaborator_one.id, type: "collaborators", position: 3 },
        { id: collaborator_two.id, type: "collaborators", position: 2 },
        { id: collaborator_three.id, type: "collaborators", position: 1 },
      ]
    end

    let(:params) do
      {
        data: {
          collaborators: collaborators,
        }
      }
    end
    let(:path) do
      url_for([:reorder, :api, :v1, object, :relationships, :collaborators])
    end

    context "when the user is a project_creator" do
      let(:headers) { project_creator_headers }

      it "assigns collaborator positions from params" do
        expect do
          post path, headers: headers, params: params.to_json
        end.to change { collaborator_three.reload.position}.to(1)
        .and keep_the_same { collaborator_two.reload.position }
        .and change { collaborator_one.reload.position }.to(3)
      end
    end

    context "when there is no authenticated user" do
      let(:headers) { anonymous_headers }

      it "does not reorder collaborators" do
        expect do
          post path, headers: headers, params: params.to_json
        end.to keep_the_same { collaborator_one.reload.position }
        .and keep_the_same { object.collaborators }
      end
    end
  end
end
