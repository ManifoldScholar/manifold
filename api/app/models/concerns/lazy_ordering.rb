# frozen_string_literal: true

module LazyOrdering
  extend ActiveSupport::Concern

  SimpleSortDirection = Dry::Types["coercible.string"].default("asc").enum("asc", "desc").fallback("asc")

  module ClassMethods
    # @param [Symbol] column
    # @return [ActiveRecord::Relation]
    def lazily_order(column, raw_direction = :asc)
      base = lazy_order_scope_for column

      expr = lazy_order_expr_for(column, raw_direction: raw_direction)

      base.order(expr)
    end

    def lazy_order_column_for(column)
      method_name = :"#{column}_order_column"

      if respond_to?(method_name)
        public_send(method_name)
      else
        column
      end.then { |expr| arel_attrify(expr) }
    end

    def lazy_order_expr_for(column, raw_direction: "asc")
      direction = ::Filtering::Types::SortDirection[raw_direction]

      method_name = :"#{column}_order_expression"

      if respond_to?(method_name)
        public_send(method_name, direction: direction)
      else
        attr = lazy_order_column_for column

        attr.public_send(direction)
      end
    end

    # @param [Symbol] column
    # @return [ActiveRecord::Relation]
    def lazy_order_scope_for(column)
      scope_name = :"prepare_order_for_#{column}"

      if respond_to?(scope_name)
        all.public_send(scope_name)
      else
        all
      end
    end
  end
end
