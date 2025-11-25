# frozen_string_literal: true

RSpec.shared_examples_for "instance abilities" do |klass, abilities|
  include TestHelpers::AuthorizationHelpers
  extend TestHelpers::AuthorizationHelpers

  [:create, :read, :update, :delete].each do |ability|
    subject_can = is_authorized_to?(ability, abilities)
    verb = subject_can ? "CAN" : "CAN'T"
    assertion = subject_can ? :to : :to_not

    if test_ability_for?(ability, abilities)
      it "the subject #{verb} #{ability.upcase} the #{klass.to_s.downcase}" do
        skip("Not testing instance-level #{ability} within this context") unless test_ability_for?(ability, abilities)

        matcher = __send__(matcher_for_ability(ability), subject)

        case assertion
        in :to_not
          expect(object).not_to matcher
        else
          expect(object).to matcher
        end
      end
    else
      it "does not test if the subject can #{ability}" do
        skip "skipped in this context"
      end
    end
  end
end

RSpec.shared_examples_for "class abilities" do |klass, abilities|
  include TestHelpers::AuthorizationHelpers
  extend TestHelpers::AuthorizationHelpers

  [:create, :read, :update, :delete].each do |ability|
    subject_can = is_authorized_to?(ability, abilities)
    verb = subject_can ? "CAN" : "CAN'T"
    assertion = subject_can ? :to : :to_not

    if test_ability_for?(ability, abilities)
      it "the subject #{verb} #{ability} any #{klass.to_s.pluralize}" do
        skip("Not testing class-level #{ability} within this context") unless test_ability_for?(ability, abilities)

        matcher = __send__(matcher_for_ability(ability), subject)

        case assertion
        in :to_not
          expect(klass).not_to matcher
        else
          expect(klass).to matcher
        end
      end
    else
      it "does not test if the subject can #{ability}" do
        skip "skipped in this context"
      end
    end
  end
end

RSpec.shared_context "unauthenticated user" do |klass|
  klass.name.underscore

  subject { anonymous_user }
end
