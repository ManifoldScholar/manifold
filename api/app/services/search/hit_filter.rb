# frozen_string_literal: true

module Search
  # This is a simple state class that enables us to track whether a certain
  # node / match has been "seen" in a given set of text section node results.
  #
  # Because of how we've implemented our excerpt matching, it is possible for
  # larger matches to appear as duplicates from higher up in the node tree.
  # They will always be a lower-ranked search, so we can base this on whether
  # or not we've already encountered a more specific version of the contained
  # nodes.
  #
  # @api private
  # @see TextSectionNode.hit_search_for
  class HitFilter
    def initialize
      @seen_uuids = []
      @seen_highlights = []
    end

    # @param [TextSectionNode] node
    def allow?(node)
      return false if seen?(node)

      seen! node

      return true
    end

    private

    def has_highlight?(node)
      "<mark>".in?(node.pg_search_highlight)
    end

    # @param [TextSectionNode] node
    def seen?(node)
      seen_uuid?(node) || seen_highlight?(node)
    end

    # @param [TextSectionNode] node
    def seen_highlight?(node)
      node.pg_search_highlight.present? && node.pg_search_highlight.in?(@seen_highlights)
    end

    # @param [TextSectionNode] node
    def seen_uuid?(node)
      node.contained_node_uuids.any? { |uuid| uuid.in?(@seen_uuids) }
    end

    # @param [TextSectionNode] node
    # @return [void]
    def seen!(node)
      @seen_uuids << node.hit_uuid
      @seen_highlights << node.pg_search_highlight

      @seen_uuids.compact!
      @seen_highlights.compact!
    end

    def skip?(node)
      !has_highlight?(node)
    end
  end
end
