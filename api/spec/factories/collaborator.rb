FactoryBot.define do
  factory :collaborator do
    role { Collaborator::ROLE_CREATOR }
    association :collaboratable, factory: :project
    maker
  end
end
