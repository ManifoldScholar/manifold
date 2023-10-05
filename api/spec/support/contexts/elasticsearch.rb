# frozen_string_literal: true

RSpec.shared_context "elasticsearch", elasticsearch: true do
  before(:all) do
    WebMock.disable_net_connect!(allow: [/127\.0\.0\.1:2?9200/, /localhost:2?9200/])
    Journal.reindex
    Text.reindex
    Resource.reindex
    Annotation.reindex
    TextSection.reindex
  end
end

RSpec.configure do |config|
  config.include_context "elasticsearch", elasticsearch: true
end
