
module Auth
  module Lti
    class Consent

      def initialize(request, params)
        @request = request
        @registration_token = params[:registration_token]
        @openid_configuration_url = params[:openid_configuration]
        @errors = Set.new
      end

      def valid?
        @errors.none?
      end

      def render_consent_html
        <<~HTML.html_safe
          <!DOCTYPE html>
          <html>
            <head>
              <title>Manifold LTI Registration</title>
              <style></style>
            </head>
            <body>
              <div style="margin-top: 100px; text-align: center;">
                <h1>Welcome to Manifold LTI Tool Registration</h1>
                <!-- LTI options can go here -->
                <form method="POST">
                  <input type="hidden" name="issuer" value="#{@request.referrer}" />
                  <input type="hidden" name="registration_token" value="#{@registration_token}" />
                  <input type="hidden" name="openid_configuration" value="#{@openid_configuration_url}" />
                  <input type="submit" name="Submit" />
                </form>
              </div>
            </body>
          </html>
        HTML
      end

      def render_error_page
        <<~HTML.html_safe
          <!DOCTYPE html>
          <html>
            <head>
              <title>Manifold LTI Registration</title>
              <style></style>
            </head>
            <body>
              <div style="margin-top: 100px; text-align: center;">
                <h1>Welcome to Manifold LTI Tool Registration</h1>
                <div>Something went wrong...</div>
                <ul>
                  <li>#{@errors.join("</li><li>")}</li>
                </ul>
              </div>
            </body>
          </html>
        HTML
      end

      def referrer_uri
        @referrer_uri ||= URI.parse(@request.referrer)
      end

    end
  end
end
