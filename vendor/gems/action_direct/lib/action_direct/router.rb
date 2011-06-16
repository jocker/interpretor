class ActionDirect::Router
  def initialize(app)
    @app = app
  end

  def call(env)

    if match?(env)
      output = []

      params_key = "action_dispatch.request.request_parameters"

      if env[params_key]

        parse_generic_request(env[params_key]).each do |params|
          request_env = env.dup
          ::ActionDirect::Request.new(@namespace, request_env, params)
          response = @app.call(request_env)[2]
          response = response.respond_to?(:body) ? response.body : "{'success':'false'}"

          output << response
        end
      else
        #form submit

        req = env["rack.request.form_hash"]

        env["RACK_REQUEST_DIRECT"] = "RACK_REQUEST_DIRECT"


        env[params_key] = req


        status, headers, response = @app.call(env)
        output << response.body rescue "{'success':'false'}"

      end


      res = output.join(',')
#[404, {'X-Cascade' => 'pass'}, []]
      res = "[" + res + "]" if output.length > 1

      [200, {"Content-Type" => "text/html"}, [res]]
    else
      @app.call(env)
    end

  end

  def parse_generic_request(data)
    (data["_json"]) ? data["_json"] : [data]
  end

  def match?(env)
    config = ActionDirect::Config.endpoints.find{|hash| env["PATH_INFO"].match("^"+hash[:path])  }

    config = ActionDirect::Config.endpoints.find do |item|
      item if env["PATH_INFO"].match("^" + item[:path]) && (config[:requirements].blank? || config[:requirements].call(env) != false)
    end || {}

    @router_path, @namespace = config[:path], config[:namespace]

    config.present?

  end


end

