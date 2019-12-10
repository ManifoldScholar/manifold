FactoryBot.define do
  factory :project do
    title { "A project title" }
    avatar_color { Project::AVATAR_COLOR_PRIMARY }
    draft { false }
    association :creator, factory: :user

    trait :exports_as_bag_it do
      exports_as_bag_it { true }
    end
  end
end
