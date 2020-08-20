module Entitlements
  class Container
    include IntrospectiveContainer

    register_simple_callables_in :audit, :apply, :perform
  end
end
