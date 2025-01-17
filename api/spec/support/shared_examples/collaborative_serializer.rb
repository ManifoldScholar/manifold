require "rails_helper"

shared_examples_for "a collaborative serializer" do
  let(:serialized_object) { defined?(super) ? super() : nil }
  let(:factory) { described_class.to_s.demodulize.gsub("Serializer", "").underscore.to_sym }
  let(:object) { serialized_object || FactoryBot.create(factory) }

  context "when it has collaborators" do
    it "sends makerWithCollaboratorRoles relationship" do
      collaborator = FactoryBot.create :collaborator
      object.collaborators = [collaborator]
      subject = described_class.new(object, params: { full: true })
      expect(subject.serializable_hash[:data][:relationships][:collaborators].count).to be 1
    end
  end
end
