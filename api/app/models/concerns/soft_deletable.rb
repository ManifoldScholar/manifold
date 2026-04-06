# frozen_string_literal: true

module SoftDeletable
  extend ActiveSupport::Concern

  SOFT_DELETABLE_DEPENDENTS = %i[destroy delete_all].freeze

  include Filterable
  include SoftDeletionSupport

  included do
    define_model_callbacks :mark_for_purge, :soft_delete

    scope :only_deleted, -> { with_deleted.where.not(deleted_at: nil) }
    scope :with_deleted, -> { unscope(where: :deleted_at) }
    scope :sans_deleted, -> { with_deleted.where(deleted_at: nil) }

    delegate :soft_deletable_associations, to: :class

    before_mark_for_purge :validate_mark_for_purge!
    after_mark_for_purge :enqueue_background_purge!
    before_soft_delete :prevent_duplicate_soft_deletion!
    after_soft_delete :scramble_deleted_slug!, if: :should_scramble_deleted_slug?
  end

  # @see SoftDeletions::PurgeJob
  # @return [void]
  def async_destroy
    return if marked_for_purge?

    soft_delete! unless soft_deleted?
    mark_for_purge!
  end

  # @return [SoftDeletable, false]
  def mark_for_purge
    callbacks_result = with_lock do
      run_callbacks :mark_for_purge do
        mark_record_for_purge!
      end
    end

    callbacks_result ? self : false
  end

  # @raise [ActiveRecord::RecordNotDestroyed]
  # @return [SoftDeletable]
  def mark_for_purge!
    mark_for_purge or raise ActiveRecord::RecordNotDestroyed.new("Failed to mark the record for background purge", self)
  end

  def marked_for_purge?
    marked_for_purge_at?
  end

  def should_scramble_deleted_slug?
    has_attribute?(:slug) && slug.present?
  end

  def soft_deleted?
    deleted_at?
  end

  # @return [SoftDeletable, false]
  def soft_delete
    callbacks_result = with_lock do
      run_callbacks :soft_delete do
        soft_destroy_record!
        soft_destroy_dependent_records!
      end
    end

    callbacks_result ? self : false
  end

  # @raise [ActiveRecord::RecordNotDestroyed]
  # @return [SoftDeletable]
  def soft_delete!
    soft_delete or raise ActiveRecord::RecordNotDestroyed.new("Failed to destroy the record", self)
  end

  # @see SoftDeletions::Purge
  # @see SoftDeletions::Purger
  # @return [void]
  def soft_deletion_purge!
    ManifoldApi::Container["soft_deletions.purge"].call(self).value!
  end

  private

  # @return [void]
  def enqueue_background_purge!
    AfterCommitEverywhere.after_commit do
      SoftDeletions::PurgeJob.set(wait: 5.seconds).perform_later self
    end
  end

  # @return [void]
  def mark_record_for_purge!
    update_column :marked_for_purge_at, Time.current
  end

  # @return [void]
  def prevent_duplicate_soft_deletion!
    throw :abort if soft_deleted?
  end

  # @return [void]
  def scramble_deleted_slug!
    new_slug = "#{slug}-deleted-#{SecureRandom.hex(6)}"

    update_column :slug, new_slug
  end

  # @return [void]
  def soft_destroy_dependent_records!
    soft_deletable_associations.each do |association|
      associated_records = public_send(association.name)

      case association.options[:dependent]
      when :destroy
        associated_records.find_each(&:soft_delete)
      when :delete_all
        associated_records.sans_deleted.update_all(deleted_at: Time.current)
      end
    end
  end

  # @return [void]
  def soft_destroy_record!
    update_column :deleted_at, Time.current
  end

  # @return [void]
  def validate_mark_for_purge!
    throw :abort if !soft_deleted? || marked_for_purge?
  end

  module ClassMethods
    # @return [ActiveRecord::Relation]
    def apply_filtering_loads
      existing
    end

    # @return [void]
    def async_destroy_all
      find_each(&:async_destroy)
    end

    # @return [ActiveRecord::Relation]
    def existing
      sans_deleted
    end

    def soft_deletable?
      self < SoftDeletable
    end

    # @return [<ActiveRecord::Reflection::AssociationReflection>]
    def soft_deletable_associations
      reflect_on_all_associations.select do |assoc|
        soft_deletable_association?(assoc)
      end
    end

    # @api private
    # @param [ActiveRecord::Reflection::AssociationReflection] assoc
    def soft_deletable_association?(assoc)
      assoc.options[:dependent].in?(SOFT_DELETABLE_DEPENDENTS) && assoc.klass.try(:soft_deletable?)
    end
  end
end
