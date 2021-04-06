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

    include ActiveSupport::Inflector

    MODEL_INCLUDES = {
      "text_section" => { text: { project: :makers } },
      "project" => [:makers],
      "resource" => [:project],
      "collection" => [:project],
      "annotation" => { text_section: { text: :project } }
    }.freeze

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
                   :options, :blank?, :empty?

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

    # @note Introspection methods, used in tests
    def has_matched_model?(model)
      adjusted_results.any? do |result|
        result[:model] == model
      end
    end

    # @note Introspection methods, used in tests
    def missing_model?(model)
      adjusted_results.none? do |result|
        result[:model] == model
      end
    end

    private

    def inject_associations(searchkick_results)
      models = execute query_plan_for models_in searchkick_results
      hydrate_results searchkick_results, models
    end

    def hydrate_results(results, models)
      results.each do |result|
        hydrate_model! result, models
      end
      results
    end

    def hydrate_model!(result, models)
      type, id = result_model_reference(result)
      result.model = models[type][id] if models.key? type
    end

    def class_for(type)
      return User if type == "creator"

      constantize classify pluralize type
    end

    def execute(query_plan)
      query_plan.each_with_object({}) do |(type_of, ids), models|
        klass = class_for type_of
        next models unless klass

        scope = klass.where(id: ids).includes(MODEL_INCLUDES[type_of])
        models[type_of] = scope.each_with_object({}) do |ts, memo|
          memo[ts.id] = ts
          memo
        end
      end
    end

    def query_plan_for(models)
      models.each_with_object({}) do |type_id, plan|
        type, id = type_id
        plan[type] = [] unless plan.key? type
        plan[type] << id unless plan[type].include? id
      end
    end

    def result_model_reference(result)
      [
        result.dig("_source", "search_result_type") || result.dig("search_result_type"),
        result.dig("_id")
      ]
    end

    def models_in(results)
      results.hits.each_with_object([]) do |result, models|
        models << result_model_reference(result)
      end
    end

  end
end
