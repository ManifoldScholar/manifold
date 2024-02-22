# frozen_string_literal: true

# Provide filterable attributes for basic StoreModel classes.
module HasFilteredAttributes
  extend ActiveSupport::Concern

  included do
    delegate :parameter_filter, to: :class
  end

  def as_filtered_json(options = nil)
    parameter_filter.filter as_json(options || {})
  end

  class_methods do
    # @param [<String, Symbol, Proc>] new_params
    # @return [void]
    def filter_attributes!(*new_params)
      new_params.flatten!

      @filtered_attributes = filtered_attributes | new_params
      @parameter_filter = build_parameter_filter
    end

    def filtered_attributes
      @filtered_attributes ||= (defined?(super) ? super : []).dup
    end

    def parameter_filter
      @parameter_filter ||= build_parameter_filter
    end

    private

    def build_parameter_filter
      ActiveSupport::ParameterFilter.new filtered_attributes
    end
  end
end
