class ApplicationJob < ActiveJob::Base
  def match_result(result)
    Dry::Matcher::ResultMatcher.(result, &Proc.new)
  end

  def match_result_on_failure(result)
    match_result(result) do |m|
      m.success do
        # This block intentionally left blank
      end

      m.failure(&Proc.new)
    end
  end
end
