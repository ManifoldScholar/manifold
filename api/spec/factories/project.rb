FactoryBot.define do
  factory :project do
    title "A project title"
    avatar_color Project::AVATAR_COLOR_PRIMARY
    draft false
    association :creator, factory: :user
  end
end
