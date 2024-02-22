# frozen_string_literal: true

RSpec.describe SpamMitigation::Check, type: :operation do
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

    context "when akismet returns any kind of error" do
      before do
        akismet_stub_comment_check!(situation: :error)

        # sanity check
        expect(Settings.current.general).not_to be_disable_spam_detection
      end

      it "allows the content to go through in lieu of a better current approach" do
        expect_calling_the_operation.to succeed.with(false)
      end
    end

    context "when providing non-spammy content" do
      before do
        akismet_stub_comment_check!(situation: :not_spam)
      end

      it "passes" do
        expect_calling_the_operation.to succeed.with(false)
      end

      context "when the user is trusted" do
        let(:user) { FactoryBot.create(:user, :admin) }

        it "is skipped for the right reason" do
          expect_calling_the_operation.to monad_fail.with_key(:user_trusted)
        end
      end

      context "when spam detection has been disabled globally" do
        before do
          spam_detection_disabled!
        end

        it "is skipped for the right reason" do
          expect_calling_the_operation.to monad_fail.with_key(:spam_detection_disabled)
        end
      end
    end

    context "when providing something that should be flagged as spam" do
      before do
        akismet_stub_comment_check!(situation: :spam)
      end

      it "is flagged as expected" do
        expect_calling_the_operation.to succeed.with(true)
      end

      context "when the user is trusted" do
        let(:user) { FactoryBot.create(:user, :admin) }

        it "is skipped for the right reason" do
          expect_calling_the_operation.to monad_fail.with_key(:user_trusted)
        end
      end

      context "when spam detection has been disabled globally" do
        before do
          spam_detection_disabled!
        end

        it "is skipped for the right reason" do
          expect_calling_the_operation.to monad_fail.with_key(:spam_detection_disabled)
        end
      end
    end
  end

  context "when akismet is disabled" do
    before do
      akismet_disabled!
    end

    it "passes" do
      expect_calling_the_operation.to succeed.with(false)
    end

    context "when the user is trusted" do
      let(:user) { FactoryBot.create(:user, :admin) }

      it "is skipped for the right reason" do
        expect_calling_the_operation.to monad_fail.with_key(:user_trusted)
      end
    end

    context "when spam detection has been disabled globally" do
      before do
        spam_detection_disabled!
      end

      it "is skipped for the right reason" do
        expect_calling_the_operation.to monad_fail.with_key(:spam_detection_disabled)
      end
    end
  end
end
