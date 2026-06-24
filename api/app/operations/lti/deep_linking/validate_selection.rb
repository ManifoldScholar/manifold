# frozen_string_literal: true

module Lti
  module DeepLinking
    # Validates a deep linking selection against the session and the catalog:
    # structural shape (422 with per-field pointers), then business rules (400,
    # single message). On success returns the resolved {ResourceReference}s.
    class ValidateSelection
      include Dry::Monads[:result]

      RESOURCE_LINK_TYPE = "ltiResourceLink"
      REQUIRED_SELECTION_KEYS = %w[type id].freeze

      # @param context [Context] the loaded deep linking context
      # @param selection [Array<Hash>] the submitted selection items
      def initialize(context, selection)
        @context = context
        @selection = selection
      end

      # @return [Dry::Monads::Result] Success(Array<ResourceReference>) or a
      #   Failure carrying :status and a JSON:API-shaped :errors array.
      def call
        shape_errors = validate_shape
        return Failure(status: 422, errors: shape_errors) if shape_errors.any?

        business_error = validate_business_rules
        return business_failure(business_error) if business_error

        Success(references)
      end

      private

      attr_reader :context, :selection

      def references
        @references ||= Array(selection).map { |item| Lti::ResourceReference.new(type: item["type"], id: item["id"]) }
      end

      def validate_shape
        return [field_error("/data/attributes/selection", "can't be blank")] if selection.blank?
        return [field_error("/data/attributes/selection", "must be an array")] unless selection.is_a?(Array)

        selection.each_with_index.flat_map { |item, idx| validate_selection_item(item, idx) }
      end

      def validate_selection_item(item, idx)
        return [field_error("/data/attributes/selection/#{idx}", "must be an object")] unless item.is_a?(Hash)

        REQUIRED_SELECTION_KEYS.filter_map do |key|
          field_error("/data/attributes/selection/#{idx}/#{key}", "can't be blank") if item[key].blank?
        end
      end

      def field_error(pointer, detail)
        { status: "422", source: { pointer: pointer }, detail: detail }
      end

      def validate_business_rules
        unless context.accept_types.include?(RESOURCE_LINK_TYPE)
          return "This deep linking session does not accept resource links."
        end

        if context.accept_multiple == false && selection.length > 1
          return "Only a single resource may be selected for this deep linking session."
        end

        return "Selected resources could not be found or are not linkable." unless references.all?(&:valid?)

        nil
      end

      def business_failure(message)
        Failure(
          status: :bad_request,
          errors: [{ status: "400", code: "invalid_selection", title: "Invalid Selection", detail: message }]
        )
      end
    end
  end
end
