require "rails_helper"

RSpec.describe V1::FavoriteSerializer do
  let!(:user_collected_project) { FactoryBot.create :user_collected_project }

  let(:serialized_object) { user_collected_project && Favorite.first! }

  it_behaves_like "a serializer"
end
