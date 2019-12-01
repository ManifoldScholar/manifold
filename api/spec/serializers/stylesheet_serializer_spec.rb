require "rails_helper"

RSpec.describe V1::StylesheetSerializer do
  it_behaves_like "a serializer", partial_by_default: true
end
