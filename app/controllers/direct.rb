class Direct < ActionController::Base
  abstract!

  before_filter :authenticate_user!

  class << self
    def inherited(child)
      super(child)
      child.respond_to :direct
    end
  end


  EXCLUDED_MODULES = [
      AbstractController::Layouts,
      AbstractController::AssetPaths,
      :Helpers,
      :UrlFor,
      :Redirecting,
      :ConditionalGet,
      :Caching,
      :ImplicitRender,
      :Cookies,
      :Flash,
      :Streaming,
      :RecordIdentifier
  ]

  ACCEPTED_FORMATS = [:xml, :json, :direct]

  ActionController::Base.without_modules(EXCLUDED_MODULES).each do |m|
    include m
  end

  ActiveSupport.run_load_hooks(:action_controller, self)



  include Devise::Controllers::Helpers

  protected



  def current_user?
    user_signed_in?
  end

  def current_group
    @current_group ||= current_user.group
  end

  private

  def request_data
    @request_data ||= begin
      data = if request.direct?
               params.has_key?(:data) ? params[:data] : params
             else
               params.has_key?(:_json) ? params[:_json] : params
             end
      data.is_a?(Array) ? data : [data]
    end
  end



end

