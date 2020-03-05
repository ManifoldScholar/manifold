module Entitlements
  class Container
    include Concerns::IntrospectiveContainer

    register_simple_callables_in :audit, :apply, :perform
  end
end
