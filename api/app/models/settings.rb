class Settings < ApplicationRecord

  # Concerns
  include Authority::Abilities
  include Attachments

  # Validation
  validates :singleton_guard, inclusion: [0]

  # Attachments
  manifold_has_attached_file :press_logo, :image

  def self.instance
    row = first
    raise ActiveRecord::RecordNotFound unless row
    row
  rescue ActiveRecord::RecordNotFound
    # slight race condition here, but it will only happen once
    row = Settings .new
    row.singleton_guard = 0
    row.save!
    row
  end

  def general
    ActiveSupport::HashWithIndifferentAccess.new(self[:general])
  end

  def integrations
    ActiveSupport::HashWithIndifferentAccess.new(self[:integrations])
  end

  def secrets
    ActiveSupport::HashWithIndifferentAccess.new(self[:secrets])
  end

  def general=(value)
    base = general || {}
    new = base.merge(value)
    self[:general] = new
  end

  def integrations=(value)
    base = integrations || {}
    new = base.merge(value)
    self[:integrations] = new
  end

  def secrets=(value)
    base = secrets || {}
    new = base.merge(value)
    self[:secrets] = new
  end

  def read_google_private_key
    env_key_path = ENV["MANIFOLD_SETTING_SECRETS_GOOGLE_PRIVATE_KEY"]
    path = Rails.application.root.join("..", env_key_path)
    return nil unless File.exist?(path) && File.file?(path)
    File.read(path)
  end

  # rubocop:disable Metrics/AbcSize
  def update_from_environment
    ENV.select { |key| key.start_with? "MANIFOLD_SETTING" }.each do |key, value|
      next if key == "MANIFOLD_SETTING_SECRETS_GOOGLE_PRIVATE_KEY"
      parts = key.split("_")
      section = parts.third.downcase
      setting = parts[3..-1].join("_").downcase
      set_value = {}
      set_value[setting] = value
      send("#{section}=", set_value)
    end
    gpk = read_google_private_key
    send("secrets=", google_private_key: gpk) if gpk
    save
  end
end
