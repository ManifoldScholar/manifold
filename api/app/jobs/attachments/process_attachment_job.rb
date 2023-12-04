# frozen_string_literal: true

module Attachments
  class ProcessAttachmentJob < ApplicationJob
    include ExclusiveJob

    concurrency 1, drop: false unless Rails.env.test?

    retry_on ::MiniMagick::Error, wait: 10.seconds, attempts: 3

    queue_as :default

    def perform(*args)
      params = normalize_args(args)
      attacher = params[:attacher_class].retrieve(
        model: params[:record],
        name: params[:name],
        file: params[:file_data]
      )

      attacher.file.open do
        attacher.create_derivatives(attacher.file.tempfile) if attacher.respond_to?(:create_derivatives)
      end
      attacher.atomic_promote
    rescue Shrine::AttachmentChanged, ActiveRecord::RecordNotFound
      # attachment has changed or record has been deleted, nothing to do
    end

    def exclusive_lock_name
      params = normalize_args(arguments)
      return super unless params[:klass].present? && params[:id].present?

      "#{super}:#{params[:klass]}:#{params[:id]}"
    end

    # rubocop:disable Metrics/MethodLength
    # https://shrinerb.com/docs/upgrading-to-3#dual-support
    def normalize_args(args)
      if args.one?
        file_data, (klass, id), name, shrine_class =
          args.first.values_at("attachment", "record", "name", "shrine_class")

        record         = Object.const_get(klass).find(id) # if using Active Record
        attacher_class = Object.const_get(shrine_class)::Attacher
      else
        attacher_class, klass, id, name, file_data = args
        attacher_class = Object.const_get(attacher_class)
        record         = Object.const_get(klass).find(id) # if using Active Record
      end

      {
        file_data: file_data,
        klass: klass,
        id: id,
        attacher_class: attacher_class,
        name: name,
        record: record
      }
    end
    # rubocop:enable Metrics/MethodLength
  end
end
