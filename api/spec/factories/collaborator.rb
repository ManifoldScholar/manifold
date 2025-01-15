FactoryBot.define do
  factory :collaborator do
    role { CollaboratorRole::Author }
    association :collaboratable, factory: :project
    maker
  end
end
