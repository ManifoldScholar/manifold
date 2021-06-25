module Storage
  class ShrineProperties

    class << self

      def fetch
        models_with_shrine_properties.inject({}) { |memo, model| memo.tap { |m| m[model.name.to_sym] = shrine_attributes_for(model) } }
      end

      private

      def models_with_shrine_properties
        models.select { |model| shrine_columns_for(model).present? }
      end

      def shrine_attributes_for(model)
        shrine_columns_for(model).map { |column| column.delete_suffix("_data").to_sym }
      end

      def shrine_columns_for(model)
        model.attribute_types.select { |k, v| v.type == :jsonb && k.end_with?("_data") }.keys
      end

      def models
        tables.map do |table|
          table.classify.constantize
        rescue StandardError
          nil
        end.compact + plural_models
      end

      def plural_models
        [Settings]
      end

      def tables
        ActiveRecord::Base.connection.tables - %w(schema_migrations comment_hierarchies comments) + %w(settings)
      end

    end

  end
end
