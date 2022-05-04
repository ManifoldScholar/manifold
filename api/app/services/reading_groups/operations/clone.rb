module ReadingGroups
  module Operations
    class Clone
      extend Dry::Initializer

      include Dry::Monads[:do, :list, :result, :validated]
      include MonadicPersistence

      CLONEABLE_ATTRIBUTES = %i[
        name privacy notify_on_join creator_id
      ].freeze

      param :reading_group, model: "ReadingGroup"

      option :user, model: "User", optional: true

      option :name, Types::String.optional, optional: true, default: proc { nil }
      option :archive, Types::Bool, optional: true, default: proc { false }
      option :clone_owned_annotations, Types::Bool, optional: true, default: proc { false }

      def call
        new_reading_group = yield clone_reading_group!

        yield clone_collection! new_reading_group

        yield maybe_clone_annotations! new_reading_group

        yield maybe_archive_membership!

        Success new_reading_group
      end

      private

      # @return [void]
      def clone_reading_group!
        attrs = reading_group.slice *CLONEABLE_ATTRIBUTES

        group = ReadingGroup.new attrs

        group.name = name if name.present?

        group.creator = user

        monadic_save group
      end

      # @see Collections::Operations::Clone
      # @return [Dry::Monads::Result]
      def clone_collection!(new_reading_group)
        cloner = Collections::Operations::Clone.new reading_group, new_reading_group

        cloner.call
      end

      def maybe_clone_annotations!(new_reading_group)
        return Success(false) unless clone_owned_annotations

        annotations = Annotation.where(reading_group: reading_group, creator: user)

        overrides = { reading_group: new_reading_group }

        annotations.find_each do |annotation|
          cloner = Annotations::Operations::Clone.new annotation, overrides: overrides

          yield cloner.call
        end

        Success true
      end

      # @return [void]
      def maybe_archive_membership!
        return Success(false) unless archive

        membership = ReadingGroupMembership.where(reading_group: reading_group, user: user).first

        return Success(false) unless membership&.may_archive?

        Success membership.archive!
      rescue AASM::InvalidTransition
        Failure[:cannot_archive, "Cannot archive membership"]
      end
    end
  end
end
