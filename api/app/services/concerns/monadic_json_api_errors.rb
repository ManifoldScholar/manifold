module MonadicJSONAPIErrors
  extend ActiveSupport::Concern

  def jsonapi_error(**options)
    JSONAPI::Helpers::Error.new(options)
  end

  def operation_error(**options)
    JSONAPI::Operations::Error.new(options).to_result
  end

  def forbidden_jsonapi_error(**options)
    options[:status] = :forbidden
    options[:code] ||= :forbidden

    jsonapi_error(**options)
  end
end
