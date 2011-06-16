class ActionDirect::Request

  REQUEST_KEY = "action_dispatch.request.request_parameters"
  FORM_KEY = "rack.request.form_hash"

  DIRECT_REQUEST_PARAMETERS = ["action", "method", "verb", "tid", "type"]
  DIRECT_FORM_PARAMETERS = ["extAction", "extMethod", "extVerb", "extTID", "extType"]


  ROUTE_MAP = Rails.application.routes.routes.each_with_object( Hash.new{|hash, key| hash[key] = []} ) do |route, hash|
    hash[route.defaults[:controller]] << OpenStruct.new({
                                                            :action => route.defaults[:action],
                                                            :path => route.path.gsub("(.:format)",""),
                                                            :verb => route.verb
                                                        }) unless route.defaults[:controller].blank?
  end

  attr_reader :controller, :action, :verb, :tid, :type, :path

  def initialize(namespace, env, params)
    @env = env
    @namespace = namespace
    @params = params

    extract_parameters
    prepare_env

  end

  def form_request?
    !!@env[FORM_KEY]
  end

  def params
    @params ||= ( form_request? ? @env[FORM_KEY] : @env[REQUEST_KEY] )
  end


  def valid?
    @route.present? && @path.present?
  end




  private

  def extract_parameters
    @controller, @action, @verb, @tid, @type =
        (form_request? ? DIRECT_FORM_PARAMETERS : DIRECT_REQUEST_PARAMETERS).map{|key| params.delete(key) }

    controller_with_namespace = [@controller].tap{|arr| arr.unshift(@namespace) unless @namespace.blank? }.join("/")

    @route = ROUTE_MAP[controller_with_namespace].find{|route| route.action == @action && route.verb == @verb }

    if params[:data]  && params[:data].is_a?(Hash)
      params.merge!(params.delete(:data))
    end


    @path = if @route
              is_match = true
              path = @route.path.gsub(/(:[a-zA-Z_]+)/) do |match|
                param_value = params.delete( match[1..-1] )
                is_match = false unless param_value
                param_value
              end
              is_match ? path : nil
            else
              nil
            end


  end

  def prepare_env
    @env["DIRECT_REQUEST"] = self
    if valid?
      mime = Mime::Type.lookup("application/direct")
      @env["PATH_INFO"] = @env["REQUEST_URI"] = @path
      @env["REQUEST_METHOD"] = @verb
      @env["CONTENT_TYPE"] = mime.to_s
      @env["action_dispatch.request.content_type"] = mime
      @env["action_dispatch.request.formats"] = [mime]
      @env[ form_request? ? FORM_KEY : REQUEST_KEY ] = params

    end



  end

end
