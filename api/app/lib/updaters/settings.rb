module Updaters
  # Updates a User model from JSON-API style params
  class Settings
    include ::Updaters

    def attachment_fields
      [:press_logo, :press_logo_footer, :press_logo_mobile, :favicon]
    end

    def adjusted_attributes
      attributes.deep_dup.with_indifferent_access.tap do |attrs|
        attrs.deep_merge! adjust_google_config attrs if attrs[:google_service].present?
      end
    end

    def adjust_google_config(attrs)
      return attrs unless attrs[:google_service]

      service_config = attrs.delete(:google_service)
      raw_data = service_config[:data]
      return unless raw_data.present?

      data = JSON.parse(URI::Data.new(raw_data).data)

      ::SettingsService::AdjustGoogleConfig.run! config: data
    end

  end
end
