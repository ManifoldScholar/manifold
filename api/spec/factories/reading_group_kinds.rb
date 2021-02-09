FactoryBot.define do
  factory :reading_group_kind do
    name { Faker::Commerce.unique.product_name }
  end
end
