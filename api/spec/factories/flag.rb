FactoryBot.define do
  factory :flag do
    association :creator, factory: :user
    association :flaggable, factory: :comment
  end
end
