# frozen_string_literal: true

RSpec.shared_examples_for "a model with spam detection" do
  let_it_be(:admin) { FactoryBot.create :user, :admin }

  let(:instance) { raise "must provide an instance!" }

  before do
    # sanity check
    expect(instance).to be_new_record
  end

  def instance_has_spam!
    expect(instance).to have_an_error_of_type(:spam)
  end

  def instance_has_no_spam!
    expect(instance).not_to have_an_error_of_type(:spam)
  end

  context "when akismet is disabled" do
    before do
      akismet_disabled!

      akismet_stub_comment_check!(situation: :spam)
    end

    it "is not marked as spam no matter what" do
      instance_has_no_spam!
    end
  end

  context "when akismet is enabled" do
    before do
      akismet_enabled!
    end

    it "it can catch spam on update" do
      akismet_stub_comment_check!(situation: :not_spam)

      instance_has_no_spam!

      expect do
        instance.save!
      end.to change(described_class, :count).by(1)

      akismet_stub_comment_check!(situation: :spam)

      instance_has_spam!

      expect(instance).to have_spam_detected

      expect(instance).to be_in described_class.where(id: instance.id).detected_as_spam

      expect do
        instance.save!
      end.to raise_error ActiveRecord::RecordInvalid, /spam/
    end

    context "when the content is not spammy" do
      before do
        akismet_stub_comment_check!(situation: :not_spam)
      end

      it "passes" do
        instance_has_no_spam!
      end
    end

    context "when the content is spammy" do
      before do
        akismet_stub_comment_check!(situation: :spam)
      end

      it "is marked as spam" do
        instance_has_spam!
      end

      context "when the creator is trusted" do
        before do
          skip "model does not have a creator, skipping" unless instance.respond_to?(:creator=)

          instance.creator = admin
        end

        it "is not marked as spam" do
          instance_has_no_spam!
        end
      end
    end
  end
end
