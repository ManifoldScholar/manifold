FactoryBot.define do
  factory :reading_group_project do
    reading_group
    reading_group_category
    project
  end

  factory :reading_group_resource do
    reading_group
    reading_group_category
    resource
  end

  factory :reading_group_resource_collection do
    reading_group
    reading_group_category
    resource_collection
  end

  factory :reading_group_text do
    reading_group
    reading_group_category
    text
  end
end
