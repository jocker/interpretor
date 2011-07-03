class ChannelMessagesController < Direct

  def index
    channel_id = params[:id].present? ? params[:id] : current_user.group.channel.id
    respond_with({:success => true, :data => ChannelMessage.where(:created_at.gt => 1.day.ago, :channel_id => channel_id ).where().order([:created_at, :asc]) })
  end

  def create
    channel = Channel.find(params[:channel_id]) rescue current_user.group.channel
    message = channel.channel_messages.create(:sender => current_user.email, :content => params[:content].to_s.gsub("\n","<br />"))
    respond_with({:suceess => true, :data => message})
  end

end
