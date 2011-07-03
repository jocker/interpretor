class ChannelsController < Direct

  def index
    respond_with({:success => true, :data => Channel.order_by([:subscribers_count, :desc]).limit(10) })
  end

  def available
    respond_with(:success => true, :data => (Channel.all - current_user.channels - current_user.pending_channels) )
  end

  def subscribed
    respond_with(:success => true, :data => current_user.channels )
  end

  def pending
    respond_with(:success => true, :data => current_user.pending_channels )
  end

  def subscribe
    channel = Channel.find(params[:id]) rescue nil
    if channel
      current_user.send_channel_join_request(channel)
    end

    respond_with(:success => true, :data => {})
  end

end
