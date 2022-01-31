# This is a shared authorizer for dependents of journals
class JournalChildAuthorizer < ApplicationAuthorizer
  # By default, we defer to {JournalAuthorizer#updatable_by?}.
  def default(_adjective, user, options = {})
    with_journal { |j| j.updatable_by? user, options }
  end

  # Journal children can be deleted if the user can **update** the journal,
  # they do not have to be able to delete the journal itself.
  # f
  # @see JournalAuthorizer#updatable_by?
  def deletable_by?(user, options = {})
    with_journal { |j| j.updatable_by? user, options }
  end

  # Most, if not all, things that are on the journal are readable if the journal is
  # readable. Note: the delegation to the journal will ensure that the child inherits
  # the draft visibility from the parent.
  #
  # @see JournalAuthorizer#readable_by?
  def readable_by?(user, options = {})
    with_journal { |j| j.fully_readable_by? user, options }
  end

  # @see JournalAuthorizer#fully_readable_by?
  def fully_readable_by?(user, options = {})
    with_journal { |j| j.fully_readable_by? user, options }
  end

  class << self
    # Without a specified journal that we can check the user's permissions on, it's
    # conceivable that a user could do anything to a journal's child.
    def default(_adjective, _user, _options = {})
      true
    end
  end
end
