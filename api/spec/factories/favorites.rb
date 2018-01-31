FactoryBot.define do
  factory :favorite do
    association :user, factory: :user
    association :favoritable, factory: :project
  end
end
