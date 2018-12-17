class ContentBlock < ApplicationRecord
  include Concerns::ProxiedAssociations

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor
  self.authorizer_name = "ProjectRestrictedChildAuthorizer"

  # Ordering
  acts_as_list scope: :project

  delegate :serializer, to: :class
  delegate :permitted_attributes, to: :class

  belongs_to :project
  has_many :content_block_references, dependent: :destroy

  validate :references_are_valid!
  validate :references_belong_to_project!

  private

  # rubocop:disable Metrics/AbcSize
  def references_belong_to_project!
    reference_configurations.each do |config|
      association = __send__(config.name)
      return true unless association.present?
      matcher = if association.is_a? ActiveRecord::Relation
                  association.all? { |assoc| assoc.project == project }
                else
                  association.project == project
                end

      return true if matcher
      errors.add(config.name, "must belong to #{project.title}")
    end
  end
  # rubocop:enable Metrics/AbcSize

  def references_are_valid!
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

    # rubocop:disable Naming/PredicateName
    def has_configured_attributes(attributes)
      @configured_attributes = attributes

      class_eval <<~RUBY, __FILE__, __LINE__ + 1
        jsonb_accessor :configuration, @configured_attributes
      RUBY
    end
    # rubocop:enable Naming/PredicateName

    def permitted_attributes
      @configured_attributes.keys
    end
  end
end
