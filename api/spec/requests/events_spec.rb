require "swagger_helper"

RSpec.describe "Events API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:event) { FactoryBot.create(:event) }

  path '/events/{id}' do
    delete I18n.t('swagger.delete.description', type: 'event', attribute: 'ID') do
      security [ apiKey: [] ]

      parameter name: :id, :in => :path, :type => :string
      let(:id) { event[:id] }

      tags 'Events'

      response '204', I18n.t('swagger.delete.204', type: 'event', attribute: 'ID') do
        let(:Authorization) { admin_auth }
        run_test!
      end

      response '403', I18n.t('swagger.access_denied', type: 'event', attribute: 'ID') do
        let(:Authorization) { reader_auth }
        run_test!
      end
    end
  end
end
