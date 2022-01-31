require "swagger_helper"

RSpec.describe "JournalVolumes", type: :request do
  path "/journal_volumes/{id}" do
    include_examples "an API show request", model: JournalVolume
    include_examples "an API update request", model: JournalVolume, authorized_user: :admin
    include_examples "an API destroy request", model: JournalVolume, authorized_user: :admin
  end

  describe "for a journal" do
    let(:parent) { FactoryBot.create(:journal) }
    let(:resource) { FactoryBot.create(:journal_volume, journal: parent) }
    let(:journal_id) { parent.id }

    path "/journals/{journal_id}/relationships/journal_volumes" do
      include_examples "an API index request", parent: "journal", model: JournalVolume, resource_name: "journal_volume", url_parameters: [:journal_id]
      include_examples "an API create request", parent: "journal", model: JournalVolume, resource_name: "journal_volume", url_parameters: [:journal_id], authorized_user: :admin
    end

  end
end
