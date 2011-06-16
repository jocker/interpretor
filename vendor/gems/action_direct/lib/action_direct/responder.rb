class ActionDirect::Responder


  def initialize(controller, response)
    @controller = controller
    @request = controller.env["DIRECT_REQUEST"] || OpenStruct.new({:tid => -1, :type => "undefined"})


    @response = if response.is_a?(Hash)
                  response.to_options.tap{|hash| hash[:data] = response unless hash.has_key?(:data) || hash.has_key?(:children) }
                else
                  {:data => response}
                end.reverse_merge({:success => true, :errors => [], :message => ""})

  end

  def as_json
    @response.merge({:tid => @request.tid, :type => @request.type})
  end

  def to_s
    ActiveSupport::JSON.encode(as_json)
  end

end
