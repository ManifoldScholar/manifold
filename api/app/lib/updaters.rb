require "active_support/core_ext/string"

# Updaters are responsible for mapping JSON-API structured params to model updates.
# This module acts as a base mix-in for model-specific updaters.
module Updaters
  attr_accessor :id, :type, :data

  def initialize(params)
    @attributes = params[:data][:attributes] || {}
    @relationships = params[:data][:relationships]
  end

  def attributes
    @attributes
  end

  def relationships
    @relationships
  end

  def update(model)
    model.assign_attributes(adjusted_attributes) if attributes
    update_relationships(model)
    saved = model.save
    try(:post_update, model) if saved
    model.reload if model.id && saved
    model
  end

  def post_update(model)
    update_position(model)
  end

  protected

  # rubocop:disable Metrics/CyclomaticComplexity
  def update_relationships(model)
    return unless relationships
    relationships.to_h.each do |name, relationship|
      models = relationship[:data]
      if models.respond_to?(:has_key?) || models.nil?
        update_belongs_to(model, name, models) && next
      end
      update_has_many(model, name, models) && next if models.respond_to?(:each)
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
    model.send(name.to_s).try(:sort, value)
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
  end
end
