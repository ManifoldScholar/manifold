# frozen_string_literal: true

class RenderWithoutWrap < ::Redcarpet::Render::HTML
  # rubocop:disable Style/RegexpLiteral
  WRAPPED_IN_P = /\A<p>(.*)<\/p>\Z/m
  # rubocop:enable Style/RegexpLiteral

  def postprocess(full_document)
    full_document[WRAPPED_IN_P, 1] || full_document
  end
end
