# frozen_string_literal: true

module SettingSections
  # Settings related to the rate-limiting subsystem.
  #
  # @note The `enabled` option takes precedence over the more granular options
  #   when set to `false`.
  class RateLimiting < Base
    STATUS_TABLE_OPTIONS = {
      title: "Manifold Rate-limiting Settings",
      headings: [
        "Category",
        { value: "On", alignment: :right },
        { value: "On (Effective)", alignment: :right }
      ],
      style: {
        width: 78,
      },
    }.freeze

    attribute :enabled, :boolean, default: true

    ManifoldEnv::Types::THROTTLED_CATEGORIES.each do |category|
      attribute category, :boolean, default: true
    end

    # @param [ManifoldEnv::Types::ThrottledCategory] name
    def category?(name)
      name.in?(ManifoldEnv::Types::THROTTLED_CATEGORIES)
    end

    # @param [ManifoldEnv::Types::ThrottledCategory] name
    def category_disabled?(name)
      category?(name) && !__send__(name)
    end

    # @see #toggle!
    # @param [ManifoldEnv::Types::ThrottledCategory] category
    # @return [void]
    def disable!(category)
      toggle! category, false
    end

    # Boolean complement of `enabled`
    def disabled?
      !enabled
    end

    # @param [ManifoldEnv::Types::ThrottledCategory] name
    def disabled_for?(name)
      disabled? || category_disabled?(name)
    end

    # @see #toggle!
    # @param [ManifoldEnv::Types::ThrottledCategory] category
    # @return [void]
    def enable!(category)
      toggle! category, true
    end

    # @return [Terminal::Table]
    def status_table
      Terminal::Table.new(**STATUS_TABLE_OPTIONS) do |t|
        status_table_add_global!(t)

        status_table_add_categories!(t)
      end.tap do |t|
        status_table_align!(t)
      end
    end

    private

    # @param [Boolean] value
    # @return [String]
    def boolean_cell(value)
      value.present? ? ?T : ?F
    end

    # @param [Terminal::Table] t
    # @return [void]
    def status_table_add_categories!(table)
      ManifoldEnv::Types::THROTTLED_CATEGORIES.each do |category|
        table << [category.to_s.humanize, boolean_cell(__send__(category)), boolean_cell(!disabled_for?(category))]
      end
    end

    # @param [Terminal::Table] table
    # @return [void]
    def status_table_add_global!(table)
      table << ["All", boolean_cell(enabled?), boolean_cell(enabled?)]

      if disabled?
        table << :separator
        table << [{ value: "All Categories Disabled Globally", colspan: 3, alignment: :right }]
      end

      table << :separator
    end

    # @param [Terminal::Table] table
    # @return [void]
    def status_table_align!(table)
      table.align_column 1, :right
      table.align_column 2, :right
    end

    # @param [ManifoldEnv::Types::ThrottledCategory] category
    # @param [Boolean] value
    # @return [void]
    def toggle!(category, value)
      if category == :all
        self.enabled = value

        if value
          ManifoldEnv::Types::THROTTLED_CATEGORIES.each do |name|
            toggle!(name, value)
          end
        end
      elsif category?(category)
        self[category] = value
      else
        # :nocov:
        raise ArgumentError, "cannot toggle rate-limiting category #{category.inspect}"
        # :nocov:
      end
    end
  end
end
