module TestHelpers
  module DryMonadHelpers
    RESULTISH = Types.Instance(Dry::Monads::Result) | Types.Interface(:to_result)

    def resultish
      RESULTISH
    end
  end
end

RSpec::Matchers.define :be_a_monadic_success do
  include TestHelpers::DryMonadHelpers

  match do |actual|
    case actual
    when resultish
      Dry::Matcher::ResultMatcher.call(actual) do |m|
        m.success do |result|
          if block_arg.present?
            values_match?(block_arg, result)
          else
            true
          end
        end

        m.failure do
          false
        end
      end
    else
      false
    end
  end

  description { "be a monadic success" }

  failure_message do |actual|
    ["expected that #{actual.inspect} would be a success"].tap do |a|
      a << "satisfying #{block_arg.inspect}" if block_arg.present?
      a << "but was not monadic" unless resultish === actual
    end * ", "
  end

  failure_message_when_negated do |actual|
    ["expected that #{actual.inspect} would be a failure"].tap do |a|
      a << "satisfying #{block_arg.inspect}" if block_arg.present?
      a << "but was not monadic" unless resultish === actual
    end * ", "
  end
end

RSpec::Matchers.define :be_a_monadic_failure do
  include TestHelpers::DryMonadHelpers

  match do |actual|
    case actual
    when resultish
      Dry::Matcher::ResultMatcher.call(actual) do |m|
        m.success do
          false
        end

        if failure_code.present?
          m.failure(failure_code) do |(code, reason)|
            true
          end
        end

        m.failure do |*args|
          failure_code.present? ? false : true
        end
      end
    else
      false
    end
  end

  description { "be a monadic failure" }

  chain :with_code, :failure_code

  failure_message do |actual|
    ["expected that #{actual.inspect} would be a failure"].tap do |a|
      a << "satisfying #{block_arg.inspect}" if block_arg.present?
      a << "but was not monadic" unless resultish === actual
    end * ", "
  end

  failure_message_when_negated do |actual|
    ["expected that #{actual.inspect} would be a success"].tap do |a|
      a << "satisfying #{block_arg.inspect}" if block_arg.present?
      a << "but was not monadic" unless resultish === actual
    end * ", "
  end
end
