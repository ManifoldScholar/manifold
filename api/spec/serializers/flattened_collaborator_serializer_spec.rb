# frozen_string_literal: true

require "rails_helper"

RSpec.describe V1::FlattenedCollaboratorSerializer do
  it "serializes a flattened collaborator" do
    collaborator = FactoryBot.create :collaborator

    flattened_collaborator = FlattenedCollaborator.last
    hash = described_class.new(flattened_collaborator, { include: [:maker, :collaboratable] }).serializable_hash
    expect(hash[:data][:relationships].keys).to include(:maker, :collaboratable)
    expect(hash[:included].count).to be 2
    hash_maker_name = hash[:included].select { |i| i[:type] == :makers }.first[:attributes][:fullName]
    expect(hash_maker_name).to eq collaborator.maker.full_name
  end
end
