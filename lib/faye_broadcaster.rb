require "net/http"
module FayeBroadcaster
  ENDPOINT = "http://faye.interpretor.ro:9292/faye"


  def broadcast(*args)
    data = args.extract_options!
    name = args.shift
    args = (["", id]+args).map(&:to_s)
    deliver_message(File.join(args),data.merge({:command => name}))
  end

  private

  def deliver_message(channel, data=nil)
    message = {:channel => channel, :data => data}
    uri = URI.parse(ENDPOINT)
    Net::HTTP.post_form(uri, :message => message.to_json)
  end
end