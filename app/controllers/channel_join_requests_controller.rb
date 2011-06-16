class ChannelJoinRequestsController < Direct

  def index
    results = current_user.managed_channels.map{|channel| channel.channel_join_requests }.flatten
    respond_with({:success => true, :data => results})
  end

  def update
    req = current_user.managed_channels.map(&:channel_join_requests).flatten.detect{|i| i.id.to_s == params[:id]}

    if req
      if ["accept","reject"].include?(params[:status])
        req.send params[:status]
      end
    end

    respond_with({:success => req.present?, :data => req})

  end

  def authenticate_user!(force = false)
      warden.authenticate!(:scope => :user) if !devise_controller? || force
  end

end
