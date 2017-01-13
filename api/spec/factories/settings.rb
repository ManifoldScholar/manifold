FactoryGirl.define do
  factory :setting, class: 'Settings' do
    application ""
    singleton_guard 1
  end
end
