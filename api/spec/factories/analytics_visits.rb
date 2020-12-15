FactoryBot.define do
  factory :analytics_visit, class: Analytics::Visit do
    transient do
      visit_duration { 60.minutes }
    end

    visit_token { Faker::Internet.uuid }
    visitor_token { Faker::Internet.uuid }
    ip { Faker::Internet.ip_v4_address }
    user_agent { Faker::Internet.user_agent }
    referrer { "http://manifold.lvh" }
    referring_domain { "manifold.lvh" }
    landing_page { "http://manifold.lvh" }
    browser { "Chrome" }
    os { Faker::Computer.platform }
    device_type { "Desktop" }
    started_at { Time.current - (rand * 100).hours }
    ended_at { visit_duration.present? ? (started_at + visit_duration) : nil}
  end
end
