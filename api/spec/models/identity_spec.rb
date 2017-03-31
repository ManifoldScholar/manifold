require 'rails_helper'

RSpec.describe Identity do
  def self.with_provider(provider_name, faker_method: provider_name.to_sym, &block)
    context "with a :#{provider_name}" do
      let(:auth_hash) { OmniAuth::AuthHash.new(Faker::Omniauth.__send__(faker_method)) }

      instance_eval(&block)
    end
  end

  describe '.from_omniauth' do
    let(:fetched_identity) { Identity.from_omniauth(auth_hash) }

    subject { fetched_identity }

    with_provider :facebook do
      it { is_expected.to be_facebook }
    end

    with_provider :google_oauth2, faker_method: :google do
      it { is_expected.to be_google.and be_google_oauth2 }
    end

    with_provider :twitter do
      it { is_expected.to be_twitter }
    end
  end
end
