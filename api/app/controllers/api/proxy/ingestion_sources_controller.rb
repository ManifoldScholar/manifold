module API
  module Proxy
    class IngestionSourcesController < ActionController::API

      def show
        source = IngestionSource.find(params[:id])
        raise ActionController::RoutingError unless source.attachment

        if source.attachment.storage.respond_to? :path
          send_attachment(source)
        else
          redirect_to source.attachment.url
        end
      end

      private

      def send_attachment(source)
        send_file(
          source.attachment.storage.path(source.attachment.id),
          type: source.attachment.mime_type,
          disposition: "inline"
        )
      end

    end
  end
end
