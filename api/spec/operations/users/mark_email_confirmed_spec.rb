# frozen_string_literal: true

RSpec.describe Users::MarkEmailConfirmed, type: :operation do
  let_it_be(:user, refind: true) { FactoryBot.create :user }

  let(:operation_args) { [user] }

  it "will confirm the user and mark them as trusted" do
    expect do
      expect_calling_the_operation.to succeed
    end.to change { user.reload.email_confirmed? }.from(false).to(true)
      .and change { user.reload.established? }.from(false).to(true)
  end
end
