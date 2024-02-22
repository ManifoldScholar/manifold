# frozen_string_literal: true

RSpec.shared_context "param helpers" do
  def json_structure_from_factory(factory_name, **options)
    build_json_structure(options.merge({ attributes: FactoryBot.attributes_for(factory_name) }))
  end

  def build_json_structure(attributes: {}, relationships: {}, meta: {}, type: :response)
    {
      data: {
        attributes: adjust_attributes(attributes, type),
        relationships: relationships,
        meta: meta
      }
    }
  end

  def build_json_payload(**options)
    build_json_structure(options).to_json
  end

  def adjust_attributes(attributes, type)
    return adjust_attributes_for_request(attributes) if type == :request
    adjust_attributes_for_response(attributes)
  end

  def adjust_attributes_for_request(attributes)
    attributes.map { |k,v|
      next [k, v] unless v.respond_to? :path
      [k, file_param(v.path, v.content_type, v.original_filename)]
    }.to_h
  end

  def adjust_attributes_for_response(attributes)
    attributes
  end

  def relationship_payload(name, models)
    Hash[name, models]
  end

  def expect_updated_param(param, value, expected_value = nil, expected_param = nil)
    attributes = Hash[param, value]
    expected_value ||= value
    expected_param ||= param
    patch(path, headers: headers, params: build_json_payload(attributes: attributes))
    api_response = JSON.parse(response.body)
    expect(api_response["data"]["attributes"][expected_param]).to eq(expected_value)
  end

  def file_param(path, content_type, file_name)
    data = Base64.encode64(File.open(path, "rb").read)
    {
      content_type: content_type,
      data: "data:#{content_type};base64,#{data}",
      filename: file_name
    }
  end

  def put_temporary_tus_file(filename, mime_type:, data:, id: SecureRandom.hex)
    io = StringIO.new

    io << data

    Shrine.storages[:tus].upload(io, id)

    {
      id: id,
      storage: "cache",
      metadata: {
        filename: filename,
        size: io.size,
        mime_type: mime_type
      }
    }
  end

  let(:image_params) do
    {
      content_type: "image/png",
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAA8SURBVDhPY2RgYPgPxFQBjCDDFjExU2xY3L+/DEwUm4JkwKhhpIfmaJiNhhmOEBhNGqQnDXDhSLo27DoAUSQGIRjvqU4AAAAASUVORK5CYII=",
      filename: "box.png",
      alt_text: "alt text"
    }
  end

  let(:markdown_source_params) do
    put_temporary_tus_file(
      "something.md",
      data: "# This is a header\r\n\r\nThis is some text",
      mime_type: "text/markdown"
    )
  end
end

RSpec.configure do |config|
  config.include_context "param helpers", type: :request
end
