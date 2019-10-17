shared_examples_for "an API index request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  conf = ApiRequestConfig.new(options, :index)

  get I18n.t("swagger.get.all.description", type: conf.resource_name_plural) do
    conf.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description conf.description if conf.description
    produces conf.content_type
    tags conf.tags

    response "200", I18n.t("swagger.get.all.200", type: conf.resource_name_plural) do
      schema conf.response
      run_test!
    end
  end
end

shared_examples_for "an API create request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  conf = ApiRequestConfig.new(options, :create)

  let(:create) { json_structure_for(conf.factory) }

  post I18n.t("swagger.post.description", type: conf.resource_name) do
    conf.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description conf.description if conf.description
    produces conf.content_type
    consumes conf.content_type
    security [apiKey: []]
    tags conf.tags

    response "201", I18n.t("swagger.post.201", type: conf.resource_name) do
      let(:Authorization) { admin_auth }
      schema conf.response
      run_test!
    end

    response "403", I18n.t("swagger.access_denied") do
      let(:Authorization) { }
      run_test!
    end
  end
end

shared_examples_for "an API show request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  conf = ApiRequestConfig.new(options, :show)

  let(:body) { json_structure_for(conf.factory) }

  get I18n.t("swagger.get.one.description", type: conf.resource_name, attribute: "ID") do
    conf.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description conf.description if conf.description
    produces conf.content_type
    consumes conf.content_type
    tags conf.tags

    response "200", I18n.t("swagger.get.one.200", type: conf.resource_name, attribute: "ID") do
      schema conf.response
      run_test!
    end

    response "404", I18n.t("swagger.access_denied") do
      let(:id) { "not-an-id" }
      run_test!
    end
  end
end

shared_examples_for "an API update request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  conf = ApiRequestConfig.new(options, :update)

  let(:update) { json_structure_for(conf.factory) }

  patch I18n.t("swagger.patch.description", type: conf.resource_name, attribute: "ID") do
    conf.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description conf.description if conf.description
    produces conf.content_type
    consumes conf.content_type
    security [apiKey: []]
    tags conf.tags

    response "200", I18n.t("swagger.patch.200", type: conf.resource_name, attribute: "ID") do
      let(:Authorization) { admin_auth }
      schema conf.response
      run_test!
    end

    response "403", I18n.t("swagger.access_denied") do
      let(:Authorization) { }
      run_test!
    end
  end
end

shared_examples_for "an API destroy request" do |options|
  include_context("authenticated request")
  include_context("param helpers")

  conf = ApiRequestConfig.new(options, :delete)

  delete I18n.t("swagger.delete.description", type: conf.resource_name, attribute: "ID") do
    conf.parameters.each do |parameter_options|
      parameter(parameter_options)
    end
    description conf.description if conf.description
    security [apiKey: []]
    tags conf.tags

    response "204", I18n.t("swagger.delete.204", type: conf.resource_name) do
      let(:Authorization) { admin_auth }
      run_test!
    end

    response "403", I18n.t("swagger.access_denied") do
      let(:Authorization) { }
      run_test!
    end
  end
end
