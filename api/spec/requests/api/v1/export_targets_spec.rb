require "swagger_helper"

RSpec.describe "Export Targets", type: :request do
  path "/export_targets" do
    include_examples "an API index request", model: ExportTarget, authorized_user: :admin
    include_examples "an API create request", model: ExportTarget, authorized_user: :admin
  end

  path "/export_targets/{id}" do
    include_examples "an API show request", model: ExportTarget, authorized_user: :admin
    include_examples "an API update request", model: ExportTarget, authorized_user: :admin
    include_examples "an API destroy request", model: ExportTarget, authorized_user: :admin
  end
end
