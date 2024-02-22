# frozen_string_literal: true

RSpec.describe SpamMitigation::Submit, type: :operation do
  let(:content) { "this is a message" }

  let(:user) { nil }

  let(:type) { "comment" }

  let(:operation_args) do
    [content]
  end

  let(:operation_options) do
    {
      user: user,
      type: type,
    }
  end

  context "when akismet is enabled" do
    before do
      akismet_enabled!
    end

    context "when everything is behaving" do
      before do
        akismet_stub_submit_spam!(situation: :ok)
      end

      it "passes" do
        expect_calling_the_operation.to succeed.with(akismet: succeed.with(/thanks/i))
      end
    end
  end
end
