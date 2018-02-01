require "rails_helper"

RSpec.describe Abilities, type: :serializer do
  let(:user) { FactoryBot.create(:user) }
  let(:admin) { FactoryBot.create(:user, role: "admin") }
  let(:annotation) { FactoryBot.create(:annotation) }
  let(:creator_annotation) { FactoryBot.create(:annotation, creator: user) }
  let(:controller) { double("Controller", url_options: true) }
  let(:target) {
    JSON.parse({
      read: true,
      create: true,
      update: false,
      delete: false,
      readIfDeleted: false,
      creator: false
    }.to_json)
  }
  let (:creator_target) {
    JSON.parse({
      read: true,
      create: true,
      update: true,
      delete: true,
      readIfDeleted: false,
      creator: true
    }.to_json)
  }
  let (:user_target) {
    JSON.parse({
      comment: { create: true, read: true },
      annotation: { create: true, read: true },
      user: { create: true, read: false }}.to_json)
  }
  let (:admin_target) {
    JSON.parse({
       comment: { create: true, read: true },
       annotation: { create: true, read: true },
       user: { create: true, read: true }}.to_json)
  }

  context "returns correct abilities" do
    it "when not resource creator" do
      allow_any_instance_of(AnnotationSerializer).to receive(:scope).and_return(Api::V1::SerializationContext.new(controller: controller, current_user: user))
      serialization = JSON.parse ActiveModelSerializers::Adapter.create(AnnotationSerializer.new(annotation)).to_json
      expect(serialization['data']['attributes']['abilities']).to eq target
    end

    it "when not authenticated" do
      allow_any_instance_of(AnnotationSerializer).to receive(:scope).and_return(Api::V1::SerializationContext.new(controller: controller, current_user: nil))
      serialization = JSON.parse ActiveModelSerializers::Adapter.create(AnnotationSerializer.new(annotation)).to_json
      expect(serialization['data']['attributes']['abilities']).to eq target
    end

    it "when resource creator" do
      allow_any_instance_of(AnnotationSerializer).to receive(:scope).and_return(Api::V1::SerializationContext.new(controller: controller, current_user: user))
      serialization = JSON.parse ActiveModelSerializers::Adapter.create(AnnotationSerializer.new(creator_annotation)).to_json
      expect(serialization['data']['attributes']['abilities']).to eq creator_target
    end
  end

  context "returns correct class abilities" do
    it "when user" do
      allow_any_instance_of(CurrentUserSerializer).to receive(:scope).and_return(Api::V1::SerializationContext.new(controller: controller, current_user: user))
      serialization = JSON.parse ActiveModelSerializers::Adapter.create(CurrentUserSerializer.new(user)).to_json
      expect(serialization['data']['attributes']['classAbilities']).to eq user_target
    end

    it "when admin" do
      allow_any_instance_of(CurrentUserSerializer).to receive(:scope).and_return(Api::V1::SerializationContext.new(controller: controller, current_user: admin))
      serialization = JSON.parse ActiveModelSerializers::Adapter.create(CurrentUserSerializer.new(admin)).to_json
      expect(serialization['data']['attributes']['classAbilities']).to eq admin_target
    end
  end
end
