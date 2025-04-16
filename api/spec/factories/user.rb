# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    transient do
      authored_projects { [] }
      edited_projects { [] }
      property_managed_projects { [] }
    end

    first_name { "John" }
    last_name { "Rambo" }
    sequence(:email) { |n| "john#{SecureRandom.uuid}-@rambo.com" }
    password { "bananarambo" }
    password_confirmation { "bananarambo" }
    notification_preferences_by_kind do
      Hash.new({ # rubocop:todo Lint/SharedMutableDefault
      digest: NotificationFrequency[:daily],
      followed_projects: NotificationFrequency[:always]
    })
    end

    trait :admin do
      role { :admin }
    end

    trait :editor do
      role { :editor }
    end

    trait :project_creator do
      role { :project_creator }
    end

    trait :marketeer do
      role { :marketeer }
    end

    trait :reader do
      role { :reader }
    end

    after(:create) do |user, evaluator|
      role_mapping = {
        project_author: Array(evaluator.authored_projects),
        project_editor: Array(evaluator.edited_projects),
        project_property_manager: Array(evaluator.property_managed_projects),
      }

      role_mapping.each do |role, projects|
        projects.each do |project|
          user.add_role role, project
        end
      end
    end

    trait :with_confirmed_email do
      after(:create) do |user, _evaluator|
        user.mark_email_confirmed!
      end
    end
  end
end
