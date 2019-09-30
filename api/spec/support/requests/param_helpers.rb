require "rails_helper"
require 'base64'

RSpec.shared_context "param helpers" do

  def json_for(model)
    attributes = FactoryBot::attributes_for(model)
    json_structure(attributes: attributes)
  end

  def json_structure_for(model)
    json_for(model)
  end

  def json_structure(attributes: {}, relationships: {}, meta: {})
    {
      data: {
        attributes: attributes,
        relationships: relationships,
        meta: meta
      }
    }
  end

  def relationship_payload(name, models)
    Hash[*[name, models]]
  end

  def json_payload(attributes: {}, relationships: {}, meta: {})
    json_structure(attributes: attributes, relationships: relationships, meta: meta).to_json
  end

  def expect_updated_param(param, value, expected_value = nil, expected_param = nil)
    attributes = Hash[*[param, value]]
    expected_value = value unless expected_value
    expected_param = param unless expected_param
    patch(path, headers: headers, params: json_payload(attributes: attributes))
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
      storage: 'cache',
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
      filename: "box.png"
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
