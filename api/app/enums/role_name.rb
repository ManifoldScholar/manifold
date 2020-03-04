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

  def any_editor?
    config.any_editor.present?
  end

  def visible_to_admin?
    admin?
  end

  def visible_to_editor?
    editor? || any_editor?
  end

  # @!endgroup

  class << self
    # @!group Selections

    def editor_roles
      select(&:any_editor?)
    end

    def entitlements
      select(&:entitlement?)
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

    private

    def any_editor!
      config.any_editor = true
    end

    def global!
      set_kind! :global
    end

    def global_entitlement!
      set_kind! :global_entitlement
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
end

class RoleName::Editor < RoleName
  any_editor!

  global!
end

class RoleName::ProjectCreator < RoleName
  global!
end

class RoleName::Marketeer < RoleName
  global!
end

class RoleName::ProjectEditor < RoleName
  any_editor!

  scoped!
end

class RoleName::ProjectResourceEditor < RoleName
  scoped!
end

class RoleName::ProjectAuthor < RoleName
  any_editor!

  scoped!
end

class RoleName::Reader < RoleName
  global!
end

class RoleName::Subscriber < RoleName
  global_entitlement!
end

class RoleName::ReadAccess < RoleName
  scoped_entitlement!
end
