module ExternalAuth
  module PayloadHelpers
    extend ActiveSupport::Concern

    class_methods do
      # There are certain JSON pairs that are constant irrespective of the outcome
      def includes_invariant_pairs!
        specify ":type and :provider are always present" do
          is_expected.to include_json type: "oauth", provider: provider
        end

        specify ":failed is the boolean complement of `outcome.valid?`" do
          is_expected.to include_json failed: !outcome_valid
        end
      end

      def includes_auth_token!(negated: false)
        copula = negated ? "isn't" : "is"

        specify "the auth token #{copula} included" do
          unless negated
            is_expected.to include_json(authToken: a_kind_of(String))
          else
            is_expected.not_to include_json(authToken: a_kind_of(String))
          end
        end
      end

      def includes_errors!(negated: false)
        copula = negated ? "aren't" : "are"

        specify "error messages #{copula} included" do
          unless negated
            is_expected.to include_json(errors: outcome_error_messages)
          else
            is_expected.not_to include_json(errors: a_kind_of(Array))
          end
        end
      end
    end
  end
end
