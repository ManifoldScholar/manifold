module Analytics
  class Visit < ApplicationRecord
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
    ].freeze

    self.table_name = "analytics_visits"

    has_many :events, class_name: "Analytics::Event", dependent: :destroy

    before_create :initialize_ended_at

    validates :visit_token, :visitor_token, presence: true, uuid: true

    private

    def initialize_ended_at
      self.ended_at ||= started_at
    end
  end
end
