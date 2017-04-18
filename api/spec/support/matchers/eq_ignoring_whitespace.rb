RSpec::Matchers.define :eq_ignoring_whitespace do |compare|

  def strip(string)
    string.gsub(/\s+/, "")
  end

  match do |object_instance|
    strip(compare) == strip(object_instance)
  end

  failure_message do |object_instance|
    out = <<~END
    expected: #{compare}
    to match: #{object_instance}
    END
    out
  end

  failure_message_when_negated do |object_instance|
    out = <<~END
    expected: #{compare}
    to not match: #{object_instance}
    END
    out

  end

  description do
    "checks to see if two strings match, ignoring whitespace."
  end
end
