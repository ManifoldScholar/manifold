FactoryGirl.define do
  factory :project do
    association :creator, factory: :user
  end
end
