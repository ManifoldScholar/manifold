FactoryBot.define do
  factory :user_collected_project do
    user
    project
  end

  factory :user_collected_resource do
    user
    resource
  end

  factory :user_collected_resource_collection do
    user
    resource_collection
  end

  factory :user_collected_text do
    user
    text
  end
end
