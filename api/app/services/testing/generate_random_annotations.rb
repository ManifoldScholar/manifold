module Testing
  class GenerateRandomAnnotations < ActiveInteraction::Base
    extend Memoist

    record :text_section

    record :reading_group, default: nil

    record :user, default: proc { User.cli_user }

    integer :annotation_count, default: 50

    integer :highlight_count, default: 0

    def execute
      annotation_count.times do
        generate_random_annotation! format: "annotation"
      end

      highlight_count.times do
        generate_random_annotation! format: "highlight"
      end
    end

    private

    def generate_random_annotation!(format: "annotation")
      model = text_section.annotations.build creator: user, format: format

      model.reading_group = reading_group if reading_group.present?

      model.body = "TEST_ANNOTATION"

      model.assign_attributes random_generator.to_annotation

      model.save!
    end

    memoize def text_node
      HTMLNodes::Node.new text_section.body_json
    end

    memoize def text_node_paths
      text_node.with_paths.select do |attrs|
        valid_parent?(attrs) && attrs[:node].text?
      end
    end

    def valid_parent?(attrs)
      attrs[:parent]&.has_tag?(:p)
    end

    def random_generator
      Generator.new nodes: text_node_paths
    end

    class Generator
      extend Memoist
      include Sliceable

      INDEX_MOD = { 0 => 5, 1 => 3, 2 => 2, 3 => 1 }.flat_map do |n, weight|
        [n] * weight
      end.shuffle.freeze

      def initialize(nodes:)
        @nodes = nodes
      end

      memoize def last_index
        @nodes.size - 1
      end

      def same_node?
        start_node == close_node
      end

      memoize def start_node
        @nodes.sample
      end

      memoize def start_index
        @nodes.index start_node
      end

      memoize def close_index
        offset = INDEX_MOD.sample

        (start_index + offset).clamp(start_index, last_index)
      end

      memoize def close_node
        @nodes[close_index]
      end

      memoize def start_node_length
        start_node[:node].content.length
      end

      memoize def close_node_length
        close_node[:node].content.length
      end

      memoize def start_char
        SecureRandom.random_number(start_node_length / 2).clamp(1, start_node_length)
      end

      memoize def end_char
        if same_node?
          half_start = start_node_length / 2

          random_offset = SecureRandom.random_number(half_start) + half_start

          random_offset.clamp(start_char, start_node_length)
        else
          SecureRandom.random_number(close_node_length).clamp(1, start_node_length)
        end
      end

      memoize def subject
        @nodes[start_index..close_index].map do |n|
          n[:node].content
        end.join(" ")
      end

      def to_annotation
        slice(:subject, :start_char, :end_char).merge(
          start_node: start_node[:node].node_uuid,
          end_node: close_node[:node].node_uuid
        )
      end
    end
  end
end
