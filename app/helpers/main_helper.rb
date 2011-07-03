module MainHelper

  def app_init
    begin
      if user_signed_in?
        "Crs.app.App.setUserInfo(#{current_user.admin_settings.to_json});Crs.app.App.goToHome();"
      else
        "Crs.app.App.goToLogin()"
      end
    rescue
      "Crs.app.App.goToLogin()"
    end

  end

end
