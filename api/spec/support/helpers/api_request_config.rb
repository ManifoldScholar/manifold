class ApiRequestConfig

  def content_type
    "application/json"
  end

  def initialize(options, action)
    @options = options
    @action = action
  end

  def model
    @options[:model]
  end

  def factory
    @options[:factory] || model.name.underscore
  end

  def resource_name
    @options[:resource_name] || model.name.underscore
  end

  def resource_name_plural
    @options[:resource_name_plural] || resource_name.pluralize
  end

  def tags
    @options[:tags] || resource_name
  end

  def parameters
    return merge_additional_parameters(@options[:parameters]) if @options.key?(:parameters)
    return merge_additional_parameters(default_create_parameters) if @action == :create
    return merge_additional_parameters(default_update_parameters) if @action == :update
    return merge_additional_parameters(default_delete_parameters) if @action == :delete
    return merge_additional_parameters(default_show_parameters) if @action == :show

    merge_additional_parameters([])
  end

  def merge_additional_parameters(parameters)
    return parameters unless @options.key?(:additional_parameters)

    keys = @options[:additional_parameters].map { |p| p[:name] }
    parameters.reject { |p| keys.include? p } + @options[:additional_parameters]
  end

  def default_delete_parameters
    [
      { name: :id, in: :path, type: :string }
    ]
  end

  def default_show_parameters
    [
      { name: :id, in: :path, type: :string }
    ]
  end

  def default_create_parameters
    [
      { name: :create, in: :body, schema: request }
    ]
  end

  def default_update_parameters
    [
      { name: :id, in: :path, type: :string },
      { name: :update, in: :body, schema: request }
    ]
  end

  def request_ref
    return @options[:request_ref] if @options.key?(:request_ref)

    segment = resource_name.camelize.capitalize
    @options[:response_ref] || "#/definitions/#{segment}Request#{@action.to_s.capitalize}"
  end

  def request
    { "$ref" => request_ref }
  end

  def response_ref
    return @options[:response_ref] if @options.key?(:response_ref)

    segment = resource_name.camelize.capitalize

    return (@options[:response_ref] || "#/definitions/#{segment}Resource") if @action == :show
    return (@options[:response_ref] || "#/definitions/#{segment}Collection") if @action == :index
    @options[:response_ref] || "#/definitions/#{segment}#{@action.capitalize}Response"
  end

  def response
    { "$ref" => response_ref }
  end

end
