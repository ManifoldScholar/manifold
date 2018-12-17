FactoryBot.define do
  factory :content_block_reference do
    kind { "resources" }
    content_block
    association :referencable, factory: :resource
  end
end
