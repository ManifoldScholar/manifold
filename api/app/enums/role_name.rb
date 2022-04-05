class RoleName < ClassyEnum::Base
  applicable!

  delegate :global?, :scoped?, :scoped_entitlement?, :global_entitlement?,
           :entitlement?, :has_expected_resource?,
           to: :kind

  # @!attribute [r] kind
  # @return [RoleKind]
  def kind
    config.kind || RoleKind[:unknown]
  end

  def applies_to?(user)
    return false if entitlement?
    return false unless global?

    user.has_cached_role?(to_sym) || reader?
  end

  def applies_for_kind?(user)
    return false if entitlement?

    if global? && !reader?
      user.has_role?(to_sym)
    elsif scoped?
      user.has_role? to_sym, :any
    else
      reader?
    end
  end

  alias applicable_for_kind? applies_for_kind?

  # @!group Visibility predicates

  def acts_global?
    global? || global_entitlement?
  end

  def any_editor?
    config.any_editor.present?
  end

  def can_update_projects?
    config.can_update_projects.present?
  end

  def can_update_journals?
    config.can_update_journals.present?
  end

  def provides_draft_access?
    config.provides_draft_access.present?
  end

  def provides_full_read_access?
    config.provides_full_read_access.present?
  end

  def visible_to_admin?
    admin?
  end

  def visible_to_editor?
    editor? || any_editor?
  end

  def siblings
    self.class.select do |enum|
      enum.kind == kind && enum != self
    end
  end

  # @!endgroup

  class << self
    # @!group Selections

    def can_update_projects
      select(&:can_update_projects?)
    end

    def can_update_journals
      select(&:can_update_journals?)
    end

    def draft_access
      select(&:provides_draft_access?)
    end

    def editor_roles
      select(&:any_editor?)
    end

    def entitlements
      select(&:entitlement?)
    end

    # @return [<RoleName>]
    def full_read_access
      select(&:provides_full_read_access?)
    end

    def globals(without: nil)
      select do |role|
        next false if without.present? && role == without

        role.global?
      end
    end

    # @return [<Symbol>]
    def global_predicates(**options)
      globals(**options).map(&:predicate_name)
    end

    def scoped(without: nil)
      select do |role|
        next false if role.entitlement?
        next false if without.present? && role == without

        role.scoped?
      end
    end

    def scoped_predicates(**options)
      scoped(options).map(&:predicate_name)
    end

    # @!endgroup

    def fetch_for_kind(user)
      detect do |role|
        role.owner = user

        role.applies_for_kind? user
      end
    end

    # @!attribute [r] for_draft_access
    # @return [{ Symbol => <Symbol> }]
    def for_draft_access
      @for_draft_access ||= for_access draft_access
    end

    # @!attribute [r] for_full_read_access
    # @return [{ Symbol => <Symbol> }]
    def for_full_read_access
      @for_full_read_access ||= for_access full_read_access
    end

    # @!attribute [r] for_project_update
    # @return [{ Symbol => <Symbol> }]
    def for_project_update
      @for_project_update ||= for_access can_update_projects
    end

    # @!attribute [r] @for_journal_update
    # @return [{ Symbol => <Symbol> }]
    def for_journal_update
      @for_journal_update ||= for_access can_update_journals
    end

    private

    def any_editor!
      config.any_editor = true
    end

    def can_update_projects!
      config.can_update_projects = true
    end

    def can_update_journals!
      config.can_update_journals = true
    end

    def for_access(selection)
      global, scoped = selection.partition(&:acts_global?)

      { global: global.map(&:to_sym), scoped: scoped.map(&:to_sym) }
    end

    def global!
      set_kind! :global
    end

    def global_entitlement!
      set_kind! :global_entitlement
    end

    def provides_draft_access!
      config.provides_draft_access = true
    end

    def provides_full_read_access!
      config.provides_full_read_access = true
    end

    def reading_group!
      set_kind! :reading_group
    end

    def scoped!
      set_kind! :scoped
    end

    def scoped_entitlement!
      set_kind! :scoped_entitlement
    end

    def set_kind!(kind)
      config.kind = RoleKind.fetch(kind)
    end
  end
end

class RoleName::Admin < RoleName
  global!

  can_update_projects!
  can_update_journals!
  provides_draft_access!
  provides_full_read_access!
end

class RoleName::Editor < RoleName
  any_editor!

  global!

  can_update_projects!
  can_update_journals!
  provides_draft_access!
  provides_full_read_access!
end

class RoleName::ProjectCreator < RoleName
  global!
end

class RoleName::Marketeer < RoleName
  global!

  can_update_projects!
  can_update_journals!
  provides_draft_access!
  provides_full_read_access!
end

class RoleName::ProjectEditor < RoleName
  any_editor!

  scoped!

  can_update_projects!
  can_update_journals!
  provides_draft_access!
  provides_full_read_access!
end

class RoleName::ProjectResourceEditor < RoleName
  scoped!

  can_update_projects!
  can_update_journals!
  provides_draft_access!
  provides_full_read_access!
end

class RoleName::ProjectAuthor < RoleName
  scoped!

  provides_draft_access!
  provides_full_read_access!
end

class RoleName::Reader < RoleName
  global!
end

class RoleName::Subscriber < RoleName
  global_entitlement!

  provides_full_read_access!
end

class RoleName::ReadAccess < RoleName
  scoped_entitlement!

  provides_full_read_access!
end

class RoleName::Moderator < RoleName
  reading_group!
end

class RoleName::Member < RoleName
  reading_group!
end
