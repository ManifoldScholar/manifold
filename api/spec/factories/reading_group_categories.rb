FactoryBot.define do
  factory :reading_group_category do
    association :reading_group
    title { Faker::Commerce.unique.product_name }
    description { Faker::Lorem.paragraph }
  end
end
