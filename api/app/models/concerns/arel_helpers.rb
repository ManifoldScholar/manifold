# Shared collection of (mostly Arel) class-level helpers for working with advanced
# SQL selections.
#
# rubocop:disable Style/StringLiterals
# @see https://www.postgresql.org/docs/9.5/static/functions-json.html JSON functions and operators in PostgreSQL
module ArelHelpers
  extend ActiveSupport::Concern

  TEXT_ARRAY = ActiveRecord::ConnectionAdapters::PostgreSQL::OID::Array.new(ActiveRecord::Type::Text.new)

  class_methods do
    # @!group JSON methods

    # Use the `@>` operator to test if the given `attribute` contains `values` (auto-cast to JSONB)
    #
    # @param [Symbol] attribute
    # @param [{ Symbol => Object }] values
    # @return [Arel::Nodes::InfixOperator]
    def arel_json_contains(attribute, **values)
      arel_infix '@>', arel_attrify(attribute), arel_cast(values.to_json, 'jsonb')
    end

    # Use the `->>` operator to select a top-level `property_name` from `attribute`.
    #
    # @param [Symbol] attribute
    # @param [Symbol, String] property_name
    # @return [Arel::Nodes::InfixOperator]
    def arel_json_get_as_text(attribute, property_name)
      arel_infix '->>', arel_attrify(attribute), arel_quote(property_name)
    end

    def arel_json_get_path_as_text(attribute, *path_parts)
      raise "Must have at least one part" unless path_parts.present?

      arel_infix '#>>', arel_attrify(attribute), arel_encode_text_array(*path_parts)
    end

    # Use the `?` operator to test if the given JSONB `attribute`
    # has a top-level key matching `property_name`.
    #
    # @param [Symbol] attribute
    # @param [Symbol, String] property_name
    # @return [Arel::Nodes::InfixOperator]
    def arel_json_has_key(attribute, property_name)
      arel_infix ??, arel_attrify(attribute), arel_quote(property_name)
    end

    # Test if both the key exists and has a non-nil value.
    #
    # @param [Symbol] attribute
    # @param [Symbol, String] property_name
    # @return [Arel::Nodes::And(Arel::Nodes::InfixOperator, Arel::Nodes::NotEqual)]
    def arel_json_has_present_key(attribute, property_name)
      arel_json_has_key(attribute, property_name).and(arel_json_property_not_eq(attribute, property_name, nil))
    end

    # Test if the a value fetched from {.arel_json_get_as_text}
    # *equals* the provided `value`.
    #
    # @param [Symbol] attribute
    # @param [Symbol, String] property_name
    # @param [Object] value
    # @see .arel_json_get_as_text
    # @return [Arel::Nodes::Equality]
    def arel_json_property_eq(attribute, property_name, value)
      expr = arel_json_get_as_text(attribute, property_name)

      case value
      when Array
        exprs = value.map do |inner_value|
          arel_json_property_eq(attribute, property_name, inner_value)
        end

        arel_or_expressions(exprs)
      when FalseClass, TrueClass
        arel_cast(expr, 'boolean').eq(value)
      when Numeric
        arel_cast(expr, 'numeric').eq(value)
      else
        expr.eq(value)
      end
    end

    def arel_json_property_path_eq(attribute, *path_parts)
      value = path_parts.pop

      expr = arel_json_get_path_as_text(attribute, path_parts)

      case value
      when Array
        expr.in value
      else
        expr.eq value
      end
    end

    def arel_json_property_path_numeric_compare(attribute, *path_parts, operator:, value:, default: 0)
      expr = arel_json_get_path_as_text(attribute, path_parts)

      arel_coalesce(arel_cast(expr, 'numeric'), default).__send__(operator, value)
    end

    # Test if the a value fetched from {.arel_json_get_as_text}
    # *does not equal* the provided `value`.
    #
    # @param [Symbol] attribute
    # @param [Symbol, String] property_name
    # @param [Object] value
    # @see .arel_json_get_as_text
    # @return [Arel::Nodes::NotEqual]
    def arel_json_property_not_eq(attribute, property_name, value)
      arel_json_get_as_text(attribute, property_name).not_eq(value)
    end

    # @return [Arel::Nodes::Case]
    def arel_json_safe_array_length(attribute)
      column = arel_attrify attribute

      arel_case(arel_named_fn("jsonb_typeof", column)).tap do |stmt|
        stmt.when(arel_quote("array")).then(arel_named_fn("jsonb_array_length", column))
        stmt.else(arel_quote(0))
      end
    end

    alias_method :arel_json_array_length, :arel_json_safe_array_length

    # @return [Arel::Nodes::Equality]
    def arel_json_blank_array(attribute)
      arel_json_safe_array_length(attribute).eq(0)
    end

    # @return [Arel::Nodes::GreaterThan]
    def arel_json_present_array(attribute)
      arel_json_safe_array_length(attribute).gt(0)
    end

    # @param [Symbol] attribute
    # @param [Integer] value
    # @return [Arel::Nodes::GreaterThanOrEqual]
    def arel_json_array_gteq(attribute, value)
      arel_json_array_length(attribute).gteq(value)
    end

    # @!endgroup

    def arel_any_not_null(*attributes)
      expressions = attributes.flatten.map do |attribute|
        arel_attrify(attribute).not_eq(nil)
      end

      arel_or_expressions *expressions
    end

    # @see #arel_expr_in_query
    # @param [Symbol] attr (see #arel_attrify)
    # @param [#to_sql, #to_s] query
    # @return [Arel::Nodes::In]
    def arel_attr_in_query(attr, query)
      arel_expr_in_query arel_attrify(attr), query
    end

    # @param [#in] expr
    # @param [#to_sql, #to_s] query
    # @return [Arel::Nodes::In]
    def arel_expr_in_query(expr, query)
      wrapped_query = arel_quote_query query

      expr.in(wrapped_query)
    end

    def arel_nulls_last(expr)
      arel_infix " ", expr, arel_literal("NULLS LAST")
    end

    # @param [#to_sql] query
    # @return [Arel::Nodes::SqlLiteral]
    def arel_quote_query(query)
      case query
      when Dux[:to_sql] then arel_literal query.to_sql
      when String then arel_literal query
      else
        # :nocov:
        raise TypeError, "cannot quote query #{query.inspect}"
        # :nocov:
      end
    end

    def arel_range_contains(attribute, value)
      arel_infix "@>", arel_attrify(attribute), arel_quote(value)
    end

    def arel_current_date
      arel_literal "CURRENT_DATE"
    end

    def arel_current_timestamp
      arel_literal "CURRENT_TIMESTAMP"
    end

    # @!group Arel Math

    def arel_add(left, right)
      Arel::Nodes::Addition.new left, right
    end

    def arel_divide(left, right)
      Arel::Nodes::Division.new left, right
    end

    def arel_multiply(left, right)
      Arel::Nodes::Multiplication.new(left, right)
    end

    def arel_percentage(left, right, need_to_cast: false, cast_as: 'float')
      casted_left = need_to_cast ? arel_cast(left, cast_as) : left

      arel_divide casted_left, right
    end

    def arel_percentage_where(left_column, left_where, right_column: nil, right_where: nil, cast_as: 'float')
      left  = arel_attrify(left_column).count.filter(left_where)
      right = arel_attrify(right_column || left_column).count

      right = right.where(right_where) if right_where.present?

      numerator   = arel_cast(left, cast_as)
      denominator = arel_cast(right, cast_as)

      arel_divide numerator, denominator
    end

    def arel_round(value, precision: 2)
      arel_named_fn('ROUND', value, precision)
    end

    def arel_subtract(left, right)
      Arel::Nodes::Subtraction.new left, right
    end

    # @!endgroup

    # @!group pg_trgm methods

    def arel_similarity(left, right)
      arel_named_fn 'similarity', left, right
    end

    def arel_trigram(left, right)
      arel_infix '<%', left, right, autoquote: true
    end

    def arel_show_trigram(text)
      arel_named_fn 'show_trgm', text
    end

    # @param [String] text
    # @return [<String>]
    def show_trigram(text)
      arel_decode_text_array connection.select_value select(arel_show_trigram(text)).to_sql
    end

    # @!endgroup

    # @!group Arel utility methods

    # Generate a `:sql AS :aliaz` clause.
    #
    # @param [Arel::Node] left
    # @param [Arel::Node] right
    # @return [Arel::Nodes::As]
    def arel_as(left, right)
      Arel::Nodes::As.new(left, right)
    end

    # @param [String, Symbol, Arel::Attributes::Attribute, Arel::Nodes::SqlLiteral, Arel::Expresions, Arel::Node] attribute
    # @return [Arel::Attributes::Attribute]
    # @return [Arel::Nodes::SqlLiteral]
    # @return [Arel::Node]
    def arel_attrify(attribute)
      case attribute
      when Arel::Attributes::Attribute, Arel::Nodes::SqlLiteral, Arel::Expressions, Arel::Nodes::Node
        attribute
      when arel_column_matcher
        arel_table[attribute]
      when /\A[^.\s]+\.[^.\s]+/
        arel_literal attribute
      else
        raise TypeError, "Don't know how to turn #{attribute} into an Arel::Attribute"
      end
    end

    # @param [nil, Arel::Node] value
    # @yield [statement] optional block to build the case statement via `Object#tap`
    # @yieldparam [Arel::Nodes::Case] statement
    # @return [Arel::Nodes::Case]
    def arel_case(value = nil)
      Arel::Nodes::Case.new(value).tap do |statement|
        yield statement if block_given?
      end
    end

    # @see .arel_named_fn
    # @return [Arel::Nodes::NamedFunction]
    def arel_cast(value, type)
      arel_named_fn('CAST', arel_as(arel_quote(value), arel_literal(type)))
    end

    # @see .arel_named_fn
    # @return [Arel::Nodes::NamedFunction]
    def arel_coalesce(expr, value)
      arel_named_fn('COALESCE', expr, arel_quote(value))
    end

    # @return [Dux::Enum]
    def arel_column_matcher
      @arel_column_matcher ||= Dux.enum column_names
    end

    def arel_concat(*values)
      values.flatten!

      raise ArgumentError, "must have at least 2 values to concat" if values.length < 2

      values.map do |value|
        arel_quote value
      end.reduce do |left, right|
        Arel::Nodes::Concat.new(left, right)
      end
    end

    # @param [String] encoded
    # @return [<String>]
    def arel_decode_text_array(encoded)
      TEXT_ARRAY.deserialize encoded
    end

    # @param [<#to_s>] elements
    # @return [Arel::Nodes::Quoted]
    def arel_encode_text_array(*elements)
      elements.flatten!

      arel_cast(arel_quote(TEXT_ARRAY.serialize(elements)), 'text[]')
    end

    def arel_grouped(value)
      Arel::Nodes::Grouping.new(value)
    end

    alias_method :arel_grouping, :arel_grouped

    # @api private
    # @param [String] operator
    # @param [Arel::Node] left
    # @param [Arel::Node] right
    # @return [Arel::Nodes::InfixOperator]
    def arel_infix(operator, left, right, autoquote: false)
      if autoquote
        left = arel_quote(left)
        right = arel_quote(right)
      end

      Arel::Nodes::InfixOperation.new(operator, left, right)
    end

    # @api private
    # @param [Object] value
    # @return [Arel::Nodes::SqlLiteral]
    def arel_literal(value)
      case value
      when Arel::Attribute then Arel.sql(arel_grouped(value).to_sql)
      when Dux[:to_sql] then Arel.sql value.to_sql
      else
        Arel.sql(value)
      end
    end

    # @api private
    # @param [String] name
    # @param [<Arel::Node, Object>] args
    # @return [Arel::Nodes::NamedFunction]
    def arel_named_fn(name, *args)
      quoted_args = args.map { |arg| arel_quote(arg) }

      Arel::Nodes::NamedFunction.new name, quoted_args
    end

    # Creates a more legible series of OR expressions.
    #
    # @param [<Arel::Node>] expressions
    # @return [Arel::Nodes::Grouping(Arel::Nodes::Or)]
    def arel_or_expressions(*expressions)
      expressions.flatten.reduce do |grouping, expression|
        if grouping.is_a?(Arel::Nodes::Grouping)
          grouping.expr.or(expression)
        else
          # First expression
          grouping.or(expression)
        end
      end
    end

    # @param [Arel::Node, Object] arg
    # @return [Arel::Node, Arel::Nodes::Quoted]
    def arel_quote(arg)
      return arg if arg.is_a?(Arel::Nodes::Node)

      Arel::Nodes.build_quoted arg
    end

    # @!endgroup
  end
end
# rubocop:enable Style/StringLiterals
