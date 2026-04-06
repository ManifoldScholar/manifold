# frozen_string_literal: true

module Packaging
  # @see Shared::PipelineOperation
  module PipelineOperation
    extend ActiveSupport::Concern

    include ::Shared::PipelineOperation
  end
end
