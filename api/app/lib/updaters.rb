require "active_support/core_ext/string"

# Updaters are responsible for mapping JSON-API structured params to model updates.
# This module acts as a base mix-in for model-specific updaters.
module Updaters
  attr_accessor :id, :type, :data

  def initialize(params)
    @attributes = params[:data][:attributes]
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
    model.reload if model.id && saved
    model
  end

  def update_relationships(model)
    return unless relationships
    relationships.to_h.each do |name, relationship|
      models = relationship[:data]
      update_belongs_to(model, name, models) && next if models.respond_to?(:has_key?)
      update_has_many(model, name, models) && next if models.respond_to?(:each)
    end
  end

  def update_belongs_to(model, name, to_add)
    polymorphic = model.class.reflect_on_association(name).options.dig(:polymorphic)
    if polymorphic
      klass = to_add[:type].classify.constantize
      value = klass.find(to_add[:id])
    else
      value = to_add[:id]
    end
    model.send("#{name}=", value)
  end

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
    attributes
  end
end
