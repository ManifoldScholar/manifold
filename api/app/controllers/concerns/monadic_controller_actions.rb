module MonadicControllerActions
  extend ActiveSupport::Concern

  def handle_monadic_operation!(name, options, handle_default_failure: true, &block)
    result = resolve(name).call options

    handler_options = { handle_default_failure: handle_default_failure }

    handle_monadic_result!(result, handler_options, &block)
  end

  def handle_monadic_result!(result, handle_default_failure: true)
    Dry::Matcher::ResultMatcher.call(result) do |m|
      yield m if block_given?

      if handle_default_failure
        m.failure do |err|
          handle_default_monadic_failure! err
        end
      end
    end
  end

  # @api private
  # @see #monadic_failure_to_errors
  def handle_default_monadic_failure!(err)
    errors = monadic_failure_to_errors err

    render json: { errors: errors }, status: :unprocessable_entity
  end

  # @api private
  # @see JSONAPI::Helpers::Error.unroll
  def monadic_failure_to_errors(err)
    JSONAPI::Helpers::Error.unroll err
  end

  def parse_jsonapi_params(**options)
    parser = JSONAPI::ParseParams.new params.to_unsafe_h, **options

    parser.call.value_or do |failure|
      raise "Failed to parse options: #{failure.inspect}"
    end
  end

  def parse_jsonapi_attributes(**options)
    parse_jsonapi_params(**options)[:data][:attributes]
  end
end
