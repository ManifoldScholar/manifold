FactoryBot.define do
  factory :text do
    association :creator, factory: :user
    project
  end
end
