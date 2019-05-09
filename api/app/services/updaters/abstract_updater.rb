module Updaters
  # @abstract
  class AbstractUpdater < ActiveInteraction::Base
    isolatable!

    transactional!

    config.attachment_fields = []

    define_model_callbacks :update_attributes, :update_relationships, :update, :save

    META_INPUTS = %i(creator model relationships)

    record :creator, class: "User", default: nil

    object :model, class: "ApplicationRecord", default: nil

    hash :relationships, strip: false, default: proc { Hash.new }

    delegate :target_klass, to: :class

    set_callback :validate, :before, :ensure_model!

    # @return [ApplicationRecord]
    def execute
      @update_action = derive_update_action

      apply_data!

      run_callbacks :save do
        persist_model! model
      end

      return model
    end

    # @!attribute [r] attachment_fields
    # @return [<Symbol>]
    def attachment_fields
      Array(config.attachment_fields)
    end

    # @!attribute [r] update_action
    # @return [:create, :update]
    attr_reader :update_action

    def created?
      update_action == :create && valid?
    end

    def updated?
      update_action == :update && valid?
    end

    private

    # @return [void]
    def apply_data!
      run_callbacks :update do
        assign_creator!
        assign_attributes!
        update_relationships!
      end
    end

    # @return [void]
    def assign_creator!
      return unless given?(:creator) && model.respond_to?(:creator=)

      model.creator = creator
    end

    def assign_attributes!
      return if adjusted_attributes.blank?

      run_callbacks :update_attributes do
        model.assign_attributes adjusted_attributes
      end
    end

    # @!attribute [r] adjusted_attributes
    # @return [Hash]
    def adjusted_attributes
      @adjusted_attributes ||= adjust_attributes
    end

    # @return [<Symbol>]
    def inputs_to_exclude
      META_INPUTS
    end

    # @abstract
    # @return [Hash]
    def adjust_attributes
      inputs.except(*inputs_to_exclude).tap do |attributes|
        attachmentize_attributes! attributes
      end
    end

    # @param [Hash] attributes
    # @return [void]
    def attachmentize_attributes!(attributes)
      return if attachment_fields.blank?

      attachment_fields.each do |field|
        remove_key = :"remove_#{field}"

        should_remove = attributes.delete(remove_key).present?

        if should_remove
          attributes[field] = nil
        else
          params = attributes.delete(field) || {}

          attachment = compose Updaters::Meta::GetAttachment, params

          attributes[field] = attachment if attachment.present?
        end
      end
    end

    # @return [void]
    def update_relationships!
      return if relationships.blank?

      run_callbacks :update_relationships do
        relationships.to_h.each do |name, relationship|
          models = relationship[:data]

          if models.respond_to?(:has_key?) || models.nil?
            update_belongs_to! name, models
          elsif models.respond_to?(:each)
            update_has_many! name, models
          end
        end
      end
    end

    # @param [String] name
    # @param [Hash] to_add
    # @return [void]
    def update_belongs_to!(name, to_add)
      klass =
        if polymorphic_association?(name)
          to_add[:type].classify.constantize
        else
          reflect_on_association(name).klass
        end

      value = to_add.nil? ? nil : klass.find(to_add[:id])

      model.public_send :"#{name}=", nil
    end

    # @param [String] name
    # @param [<Hash>] to_add
    # @return [void]
    def update_has_many!(name, to_add)
      value = relationship_map name, to_add

      model.public_send :"#{name}=", value
    end

    # @param [String] name
    # @param [<Hash>] models
    # @return [<ApplicationRecord>]
    def relationship_map(name, models)
      related_class = reflect_on_association(name).klass

      models.map do |related_model|
        related_class.find(related_model[:id]) if related_model[:id]
      end.compact
    end

    # @return [Symbol]
    def derive_update_action
      model.persisted? ? :update : :create
    end

    def ensure_model!
      return if model.present?

      if target_klass.present?
        self.model = inputs[:model] = target_klass.new
      else
        errors.add :model, "must be provided"
      end
    end

    def options_for_association(name)
      reflect_on_association(name).options
    end

    def polymorphic_association?(name)
      options_for_association(name)[:polymorphic].present?
    end

    def reflect_on_association(name)
      model.class.reflect_on_association(name)
    end

    class << self
      def abstract_class?
        self == Updaters::AbstractUpdater
      end

      def attachment_field(name)
        hash name, strip: true, default: nil do
          string :data
          string :filename
        end

        boolean :"remove_#{name}", default: nil

        define_attachment_fields! name
      end

      # @param [<Symbol>] attachment_fields
      # @return [void]
      def define_attachment_fields!(*fields)
        config.attachment_fields = config.attachment_fields | fields.flatten.map!(&:to_sym)
      end

      # @see Updaters::Meta::HasPosition
      # @return [void]
      def has_position!
        include Updaters::Meta::HasPosition
      end

      # @!attribute [r] target_klass
      # @return [Class]
      def target_klass
        config.target_klass
      end

      # @param [Class] new_target_klass
      # @return [void]
      def target_klass!(new_target_klass)
        config.target_klass = new_target_klass
      end

      protected

      def inherited(subclass)
        # Infer the default target class
        subclass.infer_default_target_klass!

        subclass.__send__ :import_filters, AbstractUpdater if abstract_class?
      end

      # @return [Class, nil]
      def default_target_klass
        name.demodulize.classify.safe_constantize
      end

      # @return [Class, nil]
      def infer_default_target_klass!
        config.target_klass = default_target_klass if config.target_klass.blank?
      end
    end
  end
end
