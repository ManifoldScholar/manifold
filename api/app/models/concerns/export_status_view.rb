# rubocop:disable Metrics/AbcSize
module ExportStatusView
  extend ActiveSupport::Concern

  include View

  PRUNABLE_AGE = 1.week

  included do
    scope :autoexported, -> { where(autoexport: true) }
    scope :current, -> { where(current: true) }
    scope :stale, -> { where(stale: true) }
    scope :exported_before, ->(time) { where(arel_table[:exported_at].lt(time)) }
    scope :prunable, -> { stale.exported_before(PRUNABLE_AGE.ago) }
  end

  class_methods do
    # @return [void]
    def configure!(parent_model: derive_parent_model, export_model: derive_export_model)
      raise "Already configured" if @view_configuration.present?

      @view_configuration = c = ExportStatusViewConfiguration.new parent_model, export_model

      belongs_to c.parent_key, inverse_of: inverse_association_name
      belongs_to c.export_key, inverse_of: inverse_association_name

      scope c.by_parent_scope_name, ->(model) { where c.parent_key => model }
      scope c.by_export_scope_name, ->(model) { where c.export_key => model }
      scope :prunable_export_ids, -> { prunable.select(c.export_foreign_key) }
      scope c.current_parent_ids_scope_name, -> { current.select(c.parent_foreign_key) }
    end

    # @api private
    # @return [Class]
    def derive_export_model
      model_name.name.gsub(/Status\z/, "").constantize
    end

    # @return [Class]
    def derive_parent_model
      model_name.name.gsub(/ExportStatus\z/, "").constantize
    end

    def inverse_association_name
      @inverse_association_name ||= model_name.collection.to_sym
    end
  end

  # @api private
  class ExportStatusViewConfiguration
    extend Dry::Initializer
    extend Memoist

    param :parent_model, Types.Interface(:model_name)
    param :export_model, Types.Interface(:model_name)

    delegate :model_name, to: :export_model, prefix: :export
    delegate :model_name, to: :parent_model, prefix: :parent

    def by_parent_scope_name
      :"by_#{parent_key}"
    end

    def by_export_scope_name
      :"by_#{export_key}"
    end

    def current_parent_ids_scope_name
      :"current_#{parent_key}_ids"
    end

    memoize def export_foreign_key
      :"#{export_key}_id"
    end

    memoize def export_key
      export_model_name.i18n_key
    end

    memoize def parent_foreign_key
      :"#{parent_key}_id"
    end

    memoize def parent_key
      parent_model_name.i18n_key
    end
  end
end
# rubocop:enable Metrics/AbcSize
