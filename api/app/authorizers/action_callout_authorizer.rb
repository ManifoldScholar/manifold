class ActionCalloutAuthorizer < ApplicationAuthorizer

  # By default, we defer to {calloutable#updatable_by?}.
  def default(_adjective, user, options = {})
    with_calloutable { |p| p.updatable_by? user, options }
  end

  # Calloutable children can be deleted if the user can **update** the calloutable,
  # they do not have to be able to delete the calloutable itself.
  #
  # @see ProjectAuthorizer#updatable_by?
  # @see JournalAuthorizer#updatable_by?
  def deletable_by?(user, options = {})
    with_calloutable { |p| p.updatable_by? user, options }
  end

  # Most, if not all, things that are on the calloutable are readable if the calloutable is
  # readable. Note: the delegation to the calloutable will ensure that the child inherits
  # the draft visibility from the parent.
  #
  # @see ProjectAuthorizer#readable_by?
  # @see JournalAuthorizer#readable_by?
  def readable_by?(user, options = {})
    with_calloutable { |p| p.fully_readable_by? user, options }
  end

  # @see ProjectAuthorizer#fully_readable_by?
  # @see JournalAuthorizer#fully_readable_by?
  def fully_readable_by?(user, options = {})
    with_calloutable { |p| p.fully_readable_by? user, options }
  end

  def with_calloutable
    return with_journal(&Proc.new) if resource.calloutable.is_a? Journal
    return with_project(&Proc.new) if resource.calloutable.is_a? Project

    false
  end

  class << self
    # Without a specified calloutable that we can check the user's permissions on, it's
    # conceivable that a user could do anything to a calloutable's child.
    def default(_adjective, _user, _options = {})
      true
    end
  end

end
