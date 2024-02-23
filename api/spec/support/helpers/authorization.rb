# frozen_string_literal: true

module TestHelpers
  module AuthorizationHelpers
    def test_ability_for?(ability, abilities)
      abilities[:read_only] == true ||
        abilities[:all] == true ||
        abilities[:none] == true ||
        abilities.key?(ability)
    end

    def is_authorized_to?(ability, abilities)
      return true if abilities[:all] == true
      return false if abilities[:none] == true
      if abilities[:read_only] == true
        return true if ability == :read
        return false
      end
      abilities[ability]
    end

    def matcher_for_ability(ability)
      "be_#{Authority.abilities.fetch(ability)}_by".to_sym
    end

    # Roughly...
    def indefinite_article_for(klass)
      return nil if klass == Settings || klass == Statistics
      return "a " unless %w(a e i o u).include? klass.to_s.downcase.first
      "an "
    end
  end

  def anonymous_user
    Naught.build do |config|
      config.impersonate User
      config.predicates_return false

      def role
        nil
      end

      def kind
        nil
      end

      def can_read?(resource, options = {})
        resource.readable_by? self, options
      end
    end.new
  end
end
