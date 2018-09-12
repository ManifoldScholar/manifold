FactoryBot.define do
  factory :project_collection do
    title "A Project Collection"
    sort_order "title_asc"
    visible true
    homepage false
    smart false
    icon "lamp"
    association :creator, factory: :user
  end
end
