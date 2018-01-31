FactoryBot.define do
  factory :project do
    title "A project title"
    avatar_color Project::AVATAR_COLOR_PRIMARY
    association :creator, factory: :user
  end
end
