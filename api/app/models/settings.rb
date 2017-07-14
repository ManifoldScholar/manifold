class Settings < ApplicationRecord
  # Concerns
  include Authority::Abilities
  include Attachments

  SECTIONS = [:general, :integrations, :secrets, :email].freeze

  # Create merge setters for the various settings sections. Initialize the hashes.
  SECTIONS.each do |section|
    attribute section, :indifferent_hash, default: {}
    class_eval <<-RUBY, __FILE__, __LINE__ + 1
    def #{section}=(new_values)
      value = merge_settings_into!(:#{section}, new_values.symbolize_keys)
      write_attribute(:#{section}, value)
    end
    RUBY
  end

  # Validation
  validates :singleton_guard, inclusion: [0], uniqueness: true

  # Attachments
  manifold_has_attached_file :press_logo, :image

  after_update :update_oauth_providers!

  # @param [Symbol] section
  # @param [{Symbol => String}] new_values
  # @return [void]
  def merge_settings_into!(section, **new_values)
    current = self[section]
    # raise TypeError, "#{section} is not mergeable!" unless current.respond_to?(:merge)
    return unless current.respond_to?(:merge)
    self[section] = current.merge(new_values)
  end

  # @see [Settings::UpdateFromEnv]
  # @return [void]
  def update_from_environment!
    Settings::UpdateFromEnv.run! settings: self
  end

  # @see [Settings::UpdateOauthProviders]
  # @return [void]
  def update_oauth_providers!
    Settings::UpdateOauthProviders.run!
  end

  class << self
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

    def update_from_environment?
      ENV["MANAGE_SETTINGS_FROM_ENV"].present? && table_exists?
    end
  end
end
