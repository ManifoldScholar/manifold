class ContentBlock < ApplicationRecord
  include Concerns::ProxiedAssociations

  # Authorization
  include Authority::Abilities
  include Concerns::SerializedAbilitiesFor

  # Ordering
  acts_as_list scope: :project, top_of_list: 0

  delegate :serializer, to: :class
  delegate :available_attributes, to: :class
  delegate :configurable?, to: :class
  delegate :orderable?, to: :class
  delegate :hideable?, to: :class

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
      matcher = if association.is_a? Array
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

    def available_attributes
      @configured_attributes&.keys
    end

    def permitted_attributes_for(type)
      Object.const_get(type).send :available_attributes
    end

    def permitted_relationships_for(type)
      Object.const_get(type).send :available_relationships
    end

    def configurable?
      available_attributes.present? || available_relationships.present?
    end

    def orderable?
      true
    end

    def hideable?
      true
    end
  end
end
