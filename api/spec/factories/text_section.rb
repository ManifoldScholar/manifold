# frozen_string_literal: true

FactoryBot.define do
  factory :text_section do
    sequence(:position)
    kind { TextSection::KIND_SECTION }
    text
    ingestion_source

    name { "name" }

    trait :with_empty_body do
      body_json { {} }
    end

    trait :with_simple_body do
      body_json do
        {
          "node_uuid" => "A",
          "tag" => "section",
          "node_type" => "element",
          "children" => [
            {
              "node_uuid" => "B",
              "tag" => "p",
              "node_type" => "element",
              "children" => [
                {
                  "node_uuid" => "C",
                  "node_type" => "text",
                  "content" => "This is a sentence with"
                },
                {
                  "node_uuid" => "D",
                  "tag" => "i",
                  "node_type" => "element",
                  "children" => [
                    {
                      "node_uuid" => "E",
                      "node_type" => "text",
                      "content" => "italic text"
                    }
                  ]
                },
                {
                  "node_uuid" => "F",
                  "node_type" => "text",
                  "content" => "followed by regular text"
                }
              ]
            },
            {
              "node_uuid" => "G",
              "tag" => "p",
              "node_type" => "element",
              "children" => [
                {
                  "node_uuid" => "H",
                  "node_type" => "text",
                  "content" => "And another sentence"
                }
              ]
            }
          ]
        }
      end
    end
  end
end
