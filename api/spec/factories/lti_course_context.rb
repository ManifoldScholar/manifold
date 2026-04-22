# frozen_string_literal: true

FactoryBot.define do
  factory :lti_course_context do
    lti_deployment
    sequence(:context_id) { |n| "ctx-#{n}" }
    context_title { "Example Course" }
    context_label { "EX101" }
    context_type  { "CourseSection" }

    trait :linked_to_reading_group do
      reading_group
    end
  end
end
