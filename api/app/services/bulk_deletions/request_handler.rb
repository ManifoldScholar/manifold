# frozen_string_literal: true

module BulkDeletions
  # @see API::V1::BulkDeletionsController
  class RequestHandler
    include Dry::Core::Constants
    include Dry::Monads[:result, :do]
    include Dry::Initializer[undefined: false].define -> do
      option :model_klass, Types::Class

      option :noop, Types::Params::Bool, default: proc { false }

      option :filters, Types::Filters, default: proc { EMPTY_HASH }

      option :raw_ids, Types::IDList, default: proc { EMPTY_ARRAY }

      option :user, Types::User.optional, optional: true
    end

    # @return [ActiveRecord::Relation]
    attr_reader :base_scope

    # @return [{ Symbol => Integer }]
    attr_reader :deleted

    # @return [<String>]
    attr_reader :ids

    def call
      prepare!

      delete_with_ids!

      delete_with_filters!

      wrap_up!

      Success deleted
    end

    private

    # @return [void]
    def prepare!
      @base_scope = build_base_scope

      @deleted = {
        ids: 0,
        filters: 0,
        total: 0,
      }

      @ids = raw_ids.compact_blank
    end

    # @return [void]
    def delete_with_ids!
      return if ids.blank?

      ids_scope = base_scope.where(id: ids)

      delete_with! ids_scope, delete_key: :ids
    end

    # @return [void]
    def delete_with_filters!
      return if filters.blank? || !(model_klass < ::Filterable)

      sans_filter_sql = base_scope.apply_filtering_loads.to_sql

      filter_scope = model_klass.filtered(**filters, scope: base_scope, user: user, skip_pagination: true).reorder(nil).limit(nil).offset(nil)

      with_filter_sql = filter_scope.to_sql

      # Catch case where unsupported filters are provided but should be ignored
      # :nocov:
      return if sans_filter_sql == with_filter_sql
      # :nocov:

      delete_with! filter_scope, delete_key: :filters
    end

    # @param [ActiveRecord::Relation] scope
    # @param [:ids, :filters] delete_key
    # @return [void]
    def delete_with!(scope, delete_key:)
      if noop
        @deleted[delete_key] = scope.count

        return
      end

      scope.find_each do |record|
        record.async_destroy

        @deleted[delete_key] += 1
      end
    end

    # @return [void]
    def wrap_up!
      @deleted[:total] = @deleted.values_at(:ids, :filters).sum
    end

    # @return [ActiveRecord::Relation]
    def build_base_scope
      base = model_klass.all

      if model_klass == ::User && user.present?
        # A user cannot delete themselves.
        base = base.where.not(id: user.id)
      end

      return base
    end
  end
end
