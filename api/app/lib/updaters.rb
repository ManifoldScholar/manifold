# frozen_string_literal: true

# Updaters are responsible for mapping JSON-API structured params to model updates.
# This module acts as a base mix-in for model-specific updaters.
module Updaters
  extend ActiveSupport::Concern

  included do
    extend ActiveModel::Callbacks

    define_model_callbacks :update_attributes, :update_relationships, :update, :save
  end

  attr_accessor :id, :type, :data, :attributes, :relationships, :context

  def initialize(params, context = nil)
    @attributes = params.dig(:data, :attributes)&.to_h || {}
    @relationships = params.dig(:data, :relationships)&.to_h || {}
    @context = context
  end

  def update_without_save(model, creator: nil)
    @model = model
    run_callbacks "update" do
      assign_creator!(model, creator)
      assign_attributes!(model)
      update_relationships!(model)
    end
    model
  end

  def update(model, creator: nil)
    @model = model
    update_without_save(model, creator: creator)
    post_update(model) if save_model(model)
    model
  end

  def post_update(model)
    @model = model
    update_position(model)
  end

  protected

  def save_model(model)
    @model = model

    saved = false

    run_callbacks "save" do
      saved = model.save(context: context)
    end

    model.reload if model.id && saved

    saved
  end

  def attachment_fields
    []
  end

  def assign_creator!(model, creator)
    return unless creator && model.respond_to?("creator=")

    model.creator = creator
  end

  def assign_attributes!(model)
    return unless attributes

    run_callbacks "update_attributes" do
      attr = adjusted_attributes
      attachmentize_attributes!(attr, model)
      model.assign_attributes(attr)
    end
  end

  def attachmentize_attributes!(attr, model)
    return unless attachment_fields.count.positive?

    attachment_fields.each do |field|
      remove_key = "remove_#{field}".to_sym
      remove_param = attr.extract!(remove_key)[remove_key]
      attachment = attachment_from_params!(attr, field, model)
      attr[field] = attachment unless attachment.nil? || remove_param
      attr[field] = nil if remove_param
    end
  end

  def attachment_from_params!(attributes, key, model)
    params = attributes.extract!(key)[key]
    return nil if params.nil?

    data, filename, alt_text = params.values_at(:data, :filename, :alt_text)

    return update_attachment_alt_text(alt_text, key, model) if data.nil? && alt_text

    Shrine.data_uri(data).tap do |data_file|
      data_file.original_filename = filename
      data_file.alt_text = alt_text if alt_text
    end
  rescue ::Shrine::Plugins::DataUri::ParseError
    nil
  end

  def update_attachment_alt_text(alt_text, key, model)
    attachment = model.send(key)

    return unless attachment.present?

    attachment.add_metadata alt_text: alt_text

    attachment
  end

  def adjusted_relationships
    relationships
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  def update_relationships!(model)
    return unless adjusted_relationships

    run_callbacks "update_relationships" do
      adjusted_relationships.to_h.each do |name, relationship|
        models = relationship[:data]
        update_belongs_to(model, name, models) && next if models.respond_to?(:has_key?) || models.nil?
        update_has_many(model, name, models) && next if models.respond_to?(:each)
      end
    end
  end
  # rubocop:enable Metrics/CyclomaticComplexity

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
      value = to_add[:id].present? ? klass.find(to_add[:id]) : nil
      model.send("#{name}=", value)
    end
  end

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
