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
  def handle_default_monadic_failure!(_err)
    errors = monadic_failure_to_errors

    render json: { errors: errors }, status: :unprocessable_entity
  end

  # @api private
  # @see JSONAPI::Helpers::Error.unroll
  def monadic_failure_to_errors(err)
    JSONAPI::Helpers::Error.unroll err
  end
end
