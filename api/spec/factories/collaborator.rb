FactoryGirl.define do
  factory :collaborator do
    role Collaborator::ROLE_CREATOR
    text
    maker
  end
end
