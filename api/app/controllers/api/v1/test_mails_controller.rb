module Api
  module V1
    # Test Mail controller
    class TestMailsController < ApplicationController

      def create
        respond_with_error unless current_user.can?(:send_test_mail)
        TestMailer.test(current_user).deliver_now
      end

      private

      def respond_with_error
        vars = { resource: "TestMail", action: "create" }
        options = {
          status: 403,
          title: I18n.t("controllers.errors.forbidden.instance.title", vars).titlecase,
          detail: I18n.t("controllers.errors.forbidden.instance.detail", vars)
        }
        render json: { errors: build_api_error(options) }, status: 403
      end

    end
  end
end
