class ExportTarget < ApplicationRecord
  extend FriendlyId

  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  classy_enum_attr :strategy, enum: "ExportTargetStrategy", default: :unknown

  encrypts :configuration, type: ExportStrategies::Configuration.to_type

  friendly_id :name, use: :slugged

  after_initialize :ensure_configuration!

  before_validation :sync_strategy!

  validates :configuration, presence: true, store_model: true
  validates :name, presence: true, uniqueness: true

  private

  # @return [void]
  def ensure_configuration!
    self.configuration ||= {}
  end

  # @return [void]
  def sync_strategy!
    configuration.strategy = strategy.to_sym

    self.configuration = configuration
  end
end
