FactoryBot.define do
  factory :version do
    event { "update" }
    object_changes { { "title" => %w[before after] } }
    association :item, factory: :project
    after(:build) do |version|
      user = FactoryBot.create(:user)
      version.whodunnit = "gid://manifold-api/User/#{user.id}"
    end
  end
end
