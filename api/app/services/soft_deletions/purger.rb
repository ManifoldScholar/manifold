# frozen_string_literal: true

module SoftDeletions
  # We use this service to delete large objects in the background in order to avoid
  # long-running requests, and specifically to avoid massive table locks happening
  # within a single transaction during a soft-deletion.
  #
  # Normally we would want to keep a transaction active around processes like this
  # in order to ensure data integrity, but if a model has reached this object, it
  # is already marked for deletion and we don't need to maintain the ability to
  # roll things back.
  #
  # @see SoftDeletable
  # @see SoftDeletions::PurgeJob
  # @see SoftDeletions::Purge
  class Purger
    extend ActiveModel::Callbacks

    include Dry::Monads[:result]
    include Dry::Initializer[undefined: false].define -> do
      param :original_record, SoftDeletions::Types::SoftDeletable
    end

    define_model_callbacks :perform

    around_perform :activate_soft_deletion!

    around_perform :disable_acts_as_list!

    # @raise [SoftDeletions::Unpurgeable] if the record could not be purged
    # @return [Dry::Monads::Success(void)]
    def call
      # :nocov:
      return Success() unless original_record.marked_for_purge?
      # :nocov:

      handle! original_record
    rescue ActiveRecord::RecordNotDestroyed => e
      raise SoftDeletions::Unpurgeable, "Could not soft delete #{original_record.class.name}(#{original_record.id.inspect}): #{e.message}"
    else
      Success()
    end

    private

    # @param [ApplicationRecord] record
    # @return [void]
    def handle!(record)
      case record
      when Annotation
        on_annotation! record
      when Comment
        on_comment! record
      when Project
        on_project! record
      when ReadingGroup
        on_reading_group! record
      when Text
        on_text! record
      when TextSection
        on_text_section! record
      when User
        on_user! record
      end

      record.destroy!
    end

    # @return [void]
    def activate_soft_deletion!
      SoftDeletions::Current.active! do
        yield
      end
    end

    def disable_acts_as_list!
      TextSection.acts_as_list_no_update do
        yield
      end
    end

    # @param [Annotation] record
    # @return [void]
    def on_annotation!(record)
      record.comments.where(parent_id: nil).find_each do |comment|
        handle! comment
      end
    end

    # @param [Comment] record
    # @return [void]
    def on_comment!(record)
      record.children.find_each do |child_comment|
        handle! child_comment
      end
    end

    # @param [Project] record
    # @return [void]
    def on_project!(record)
      record.texts.find_each do |text|
        handle!(text)
      end
    end

    # @param [ReadingGroup] record
    # @return [void]
    def on_reading_group!(record)
      # We perform this outside of the transaction even though it's part of
      # the callback.
      record.update_annotations_privacy
      record.reading_group_memberships.reorder(nil).delete_all
      record.reading_group_categories.reorder(nil).delete_all
    end

    # @param [Text] record
    # @return [void]
    def on_text!(record)
      # These are the biggest offender. Some texts can have tens of thousands of nodes,
      # and we want to delete them outside of any transactions that lock other updates.
      TextSectionNode.where(id: record.text_section_nodes.select(:id)).delete_all

      TextSectionStylesheet.where(id: record.text_section_stylesheets.select(:id)).delete_all

      record.action_callouts.destroy_all

      record.text_sections.find_each do |text_section|
        handle!(text_section)
      end

      record.stylesheets.delete_all
    end

    # @param [TextSection] record
    # @return [void]
    def on_text_section!(record)
      record.text_section_nodes.delete_all
      record.text_section_stylesheets.delete_all
      record.annotations.update_all(text_section_id: nil)
    end

    # @param [User] record
    # @return [void]
    def on_user!(record)
      record.annotations.find_each do |annotation|
        handle! annotation
      end
    end
  end
end
