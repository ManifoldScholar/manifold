# frozen_string_literal: true

module Auth
  module Lti
    # Resolves a deep linking context_token against Rails.cache, validates
    # the requesting user and the submitted selection, consumes the cache
    # entry on success, and returns a {Result} the controller renders.
    #
    # Validation order is load-bearing:
    #   1. Read cache by token.       Failure -> :unauthorized (code: "expired")
    #   2. Validate user identity.    Failure -> :forbidden    (code: "unauthorized")
    #   3. Validate selection shape.  Failure -> :unprocessable_entity (per-field)
    #   4. Validate business rules.   Failure -> :bad_request  (single message)
    #   5. Delete cache key (consume).
    #   6. Return success Result.
    #
    # Order matters because (a) consuming the token before validation would
    # let a wrong-instructor request burn the instructor's session, and (b)
    # business-rule checks need the cached payload's accept_types/accept_multiple.
    class PickerSubmission
      Result = Data.define(:ok, :errors, :status)

      ALLOWED_SELECTION_KEYS = %w[type id title].freeze
      REQUIRED_SELECTION_KEYS = %w[type id].freeze

      # @param params [Hash, ActionController::Parameters] expected keys: :context_token, :selection (Array<Hash>), optional :reading_group_id
      # @param user [User] current_user from authenticated request
      def initialize(params, user)
        @params = params.respond_to?(:to_unsafe_h) ? params.to_unsafe_h.with_indifferent_access : params.with_indifferent_access
        @user   = user
      end

      # @return [Result]
      def call
        payload = Rails.cache.read(cache_key)
        return expired_result if payload.blank?
        return forbidden_result unless payload["user_id"] == user.id

        shape_errors = validate_shape
        return shape_error_result(shape_errors) if shape_errors.any?

        business_error = validate_business_rules(payload)
        return business_error_result(business_error) if business_error

        Rails.cache.delete(cache_key)
        Result.new(ok: true, errors: [], status: :accepted)
      rescue StandardError => e
        Rails.logger.error("PickerSubmission failed: #{e.class.name}: #{e.message}")
        Result.new(
          ok: false,
          errors: [{ status: "500", code: "internal_error", title: "Internal Error", detail: "An unexpected error occurred." }],
          status: :internal_server_error
        )
      end

      private

      attr_reader :params, :user

      def cache_key
        "#{Auth::Lti::DeepLinkingContext::CACHE_KEY_PREFIX}/#{params[:context_token]}"
      end

      def expired_result
        Result.new(
          ok: false,
          errors: [{
            status: "401",
            code: "expired",
            title: "Context Expired",
            detail: "The deep linking session has expired. Please relaunch from your LMS."
          }],
          status: :unauthorized
        )
      end

      def forbidden_result
        Result.new(
          ok: false,
          errors: [{
            status: "403",
            code: "unauthorized",
            title: "Unauthorized",
            detail: "You are not the instructor for this deep linking session."
          }],
          status: :forbidden
        )
      end

      def validate_shape
        errors = []
        # context_token presence is implicitly validated by step 1 (cache read) —
        # a blank token produces a cache miss that returns :unauthorized before
        # this method is ever called. No separate context_token check here.

        selection = params[:selection]
        if selection.blank?
          errors << field_error("/data/attributes/selection", "can't be blank")
        elsif !selection.is_a?(Array)
          errors << field_error("/data/attributes/selection", "must be an array")
        else
          selection.each_with_index do |item, idx|
            errors.concat(validate_selection_item(item, idx))
          end
        end

        errors
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

      def validate_business_rules(payload)
        selection = Array(params[:selection])
        accept_types = Array(payload["accept_types"])

        unless selection.all? { |item| accept_types.include?(item["type"]) }
          return "The selected resource type is not accepted by this deep linking session."
        end

        if payload["accept_multiple"] == false && selection.length > 1
          return "Only a single resource may be selected for this deep linking session."
        end

        nil
      end

      def business_error_result(message)
        Result.new(
          ok: false,
          errors: [{
            status: "400",
            code: "invalid_selection",
            title: "Invalid Selection",
            detail: message
          }],
          status: :bad_request
        )
      end

      def shape_error_result(errors)
        Result.new(ok: false, errors: errors, status: :unprocessable_entity)
      end
    end
  end
end
