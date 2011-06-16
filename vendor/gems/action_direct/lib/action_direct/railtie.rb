require 'rails/railtie'

class ActionDirect::Railtie < Rails::Railtie

  initializer "extjs_direct_middleware" do |app|
    app.config.middleware.insert_after Warden::Manager,  ActionDirect::Router

    Mime::Type.register "application/direct", :direct

    ActionController::Renderers.add  :direct do |object, options|

      object = (object.size == 1 ? object.first : object)

      self.content_type = Mime::HTML
      self.response_body  = ActiveSupport::JSON.encode ::ActionDirect::Responder.new(self, object).as_json

    end


    class ActionController::Responder
      def to_direct
        controller.render({:direct => resources}, options)
      end
    end


    class ActionDispatch::Request
      def direct?
        env.has_key?("DIRECT_REQUEST")
      end
    end


  end

end



