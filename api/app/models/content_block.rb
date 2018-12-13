class ContentBlock < ApplicationRecord
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  include Concerns::ProxiedAssociations

  # Ordering
  acts_as_list scope: :project

  delegate :serializer, to: :class

  belongs_to :project
  has_many :content_block_references, dependent: :destroy

  validate :associations_are_valid!

  private

  def associations_are_valid!
    reference_configurations.each do |config|
      next unless config.required

      return true if __send__(config.name).present?
      errors.add(config.name, "can't be blank")
    end
  end

  class << self
    def serializer
      "#{name}Serializer".constantize
    end
  end
end
