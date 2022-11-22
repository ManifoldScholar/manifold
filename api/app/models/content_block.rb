require "sti_preload"

class ContentBlock < ApplicationRecord
  include ProxiedAssociations
  include ActiveSupport::Configurable
  include StiPreload

  config.required_render_attributes = [].freeze

  # Authorization
  include Authority::Abilities
  include SerializedAbilitiesFor

  # Ordering
  acts_as_list scope: :project

  enum access: {
    always: 0,
    authorized: 1,
    unauthorized: 2
  }

  delegate :serializer, to: :class
  delegate :available_attributes, to: :class
  delegate :configurable?, to: :class
  delegate :orderable?, to: :class
  delegate :hideable?, to: :class

  belongs_to :project
  has_many :content_block_references, dependent: :destroy

  validate :references_are_valid!
  validate :references_belong_to_project!
  validate :render_attributes_present!, on: :render

  scope :visible, -> { where(visible: true) }

  def renderable?
    valid? :render
  end

  def render_errors
    return {} if renderable?

    errors.to_hash.slice(*config.required_render_attributes)
  ensure
    errors.clear
  end

  def incomplete_render_attributes
    render_errors.keys
  end

  private

  def render_attributes_present!
    config.required_render_attributes.each do |attr|
      next if __send__(attr).present?

      errors.add(attr.to_sym, "must be present to render content block")
    end
  end

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

  def references_are_valid!
    reference_configurations.each do |config|
      next unless config.required

      return true if __send__(config.name).present?

      errors.add(config.name, "can't be blank")
    end
  end

  class << self
    def serializer
      "::V1::#{name}Serializer".constantize
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
      true
      # available_attributes.present? || available_relationships.present?
    end

    def orderable?
      true
    end

    def hideable?
      true
    end
  end
end
