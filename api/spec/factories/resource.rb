FactoryGirl.define do
  factory :resource do
    title "Rowan"
    association :creator, factory: :user
    project
  end
end
