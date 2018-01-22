require "forwardable"

module Search
  # Search::Results wraps raw Searchkick::Results and injects parent record IDs and slugs
  # in an efficient manner. Except for places where it's injecting these values into the
  # raw results, it delegates all messages to the underlying Searchkick::Results object.
  #
  # This class is essentially a no-op unless Searchkick::Results load option is false.
  # When options[:load] is true, Searchkick will map the elastic search results to active
  # model instances. If Searchkick is returning raw elastic search results, we can
  # execute a performant query and inject parent slugs needed for link creation.
  class Results

    include Enumerable
    extend Forwardable

    attr_reader :searchkick_results

    def_delegators :adjusted_results, :each, :any?, :empty?, :size, :length, :slice, :[],
                   :to_ary

    def_delegators :@searchkick_results, :records, :suggestions, :with_details,
                   :aggregations, :aggs, :took, :error, :model_name, :entry_name,
                   :total_count, :total_entries, :current_page, :per_page, :limit_value,
                   :padding, :total_pages, :num_pages, :offset_value, :offset,
                   :previous_page, :prev_page, :prev_page, :next_page, :first_page?,
                   :last_page?, :out_of_range?, :hits, :misspellings?, :klass, :response,
                   :options

    def initialize(searchkick_results)
      @searchkick_results = searchkick_results
    end

    def adjusted_results
      @adjusted_results ||= begin
        return @searchkick_results.results if @searchkick_results.options[:load]
        inject_associations(@searchkick_results)
      end
    end

    def each_with_hit(&block)
      adjusted_results.zip(@searchkick_results.hits).each(&block)
    end

    private

    def inject_associations(searchkick_results)
      text_sections, creators, annotations =
        fetch_associations(searchkick_results.results)
      searchkick_results.each do |result|
        result[:creator] = creators[result[:creator_id]]
        result[:text_section] = text_sections[result[:text_section_id]]
        result[:annotation] = annotations[result[:_id]] if result[:_type] == "annotation"
      end
    end

    def fetch_associations(results)
      text_sections = fetch_text_sections(results)
      creators = fetch_creators(results)
      annotations = fetch_annotations(results)
      [text_sections, creators, annotations]
    end

    def fetch_text_sections(results)
      text_section_ids = collect_association_ids(results, "text_section_id")
      scope = TextSection.where(id: text_section_ids).includes(text: :project)
      scope.each_with_object({}) do |ts, memo|
        memo[ts.id] = ts
        memo
      end
    end

    def fetch_creators(results)
      creator_ids = collect_association_ids(results, "creator_id")
      User.where(id: creator_ids).each_with_object({}) do |c, memo|
        memo[c.id] = c
        memo
      end
    end

    def fetch_annotations(results)
      annotation_ids = results.each_with_object([]) do |result, memo|
        memo.push result[:_id] if result[:_type] == "annotation"
        memo
      end
      Annotation.where(id: annotation_ids).each_with_object({}) do |a, memo|
        memo[a.id] = a
        memo
      end
    end

    def collect_association_ids(_results, id_field)
      @searchkick_results.hits.map { |r| r["_source"][id_field] }.uniq
    end

  end
end
