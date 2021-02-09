module V1
  class ManifoldSerializer
    include ActiveSupport::Configurable
    include FastJsonapi::ObjectSerializer

    config.routes = RouterObject.new

    config_accessor :routes, instance_writer: false

    class << self
      def guard_belongs_to_user(user_id_attr: :user_id)
        ->(object, params) do
          next false unless params[:current_user].present?
          next false unless object.respond_to? user_id_attr

          user.public_send(user_id_attr) == params[:current_user].id
        end
      end

      def guard_created_by_user
        guard_belongs_to_user user_id_attr: :creator_id
      end

      # @param [Symbol] action
      # @return [Proc]
      def guard_user_authorized_to(action)
        ->(object, params) do
          Authority.action_authorized?(action, object, params[:current_user] || AnonymousUser.new)
        end
      end
    end
  end
end
