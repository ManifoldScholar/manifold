require "rails_helper"

RSpec.describe Ingestions::Fetchers::URL, slow: true do

  before(:all) do
    Settings.instance.update_from_environment!
    url = "https://storage.googleapis.com/manifold-assets/spec/e-t-a-hoffmann_master-flea.epub3"
    root = Dir.mktmpdir
    WebMock.allow_net_connect!
    @result = described_class.run(url: url, root: root).result
    WebMock.disable_net_connect!
  end

  include_examples "a fetcher"

end
