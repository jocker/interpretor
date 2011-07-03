class SessionsController < Direct
  #prepend_before_filter :require_no_authentication, :only => [ :new, :create ]
  skip_before_filter :authenticate_user!
  include Devise::Controllers::InternalHelpers

  respond_to :direct, :json, :xml

  # POST /resource/sign_in
  def create

    warden.logout

    params[:user]["subdomain"] = request.subdomain
    success = current_user?

    catch(:warden) do
      resource = warden.authenticate!(:scope => resource_name)
      sign_in(resource_name, resource)
      success = true
    end #if !success

    response = {success: success}
    response.merge!(current_user.admin_settings) if success

    render :json => response


  end

  # GET /resource/sign_out
  def destroy
    sign_out(resource_name)
    render :json => {:success => true}
  end
end
