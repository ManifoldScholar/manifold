require_relative 'base_types'

module Errors
  def Errors.token
    Type.object({
      errors: Type.array( type: Type.string )
    })
  end

  def Errors.trace
    Type.array(
      type: Type.object({
        id: Type.integer,
        trace: Type.string
      })
    )
  end

  def Errors.not_found
    Type.object({
      status: Type.integer,
      error: Type.string,
      exception: Type.string,
      traces: Type.object({
        "Application Trace": Errors.trace,
        "Framework Trace": Errors.trace,
        "Full Trace": Errors.trace
      })
    })
  end
end
