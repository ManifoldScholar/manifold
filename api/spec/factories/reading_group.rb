FactoryBot.define do
  factory :reading_group do
    name { "A Reading Group" }
    association :creator, factory: :user
  end
end
