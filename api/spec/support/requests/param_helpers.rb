require "rails_helper"

RSpec.shared_context "param helpers" do

  def json_for(model)
    attributes = FactoryGirl::attributes_for(model)
    json_structure(attributes: attributes)
  end

  def json_structure(attributes: {}, relationships: {})
    {
      data: {
        attributes: attributes,
        relationships: relationships
      }
    }
  end

  def relationship_payload(name, models)
    Hash[*[name, models]]
  end

  def json_payload(attributes: {}, relationships: {})
    json_structure(attributes: attributes, relationships: relationships).to_json
  end

  def expect_updated_param(param, value, expected_value = nil, expected_param = nil)
    attributes = Hash[*[param, value]]
    expected_value = value unless expected_value
    expected_param = param unless expected_param
    patch(path, headers: headers, params: json_payload(attributes: attributes))
    api_response = JSON.parse(response.body)
    expect(api_response["data"]["attributes"][expected_param]).to eq(expected_value)
  end

  let(:image_params) {
    {
      content_type: "image/png",
      data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAA8SURBVDhPY2RgYPgPxFQBjCDDFjExU2xY3L+/DEwUm4JkwKhhpIfmaJiNhhmOEBhNGqQnDXDhSLo27DoAUSQGIRjvqU4AAAAASUVORK5CYII=",
      filename: "box.png"
    }
  }

  let(:markdown_source_params) {
    {
      content_type: "text/markdown",
      data: "data:text/markdown;base64,IyBUaGlzIGlzIGEgaGVhZGVyDQoNClRoaXMgaXMgc29tZSB0ZXh0",
      filename: "something.md"
    }
  }


end

