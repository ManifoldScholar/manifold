# frozen_string_literal: true

require "swagger_helper"

RSpec.describe "Export Targets", type: :request do
  path "/export_targets" do
    it_behaves_like "an API index request", model: ExportTarget, authorized_user: :admin
    it_behaves_like "an API create request", model: ExportTarget, authorized_user: :admin
  end

  path "/export_targets/{id}" do
    it_behaves_like "an API show request", model: ExportTarget, authorized_user: :admin
    it_behaves_like "an API update request", model: ExportTarget, authorized_user: :admin
    it_behaves_like "an API destroy request", model: ExportTarget, authorized_user: :admin
  end
end
