# frozen_string_literal: true

require "rails_helper"

RSpec.describe Ingestions::Fetchers::GoogleDoc, slow: true do
  before(:all) do
    Settings.instance.update_from_environment!
    skip "Google Drive credentials are not configured" unless Factory::DriveSession.create_service_account_session

    url = "https://docs.google.com/document/d/1bTY_5mtv0nIGUOLxvltqmwsrruqgVNgNoT2XJv1m5JQ/edit?usp=sharing"
    root = Dir.mktmpdir
    WebMock.allow_net_connect!
    @result = described_class.run(url: url, root: root).result
    WebMock.disable_net_connect!
  end

  it_behaves_like "a fetcher"
end
