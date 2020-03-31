module TestHelpers
  module AuthorityMatcherHelpers
    def validate_verb!(verb)
      verb.to_sym.tap do |action|
        raise TypeError, "Unknown action: #{action.inspect}" unless action.in?(Authority.abilities)
      end
    end

    def validate_verbs!(*verbs)
      verbs.flatten.map(&:to_sym).tap do |actions|
        unknown = actions.reject { |action| action.in?(Authority.abilities) }.map(&:inspect)

        raise TypeError, "Unknown action(s): #{unknown.to_sentence}" if unknown.any?
      end
    end

    def validate_resource!(resource)
      raise TypeError, "Expected a class or model instance: #{resource}" unless valid_resource?(resource)
    end

    def validate_user!(user)
      raise TypeError, "Expected a user: #{user.inspect}" unless valid_user?(user)
    end

    def class_level?(resource)
      resource.kind_of?(Class) && resource < Authority::Abilities
    end

    def instance_level?(resource)
      resource.kind_of?(Authority::Abilities)
    end

    def valid_resource?(resource)
      class_level?(resource) || instance_level?(resource)
    end

    def valid_user?(user)
      user.kind_of?(Authority::UserAbilities)
    end

    def inspect_actions(list, as_or: false)
      connectors = {
        words_connector: ", ",
        two_words_connector: as_or ? " or " : " and ",
        last_word_connector: as_or ? ", or " : ", and "
      }

      Array(list).map(&:to_sym).to_sentence(connectors)
    end
  end
end

RSpec::Matchers.define :be_authorized_to do |verb, resource, options = {}|
  include TestHelpers::AuthorityMatcherHelpers

  match do |user|
    @action = validate_verb! verb

    validate_resource! resource

    Authority.action_authorized?(@action, resource, user, options)
  end

  failure_message do |user|
    ["expected user to be authorized to #{@action.inspect}"].tap do |message|
      message << "any kind of #{resource}" if class_level?(resource)
      message << "<#{resource.model_name}::#{resource.id}>" if instance_level?(resource)
      message << "with options: #{options.inspect}" if options.present?
    end.join(" ")
  end
end

RSpec::Matchers.define :be_able_to do |*verbs|
  include TestHelpers::AuthorityMatcherHelpers

  match do |user|
    validate_resource! resource

    @actions = validate_verbs! verbs

    @allowed, @disallowed = @actions.partition do |action|
      Authority.action_authorized?(action, resource, user, options)
    end

    @disallowed.none?
  end

  chain :on, :resource
  chain :with, :options

  failure_message do |user|
    prefix = ["expected user to be able to #{inspect_actions(@actions)}"].tap do |message|
      message << "any kind of #{resource}" if class_level?(resource)
      message << "<#{resource.model_name}::#{resource.id}>" if instance_level?(resource)
      message << "with options: #{options.inspect}" if options.present?
    end.join(" ")

    suffix = [].tap do |message|
      message << "but could not #{inspect_actions(@disallowed, as_or: true)}"
    end

    "#{prefix}, #{suffix}"

    [prefix, suffix].join(", ")
  end

  failure_message_when_negated do |user|
    prefix = ["expected user to not be able to #{inspect_actions(@actions)}"].tap do |message|
      message << "any kind of #{resource}" if class_level?(resource)
      message << "<#{resource.model_name}::#{resource.id}>" if instance_level?(resource)
      message << "with options: #{options.inspect}" if options.present?
    end.join(" ")

    suffix = [].tap do |message|
      message << "but was able to #{inspect_actions(@allowed)}"
    end

    "#{prefix}, #{suffix}"

    [prefix, suffix].join(", ")
  end
end

RSpec::Matchers.define :allow_a_user_to do |*verbs|
  include TestHelpers::AuthorityMatcherHelpers

  match do |resource|
    validate_resource! resource
    validate_user! user

    @actions = validate_verbs! verbs

    @allowed, @disallowed = @actions.partition do |action|
      Authority.action_authorized?(action, resource, user, options)
    end

    @disallowed.none?
  end

  chain :as, :user
  chain :with, :options

  failure_message do |resource|
    prefix = ["expected user to be able to #{inspect_actions(@actions)}"].tap do |message|
      message << "any kind of #{resource}" if class_level?(resource)
      message << "<#{resource.model_name}::#{resource.id}>" if instance_level?(resource)
      message << "with options: #{options.inspect}" if options.present?
    end.join(" ")

    suffix = [].tap do |message|
      message << "but could not #{inspect_actions(@disallowed, as_or: true)}"
    end

    "#{prefix}, #{suffix}"

    [prefix, suffix].join(", ")
  end

  failure_message_when_negated do |resource|
    prefix = ["expected user to not be able to #{inspect_actions(@actions)}"].tap do |message|
      message << "any kind of #{resource}" if class_level?(resource)
      message << "<#{resource.model_name}::#{resource.id}>" if instance_level?(resource)
      message << "with options: #{options.inspect}" if options.present?
    end.join(" ")

    suffix = [].tap do |message|
      message << "but was able to #{inspect_actions(@allowed)}"
    end

    "#{prefix}, #{suffix}"

    [prefix, suffix].join(", ")
  end
end

RSpec::Matchers.define_negated_matcher :prevent_a_user_from, :allow_a_user_to
RSpec::Matchers.define_negated_matcher :be_unauthorized_to, :be_authorized_to
RSpec::Matchers.define_negated_matcher :be_unable_to, :be_able_to
