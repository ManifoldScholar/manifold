# frozen_string_literal: true

RSpec.shared_context "elasticsearch", elasticsearch: true do
  before(:all) do
    WebMock.disable_net_connect!(allow: [/127\.0\.0\.1:2?9200/, /localhost:2?9200/, /elasticsearch:9200/])

    [
      Annotation,
      Event,
      Maker,
      Project,
      Resource,
      ResourceCollection,
      Subject,
      Tag,
      Text,
      TextSection,
      User,
      Journal,
      JournalIssue,
    ].each do |klass|
      klass.search_index.tap do |sindex|
        sindex.clean_indices rescue nil
        sindex.delete rescue nil
        sindex.create_index
      end
    end

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
