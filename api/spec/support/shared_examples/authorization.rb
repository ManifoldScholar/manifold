require "rails_helper"

shared_examples_for "instance abilities" do |klass, abilities|
  include TestHelpers::AuthorizationHelpers
  extend TestHelpers::AuthorizationHelpers

  [:create, :read, :update, :delete].each do |ability|
    subject_can = is_authorized_to?(ability, abilities)
    verb = subject_can ? "CAN" : "CAN'T"
    assertion = subject_can ? :to : :to_not

    it "the subject #{verb} #{ability.upcase} the #{klass.to_s.downcase}" do
      skip unless test_ability_for?(ability, abilities)
      expect(object).send(assertion, self.send(matcher_for_ability(ability), subject))
    end
  end
end

shared_examples_for "class abilities" do |klass, abilities|
  include TestHelpers::AuthorizationHelpers
  extend TestHelpers::AuthorizationHelpers

  [:create, :read, :update, :delete].each do |ability|
    subject_can = is_authorized_to?(ability, abilities)
    verb = subject_can ? "CAN" : "CAN'T"
    assertion = subject_can ? :to : :to_not

    it "the subject #{verb} #{ability} any #{klass.to_s.pluralize}" do
      skip unless test_ability_for?(ability, abilities)
      expect(klass).send(assertion, self.send(matcher_for_ability(ability), subject))
    end
  end
end

