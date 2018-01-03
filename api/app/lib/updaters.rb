require "active_support/core_ext/string"
require "active_support/concern"
require "active_support/callbacks"

# Updaters are responsible for mapping JSON-API structured params to model updates.
# This module acts as a base mix-in for model-specific updaters.
module Updaters
  extend ActiveSupport::Concern

  included do
    include ActiveSupport::Callbacks
    attr_accessor :id, :type, :data, :attributes, :relationships
    define_callbacks :update_attributes, :update_relationships, :update, :save
  end

  def initialize(params)
    @attributes = params.dig(:data, :attributes)&.to_h || {}
    @relationships = params.dig(:data, :relationships)&.to_h || {}
  end

  def update_without_save(model)
    @model = model
    run_callbacks "update" do
      assign_attributes!(model)
      update_relationships!(model)
    end
    model
  end

  def update(model)
    @model = model
    update_without_save(model)
    save_model(model)
    model
  end

  def post_update(model)
    @model = model
    update_position(model)
  end

  protected

  def save_model(model)
    @saved = false
    run_callbacks "save" do
      @saved = model.save
    end
    model.reload if model.id && @saved
    @saved = false
  end

  def attachment_fields
    []
  end

  def assign_attributes!(model)
    return unless attributes
    run_callbacks "update_attributes" do
      attr = adjusted_attributes
      attachmentize_attributes!(attr)
      model.assign_attributes(attr)
    end
  end

  # rubocop:disable Metrics/AbcSize
  def attachmentize_attributes!(attr)
    return unless attachment_fields.count.positive?
    attachment_fields.each do |field|
      attachment = attachment_from_params!(attr, field)
      attr[field] = attachment unless attachment.nil?
    end
    attachment_fields.each do |field|
      key = "remove_#{field}".to_sym
      remove_param = attr.extract!(key)[key]
      attr[field] = nil if remove_param
    end
  end
  # rubocop:enable Metrics/AbcSize

  def attachment_from_params!(attributes, key)
    params = attributes.extract!(key)[key]
    return nil if params.nil?
    data, filename = params.values_at(:data, :filename)
    attachment = Paperclip.io_adapters.for(data)
    attachment.original_filename = filename
    attachment
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def update_relationships!(model)
    return unless relationships
    run_callbacks "update_relationships" do
      relationships.to_h.each do |name, relationship|
        models = relationship[:data]
        if models.respond_to?(:has_key?) || models.nil?
          update_belongs_to(model, name, models) && next
        end
        update_has_many(model, name, models) && next if models.respond_to?(:each)
      end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

  # rubocop:disable Metrics/AbcSize
  def update_belongs_to(model, name, to_add)
    polymorphic = model.class.reflect_on_association(name).options.dig(:polymorphic)
    klass = if polymorphic
              to_add[:type].classify.constantize
            else
              model.class.reflect_on_association(name).class_name.constantize
            end
    if to_add.nil?
      model.send("#{name}=", nil)
    else
      value = klass.find(to_add[:id])
      model.send("#{name}=", value)
    end
  end
  # rubocop:enable Metrics/AbcSize

  def update_has_many(model, name, to_add)
    value = relationship_map(model, name, to_add)
    model.send("#{name}=", value)
  end

  def relationship_map(model, name, models)
    models.map do |related_model|
      if related_model.dig(:id)
        related_model_class = model.class.reflect_on_association(name).klass
        related_model_class.find(related_model[:id])
      end
    end
  end

  def adjusted_attributes
    return {} unless attributes
    clone = attributes.clone
    remove_relative_position!(clone)
    clone
  end

  def remove_relative_position!(attributes)
    return unless %w(up down top bottom).include?(attributes[:position])
    attributes.delete(:position)
  end

  # This method is a utility method, used to sort creator and contributor
  # collaborators after saving the model.
  def sort_collaborators(type)
    makers = relationships.to_h.dig "#{type}s", :data
    return unless makers && !makers.empty?
    @model.send("#{type}_collaborators").each do |collaborator|
      index = makers.find_index { |c| c[:id] == collaborator.maker_id }
      position = index + 1
      collaborator.set_list_position(position)
    end
  end

  def update_position(model)
    position = @attributes[:position]
    case position
    when "up"
      model.move_higher
    when "down"
      model.move_lower
    when "top"
      model.move_to_top
    when "bottom"
      model.move_to_bottom
    end
    # https://github.com/swanandp/acts_as_list/issues/23
    model.reload
  end
end
