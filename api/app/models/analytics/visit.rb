class Analytics::Visit < ApplicationRecord
  DEMOGRAPHICS_ATTRIBUTES = %i[
    ip
    user_agent
    referrer
    referring_domain
    landing_page
    browser
    os
    device_type
    utm_source
    utm_medium
    utm_term
    utm_content
    utm_campaign
    app_version
    os_version
    platform
  ]

  self.table_name = "analytics_visits"

  has_many :events, class_name: "Analytics::Event"
end
