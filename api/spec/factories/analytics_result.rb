FactoryBot.define do
  factory :analytics_result, class: Analytics::Reports::AnalyticsResult do

    data do
      { omg: "hi" }
    end
    
  end
end
