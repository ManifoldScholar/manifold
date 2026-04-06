# frozen_string_literal: true

FactoryBot.define do
  factory :text_title do
    kind { TextTitle::KIND_MAIN }
    value { "Title" }
    text
  end
end
