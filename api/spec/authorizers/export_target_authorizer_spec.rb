require "rails_helper"

RSpec.describe "Export Target Abilities", :authorizer do
  let(:user) { FactoryBot.create :user }

  subject { user }

  context "when the subject is an admin" do
    let(:user) { FactoryBot.create(:user, :admin) }

    it { is_expected.to be_able_to(:read, :create, :update, :delete).on(ExportTarget) }
  end

  context "when the subject is a reader" do
    let(:user) { FactoryBot.create(:user, :reader) }

    it { is_expected.to be_unable_to(:read, :create, :update, :delete).on(ExportTarget) }
  end

  context "when the subject is a global editor" do
    let(:user) { FactoryBot.create :user, :editor }
    let!(:export_target) { FactoryBot.create :export_target }

    it { is_expected.to be_able_to(:read).on(export_target).and be_unable_to(:create, :update, :destroy).on(export_target) }
  end
end
