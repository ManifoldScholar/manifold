require "swagger_helper"

RSpec.describe "ReadingGroupMembership", type: :request do
  let!(:user) { FactoryBot.create(:user) }
  let!(:reading_group) { FactoryBot.create(:reading_group) }
  let(:reading_group_id) { reading_group.id }

  path "/reading_group_memberships" do
    include_examples "an API create request",
                     model: ReadingGroupMembership,
                     paginated: true,
                     included_relationships: [:user],
                     authorized_user: :admin do
      let(:body) do
        {
          data: {
            relationships: {
              user: {
                data: {
                  id: user.id
                }
              },
              readingGroup: {
                data: {
                  id: reading_group.id
                }
              }
            }
          }
        }
      end
    end
  end

  path "/reading_group_memberships/{id}" do
    include_examples "an API destroy request",
                     model: ReadingGroupMembership,
                     authorized_user: :admin
  end

  path "/reading_groups/{reading_group_id}/relationships/reading_group_memberships" do
    include_examples "an API index request",
                     model: ReadingGroupMembership,
                     parent: "reading group",
                     url_parameters: [:reading_group_id],
                     authorized_user: :admin
  end
end
