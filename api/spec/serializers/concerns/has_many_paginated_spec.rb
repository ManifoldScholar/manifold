require 'rails_helper'

RSpec.describe HasManyPaginated do
  class self::Serializer < ApplicationSerializer
    include HasManyPaginated
    attributes :title

    has_many_paginated :resources, serializer: ResourceSerializer
  end
  let(:project) { FactoryBot.create(:project) }
  let(:serializer) do
    scope = double(authenticated_as: nil)
    ActiveModelSerializers::SerializableResource.new(project,
                                                     { adapter: :json_api,
                                                       scope: scope,
                                                       serializer: self.class::Serializer,
                                                       pagination: { resources: { size: 3, number: 2 } } })
  end
  let(:response) { serializer.as_json.with_indifferent_access }

  before(:each) do
    6.times { FactoryBot.create(:resource, project: project) }
  end

  it "includes pagination hash on association" do
    expect(response.dig(:data, :relationships, :resources, :meta)).to have_key "pagination"
  end

  it "has the correct pagination meta" do
    expected = { "currentPage" => 2, "nextPage" => 0, "perPage" => 3, "prevPage" => 1, "totalCount" => 6, "totalPages" => 2 }
    expect(response.dig(:data, :relationships, :resources, :meta, :pagination)).to eq expected
  end

  it "has the correct links" do
    expected = {
      "first" => "/api/v1/projects/#{project.id}/relationships/resources?page=1&per_page=3",
      "last" => "/api/v1/projects/#{project.id}/relationships/resources?page=2&per_page=3",
      "prev" => "/api/v1/projects/#{project.id}/relationships/resources?page=1&per_page=3"
    }
    expect(response.dig(:data, :relationships, :resources, :links)).to eq expected
  end

  it "has the correct number of items" do
    expect(response.dig(:data, :relationships, :resources, :data).length).to be 3
  end

end
