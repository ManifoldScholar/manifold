class ApiRequestConfig

  def content_type
    "application/json"
  end

  def initialize(options, action)
    @options = options
    @action = action
  end

  def description
    @options[:description]
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

  #### REQUESTS ####

  def request_schema
    @options[:request_schema] if @options.key?(:request_schema)
  end

  def request_ref
    return @options[:request_ref] if @options.key?(:request_ref)

    segment = resource_name.camelize.capitalize
    @options[:response_ref] || "#/parameters/#{segment}#{@action.to_s.capitalize}"
  end

  def request
    request_schema || { "$ref" => request_ref }
  end

  #### RESPONSES ####

  def response_schema
    @options[:response_schema] if @options.key?(:response_schema)
  end

  def response_ref
    return @options[:response_ref] if @options.key?(:response_ref)

    segment = resource_name.camelize.capitalize

    return (@options[:response_ref] || "#/definitions/#{segment}") if (@action == :show or @action == :update)
    return (@options[:response_ref] || "#/responses/#{segment}Collection") if @action == :index
    @options[:response_ref] || "#/responses/#{segment}#{@action.capitalize}"
  end

  def response
    response_schema || { "$ref" => response_ref }
  end

end
