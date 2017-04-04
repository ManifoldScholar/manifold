RSpec::Matchers.define :be_wrapped_with do |tagname|
  match do |object_instance|
    object_instance.start_with?("<#{tagname}>") &&
      object_instance.end_with?("</#{tagname}>")
  end

  failure_message do |object_instance|
    "expected #{object_instance.inspect} to be wrapped in <#{tagname}>"
  end

  failure_message_when_negated do |object_instance|
    "expected #{object_instance.inspect} not to be wrapped in <#{tagname}>"
  end

  description do
    "checks to see if the provided string is wrapped in a tag"
  end
end

