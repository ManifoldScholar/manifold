require "swagger_helper"

RSpec.describe "Statistics", type: :request do
  path "/statistics" do
    include_examples "an API show request",
                     model: Statistics,
                     exclude: ["404"],
                     request_id: false,
                     instantiate_before_test: false,
                     authorized_user: :admin
  end
end
