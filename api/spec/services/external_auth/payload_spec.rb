require 'rails_helper'

RSpec.describe ExternalAuth::Payload do
  include ExternalAuth::PayloadHelpers

  let(:provider)      { "facebook" }
  let(:outcome_valid) { true }
  let(:user)          { instance_spy(User, id: SecureRandom.uuid) }
  let(:outcome_error_messages) { [Faker::Company.bs] }
  let(:outcome_errors) do
    instance_spy(ActiveInteraction::Errors, "an interaction", full_messages: outcome_error_messages)
  end

  let(:outcome) do
    instance_spy(ExternalAuth::FindUser, "outcome of upserting a user", {
      errors:   outcome_errors,
      provider: provider,
      user:     user,
      :valid? => outcome_valid
    })
  end

  let(:payload) { described_class.new outcome }

  subject { payload }

  context 'when the outcome is valid' do
    it { is_expected.not_to be_failed }

    context 'the serialized JSON' do
      subject { payload.as_json }

      includes_invariant_pairs!
      includes_auth_token!
      includes_errors! negated: true
    end
  end

  context 'when the outcome is not valid' do
    let(:outcome_valid) { false }

    it { is_expected.to be_failed }

    context 'the serialized JSON' do
      subject { payload.as_json }

      includes_invariant_pairs!
      includes_auth_token! negated: true
      includes_errors!
    end
  end
end
