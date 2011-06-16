(function(){
    Url = function(url, queryObject){
        var queryString = "", path = url
        queryObject = queryObject || {}

        if( url.indexOf("?") != -1 ){
            var parts = url.split("?")
            queryString = parts[1]
            path = parts[0]
            queryObject = {}
        }

        if(path.indexOf("/") != 0){
            path = "/"+path
        }

        if(path.match(/(.+)\/$/)){
            path = RegExp.$1
        }

        if( queryString != "" ){
            queryString.split("&").forEach(function(pairString){
                var pair = pairString.split("=")
                queryObject[ decodeURIComponent(pair[0]) ] = decodeURIComponent(pair[1])
            })
        }else{
            queryString = Object.keys(queryObject).map(function(key){
                return encodeURIComponent(key)+"="+encodeURIComponent(queryObject[key])
            }).join("&")
        }

        return{
            path: path,
            queryString: queryString,
            queryObject: queryObject,
            toString: function(){
                return ( queryString != "" ? path+"?"+queryString : path )
            }
        }
    }

    var Route = function(route, options){
        options = options || {}
        var required_params = [], originalRoute = route+"", regexpObj = {}

        if( route.indexOf("/") != 0 ){
            route = "/"+route
        };

        ["controller","instance","action"].forEach(function(name){
            if(options[name]){
                regexpObj[name] = new RegExp("^"+options[name]+"$")
            }
        })


        var matchString = "^"+route.replace(/(:[a-zA-Z0-9_-]+)/gi, function(match){
            match = match.substring(1);

            ["controller","instance","action"].forEach(function(name){
                if( match == name && !regexpObj[name] ){
                    regexpObj[name] = /^([a-zA-Z0-9_-]+)$/
                }
            });

            required_params.push(match)
            return "([a-zA-Z0-9_-]+)"
        })

        regexpObj.url = new RegExp(matchString+"$")
        regexpObj.str = matchString


        return {
            matchesUrl: function(url){
                url = (new Url(url)).path
                return !!( url.match(regexpObj.url) )
            },

            matchesUrlFormat: function(params){

                var arr = ["controller","instance","action"],  l = arr.length, i=0

                for(; i<l; i++ ){
                    var name = arr[i]
                    if( !(params[name]+"").match(regexpObj[name]) ){
                        return !1
                    }
                }


                l = required_params.length

                for(i=0; i<l; i++ ){
                    var name = required_params[i]
                    if( !params[name] ){
                        return !1
                    }
                }

                return !0
            },

            parseUrl: function(url){
                url = new Url(url)

                var matches = url.path.match( regexpObj.url ), result = Ext.JSON.decode( Ext.JSON.encode( options ) ), i=0
                matches.shift()
                for(; i<matches.length; i+=1){
                    result[required_params[i]] = matches[i]
                }
                return Ext.apply(url.queryObject, result)

            },

            toUrl: function(params){

                params = Ext.apply(params || {}, options)

                var route = (originalRoute+"").replace(/(:[a-zA-Z0-9_-]+)/gi, function(match){
                    match = match.substring(1)
                    var res =  params[match]
                    delete params[match]
                    return res
                });

                ["controller","instance","action"].forEach(function(name){
                    delete params[name]
                })

                return (new Url(route, params)).toString()
            },
            regexpObj: regexpObj



        }
    }


    var Router = (function(){

        var routes = []

        return{
            map: function(callback){
                var map = function(url, options){
                    routes.push( new Route(url, options) )
                    return map
                }
                Ext.callback(callback, callback, [map])

            },

            toUrl: function(params){
                var l = routes.length, i=0
                for(; i< l;  i+=1){

                    if( routes[i].matchesUrlFormat(params) ){
                        return routes[i].toUrl(params)
                    }
                }
            },

            recognisePath: function(url){
                var l = routes.length, i=0
                for(; i< l; i+=1){
                    if( routes[i].matchesUrl(url) ){
                        return routes[i].parseUrl(url)
                    }
                }

            },

            processRequest: function(url){
                var path = this.recognisePath(url)

                if(path){
                    Fwk.info("processing request", path)
                    Fwk.routing.InstanceManager.handleRequest(path)
                }

            }

        }
    })()

    Ext.ClassManager.set("Fwk.routing.Router", Router)



})()
