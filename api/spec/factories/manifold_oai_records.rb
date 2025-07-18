# frozen_string_literal: true

FactoryBot.define do
  factory :manifold_oai_record do
    oai_dc_content { "" }
    association :source, factory: :project, draft: true
  end
end
