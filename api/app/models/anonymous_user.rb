# frozen_string_literal: true

AnonymousUser = Naught.build do |config|
  config.impersonate User
  config.predicates_return false

  delegate *RoleName.global_predicates, to: :role
  delegate *RoleName.scoped_predicates, to: :kind

  [*RoleName.global_predicates, *RoleName.scoped_predicates].each do |predicate|
    class_eval <<~RUBY, __FILE__, __LINE__ + 1
    def #{predicate}
      false
    end
    RUBY
  end

  def roles
    []
  end

  def role
    nil
  end

  def kind
    nil
  end

  def can_read?(resource, *other)
    resource.readable_by? self, *other
  end

  def has_cached_role?(...)
    false
  end

  def has_role?(...)
    false
  end
end
