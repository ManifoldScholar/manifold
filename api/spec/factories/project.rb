FactoryGirl.define do
  factory :project do
    title "A project title"
    association :creator, factory: :user
  end
end
