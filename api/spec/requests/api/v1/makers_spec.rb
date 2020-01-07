require "swagger_helper"

RSpec.describe "Makers", type: :request do

  path "/makers" do
    include_examples "an API create request", model: Maker, authorized_user: :admin
    include_examples "an API index request", model: Maker
  end

  path "/makers/{id}" do
    include_examples "an API show request", model: Maker
    include_examples "an API update request", model: Maker, authorized_user: :admin
    include_examples "an API destroy request", model: Maker, authorized_user: :admin
  end

end
