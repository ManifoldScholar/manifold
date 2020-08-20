# Methods to integrate ActiveInteractions more seamlessly with dry-transaction pipelines.
module MonadicInteraction
  extend ActiveSupport::Concern

  include Dry::Monads::Result::Mixin
  include Dry::Matcher.for(:as_monadic_result, with: Dry::Matcher::ResultMatcher)

  # @return [Dry::Monads::Result::Success] on a successful interaction
  # @return [Dry::Monads::Result::Failure] on a failed interaction
  def as_monadic_result
    if valid?
      Types::MONADIC_RESULT[result]
    else
      Failure([monadic_failure_code, monadic_failure_reason])
    end
  end

  # @abstract
  # @return [Symbol]
  def monadic_failure_code
    :invalid_interaction
  end

  # @abstract
  # @return [String]
  def monadic_failure_reason
    return nil unless invalid?

    errors.full_messages.to_sentence
  end

  class_methods do
    # @see #as_monadic_result
    # @return [Dry::Monads::Result]
    def run_as_monad(inputs = {}, &block)
      run(inputs).as_monadic_result(&block)
    end
  end
end
