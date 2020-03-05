FactoryBot.define do
  factory :entitler do
    association :entity, factory: :user
  end
end
