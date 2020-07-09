FactoryBot.define do
  factory :project_exportation do
    association :project
    association :export_target
    project_export { nil }
  end
end
