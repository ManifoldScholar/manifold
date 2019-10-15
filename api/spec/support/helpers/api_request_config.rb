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
    return @options[:parameters] if @options.key?(:parameters)
    return default_create_parameters if @action == :create
    return default_update_parameters if @action == :update
    return default_show_parameters if @action == :show

    []
  end

  def default_show_parameters
    [
      { name: :id, in: :path, type: :string }
    ]
  end

  def default_create_parameters
    [
      { name: :create, in: :body, schema: request_ref }
    ]
  end

  def default_update_parameters
    [
      { name: :id, in: :path, type: :string },
      { name: :update, in: :body, schema: request_ref }
    ]
  end

  def request_ref
    return @options[:request_ref] if @options.key?(:request_ref)

    segment = resource_name.camelize.capitalize
    @options[:response_ref] || "#/definitions/#{segment}Request#{@action.to_s.capitalize}"
  end

  def response_ref
    return @options[:response_ref] if @options.key?(:response_ref)

    base = @action == :index ? resource_name.pluralize : resource_name
    segment = base.camelize.capitalize
    @options[:response_ref] || "#/definitions/#{segment}Response"
  end

  def response
    { "$ref" => response_ref }
  end

end
