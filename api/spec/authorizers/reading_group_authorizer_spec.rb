# frozen_string_literal: true

RSpec.describe "Reading Group Abilities", :authorizer do
  let(:user) { FactoryBot.create :user }

  subject { user }

  context "when the subject is a reader" do
    let(:user) { FactoryBot.create(:user, :reader) }

    it { is_expected.to be_able_to(:read, :create, :update, :delete).on(ReadingGroup) }
  end
end
