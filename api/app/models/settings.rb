# frozen_string_literal: true

class Settings < ApplicationRecord
  include Attachments
  include Authority::Abilities
  include HasFormattedAttributes
  include SerializedAbilitiesFor

  # @see SettingSections
  SECTIONS = SettingSections::NAMES.dup.freeze

  self.filter_attributes = [*SECTIONS.dup, :fa_cache]

  attribute :general, SettingSections::General.to_type, default: {}
  attribute :email, SettingSections::Email.to_type, default: {}
  attribute :ingestion, SettingSections::Ingestion.to_type, default: {}
  attribute :integrations, SettingSections::Integrations.to_type, default: {}
  attribute :rate_limiting, SettingSections::RateLimiting.to_type, default: {}
  attribute :secrets, SettingSections::Secrets.to_type, default: {}
  attribute :theme, SettingSections::Theme.to_type, default: {}

  validates :singleton_guard, inclusion: [0], uniqueness: true

  manifold_has_attached_file :press_logo, :image
  manifold_has_attached_file :press_logo_footer, :image
  manifold_has_attached_file :press_logo_mobile, :image
  manifold_has_attached_file :favicon, :favicon

  has_formatted_attributes :copyright, include_wrap: false, container: :general
  has_formatted_attributes :restricted_access_body, include_wrap: false, container: :general
  has_formatted_attributes :string_data_use_copy, include_wrap: false, container: :theme
  has_formatted_attributes :string_cookies_banner_copy, include_wrap: false, container: :theme

  delegate :default_restricted_access_heading, :default_restricted_access_body, :public_reading_groups_disabled?, to: :general

  after_update :update_oauth_providers!

  # @!group Derived Settings

  # @return [Boolean]
  def google_analytics_enabled
    integrations.ga_four_tracking_id?
  end

  alias google_analytics_enabled? google_analytics_enabled

  # @return [Boolean]
  def manifold_analytics_enabled
    !general.disable_internal_analytics?
  end

  alias manifold_analytics_enabled? manifold_analytics_enabled

  # @!endgroup

  SECTIONS.each do |section|
    include SettingSections::Accessors.new(section)
  end

  # @param [:all, ManifoldEnv::Types::THROTTLED_CATEGORIES] category
  # @return [void]
  def disable_rate_limiting!(category)
    rate_limiting.disable! category

    rate_limiting_will_change!

    save!
  end

  # @param [:all, ManifoldEnv::Types::THROTTLED_CATEGORIES] category
  # @return [void]
  def enable_rate_limiting!(category)
    rate_limiting.enable! category

    rate_limiting_will_change!

    save!
  end

  # @param [Symbol] section
  # @param [{Symbol => String}] new_values
  # @return [void]
  def merge_settings_into!(section, **new_values)
    if SettingSections.valid?(section)
      self[section].merge!(**new_values)
      __send__(:"#{section}_will_change!")
    else
      # :nocov:
      # We ignore invalid sections that might be the result of a typo
      # in an env var as per original behavior. Now we just log it.
      Rails.logger.warn("Tried to set unknown setting section: #{section.inspect}")
      # :nocov:
    end
  end

  # @see [SettingsService::UpdateFromEnv]
  # @return [void]
  def update_from_environment!
    SettingsService::UpdateFromEnv.run! settings: self
  end

  # @see [SettingsService::UpdateOauthProviders]
  # @return [void]
  def update_oauth_providers!
    SettingsService::UpdateOauthProviders.run!
  end

  # @param [User, nil] current_user
  # @return [Hash]
  def calculated(current_user = nil)
    {
      has_visible_home_project_collections: ProjectCollection.by_visible_on_homepage.exists?,
      has_visible_projects: Project.with_read_ability(current_user).exists?,
      has_visible_journals: Journal.with_read_ability(current_user).exists?,
      has_project_collections: ProjectCollection.count.positive?,
      manifold_version: self.class.manifold_version,
      require_terms_and_conditions: Page.by_purpose(:terms_and_conditions).exists?,
      google_analytics_enabled: google_analytics_enabled,
      manifold_analytics_enabled: manifold_analytics_enabled,
    }
  end

  class << self
    # Fetch the current instance from the `RequestStore`.
    #
    # This avoids needless repeated trips to the database.
    #
    # @return [Settings]
    def current
      RequestStore.fetch(:current_settings) do
        instance
      end
    end

    # Check if we {.update_from_environment? should update from the environment}
    # and {#update_from_environment! do so}.
    # @return [void]
    def potentially_update_from_environment!
      return unless update_from_environment?

      instance.update_from_environment!
    end

    # @return [Settings]
    def instance
      where(singleton_guard: 0).first_or_create!
    end

    # @!attribute [r] manifold_version
    # @!scope class
    # @see SettingsService::ReadManifoldVersion
    # @return [Gem::Version]
    def manifold_version
      @manifold_version ||= SettingsService::ReadManifoldVersion.run!
    end

    def require_terms_and_conditions?
      RequestStore.fetch(:require_terms_and_conditions) do
        instance.calculated[:require_terms_and_conditions]
      end
    end

    def google_analytics_enabled?
      RequestStore.fetch(:google_analytics_enabled) do
        instance.calculated[:google_analytics_enabled]
      end
    end

    def manifold_analytics_enabled?
      RequestStore.fetch(:manifold_analytics_enabled) do
        instance.calculated[:manifold_analytics_enabled]
      end
    end

    def manage_from_env?
      ManifoldApi::Container["utility.booleanize"].env("MANAGE_SETTINGS_FROM_ENV")
    end

    def update_from_environment?
      manage_from_env? && table_exists?
    end
  end
end
