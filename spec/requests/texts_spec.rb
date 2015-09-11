require 'rails_helper'

RSpec.describe "Texts", :type => :request do
  describe "GET /texts" do
    it "works! (now write some real specs)" do
      get texts_path
      expect(response).to have_http_status(200)
    end
  end
end
