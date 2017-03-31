module ExternalAuth::ProvisionerSpecs
  DEFAULT_HOOKS = %i(random_password)

  HOOKS = %i(name_to_nickname first_and_last_name twitter_details)

  PROVIDER_NAMES = %i[facebook google twitter]

  concern :GlobalHelpers do
    def each_hook
      return enum_for(__method__) unless block_given?

      ( DEFAULT_HOOKS + HOOKS ).each do |hook|
        yield hook
      end
    end

    def fake_omniauth_for_provider(provider)
      OmniAuth::AuthHash.new fake_omniauth_data_for_provider(provider)
    end

    private

    def fake_omniauth_data_for_provider(provider)
      case provider
      when /facebook/i then Faker::Omniauth.facebook
      when /google/i then Faker::Omniauth.google
      when /twitter/i then Faker::Omniauth.twitter
      else
        if Faker::Omniauth.respond_to?(provider)
          Faker::Omniauth.__send__(provider)
        else
          raise NoMethodError, "Faker::Omniauth does not implement :#{provider}", caller[2..-1]
        end
      end
    end

    class_methods do
      def with_provider(name, &block)
        context "when the provider is #{name}" do
          include ExternalAuth::ProvisionerSpecs::ProvisionerHelpers

          include_context 'an external auth provisioner' do
            let(:auth_hash) { fake_omniauth_for_provider(name) }
          end

          specify 'calling the provisioner raises no errors' do
            expect { run_the_provisioner! }.not_to raise_error
          end

          it { is_expected.to __send__(:"be_#{name}") }

          PROVIDER_NAMES.without(name).each do |other_provider_name|
            it { is_expected.not_to __send__(:"be_#{other_provider_name}") }
          end

          instance_eval(&block) if block_given?
        end
      end
    end
  end

  concern :ProvisionerHelpers do
    def run_the_provisioner!
      provisioner.call(user)
    end

    class_methods do
      def upon_running_the_provisioner(&block)
        context 'upon running the provisioner' do
          include ExternalAuth::ProvisionerSpecs::AfterProvisionerCalledHelpers

          before { run_the_provisioner! }

          expect_default_hooks!

          instance_eval(&block)
        end
      end
    end
  end

  concern :AfterProvisionerCalledHelpers do
    class_methods do
      # @return [void]
      def expect_default_hooks!
        DEFAULT_HOOKS.each do |hook_name|
          expect_default_hook! hook_name
        end
      end

      def expect_default_hook!(hook_name)
        expect_hook! hook_name, default: true
      end

      def expect_hook!(hook_name, default: false, negated: false)
        copula = negated ? "isn't" : "is"

        specify "the hook :#{hook_name} #{copula} called#{" by default" if default}" do
          have_received_hook = have_received(hook_name).with(no_args)

          unless negated
            expect(provisioner).to have_received_hook.once
          else
            expect(provisioner).not_to have_received_hook
          end
        end
      end

      def expect_hooks!(*hook_names)
        hook_names.flatten!

        hook_names.each do |hook_name|
          expect_hook! hook_name
        end

        HOOKS.without(*hook_names).each do |hook_name|
          expect_hook! hook_name, negated: true
        end
      end

      def the_user_has(&block)
        context 'the user has' do
          include ExternalAuth::ProvisionerSpecs::UserHelpers

          subject { user }

          user_expectation 'generated a random password' do
            have_attributes password: a_kind_of(String)
          end

          instance_eval(&block)
        end
      end
    end
  end

  concern :UserHelpers do
    class_methods do
      def user_expectation(description = nil, &conditions)
        it(description) { is_expected.to instance_eval(&conditions) }
      end

      def set_attributes(description = nil, &block)
        user_expectation(description) do
          have_attributes instance_eval(&block)
        end
      end

      def mapped_from_auth(**attribute_pairs)
        auth_string = attribute_pairs.map do |user_attr, auth_attr|
          ":#{auth_attr} to :#{user_attr}"
        end.to_sentence

        set_attributes "mapped #{auth_string} from auth_hash.info" do
          attribute_pairs.transform_values do |auth_key|
            auth_hash.info[auth_key]
          end
        end
      end

      def set_static_attributes(**attributes)
        attribute_list = attributes.keys.map do |attr|
          ":#{attr}"
        end.to_sentence

        set_attributes "set static values for #{attribute_list}" do
          attributes
        end
      end

      def copied_from_auth(*attributes)
        attributes.flatten!

        set_attributes "copied #{attributes.map(&:inspect).to_sentence} from auth_hash.info" do
          attribute_expectations = attributes.each_with_object({}) do |attr, hsh|
            hsh[attr] = auth_hash.info[attr]
          end

          attribute_expectations
        end
      end
    end
  end
end

RSpec.shared_context 'an external auth provisioner' do
  let(:auth_hash) { OmniAuth::AuthHash.new(Hash.new) }
  let(:provider) { auth_hash.provider || 'unknown' }

  let(:provisioner) { described_class.new provider: provider, auth_hash: auth_hash }

  let(:user) { User.new }

  subject { provisioner }

  before(:each) do
    each_hook do |hook|
      allow(provisioner).to receive(hook).and_call_original
    end
  end
end

RSpec.configure do |c|
  c.include ExternalAuth::ProvisionerSpecs::GlobalHelpers, external_auth_provisioner: true
end
