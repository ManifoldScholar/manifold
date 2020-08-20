module API
  module V1
    # Test Mail controller
    class TestMailsController < ApplicationController
      before_action :authenticate_request!

      def create
        return respond_with_forbidden("TestMail", "create") unless current_user.can?(:send_test_mail)

        TestMailer.test(current_user).deliver_now
      end
    end
  end
end
