FactoryBot.define do
  factory :stylesheet  do
    text
    association :creator, factory: :user
    name { "A Stylesheet" }
  end
end
