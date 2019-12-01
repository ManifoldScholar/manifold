module V1
  module Concerns
    module IsCreator
      extend ActiveSupport::Concern

      included do
        attributes :current_user_is_creator do |object, params|
          next false unless params[:current_user]
          next false unless object.respond_to? :creator

          object.creator == params[:current_user]
        end
      end
    end
  end
end
