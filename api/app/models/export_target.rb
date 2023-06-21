class ExportTarget < ApplicationRecord
  extend FriendlyId

  include Authority::Abilities
  include SerializedAbilitiesFor

  classy_enum_attr :strategy, enum: "ExportTargetStrategy", default: :unknown

  has_encrypted :configuration, type: ExportStrategies::Configuration.to_type

  friendly_id :name, use: :slugged

  after_initialize :ensure_configuration!

  before_validation :sync_strategy!
  after_validation :merge_configuration_errors

  validates :configuration, presence: true, store_model: true
  validates :name, presence: true, uniqueness: true

  private

  # @return [void]
  def ensure_configuration!
    self.configuration ||= {}
  end

  def merge_configuration_errors
    config_errors = configuration.errors.full_messages.map { |e| "^#{e}" }
    config_errors.each do |msg|
      errors.add(:configuration, msg)
    end
  end

  # @return [void]
  def sync_strategy!
    configuration.strategy = strategy.to_sym

    self.configuration = configuration
  end
end
