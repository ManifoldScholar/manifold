FactoryGirl.define do
  factory :resource do
    association :creator, factory: :user
    project
  end
end
