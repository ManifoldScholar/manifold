module Refinements
  module HandleRenamedCollections
    refine ::ResourceCollection.singleton_class do
      def table_name
        if table_name_exists?(super)
          super
        elsif table_name_exists?("collections")
          self.table_name = "collections"
        else
          raise "Could not derive table name"
        end
      end

      def quoted_table_name
        connection.quote_table_name(table_name)
      end

      def table_name_exists?(name)
        connection.schema_cache.clear!

        connection.schema_cache.data_source_exists? name
      end

      def reset_column_information
        retval = super
        table_name
        retval
      end
    end

    refine ResourceCollection.const_get(:ActiveRecord_Relation) do
      delegate :table_name, to: :klass

      delegate :quoted_table_name, to: :klass
    end
  end
end
