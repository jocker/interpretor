class Routing::JavascriptLoader
  include Singleton

  class << self
    delegate :call, :to => "instance"
  end


  protected
  def call(env)
    env["action_dispatch.request.path_parameters"][:path].to_s

    path = File.join(Rails.root,"vendor","javascripts", env["action_dispatch.request.path_parameters"][:path].to_s.underscore )+".js"

    if File.exists?(path)
      [200, {}, [File.read(path)]]
    else
      [404, {}, ["not found"]]
    end

  end


end
