module ReadingGroups
  class JoinPublic
    # @return [Dry::Monads::Result]
    def call(options)
      Operation.new(options).call
    end

    class Operation
      extend Dry::Initializer

      include Dry::Monads[:result, :do]
      include MonadicJSONAPIErrors
      include MonadicPersistence

      option :reading_group, model: "ReadingGroup"
      option :user, model: "User", optional: true

      def call(*)
        yield validate

        rgm = reading_group.reading_group_memberships.build user: user

        monadic_save rgm
      end

      private

      def validate
        return forbidden_jsonapi_error(code: "not_signed_in", status: :forbidden, title: "Must be authenticated") unless user.present?
        return forbidden_jsonapi_error(code: "not_public", status: :forbidden, title: "Not Available") unless reading_group&.public?
        return jsonapi_error(code: "already_joined", title: "Already a member") if membership_exists?

        Success true
      end

      def membership_exists?
        return unless user.present?

        ReadingGroupMembership.active.where(user: user, reading_group: reading_group).exists?
      end
    end
  end
end
