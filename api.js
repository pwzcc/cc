
var API = API || {}

API.currentWar = function(cb){
    // var url='http://ec2-18-221-120-150.us-east-2.compute.amazonaws.com:8000/py';
    // var url = 'https://exuberant-paperback.glitch.me/ccwar';
    var url = 'http://localhost:8000/py'

    $.ajax({
        url: url,
        type: 'GET',
        contentType: 'application/json',
    
        success: function (result) {
            if(cb){
                if (typeof result == 'string')
                    cb(JSON.parse(result))
                else
                    cb(result)
            }
            

        },
        error: function (error) {
            console.log('error',error)
    
        }
     });    
}


API.player = function(playerTag,cb){
    var url='https://exuberant-paperback.glitch.me/player/';

    $.ajax({
        url: url+playerTag,
        type: 'GET',
        contentType: 'application/json',
    
        success: function (result) {
            if(cb) cb(JSON.parse(result))
        },
        error: function (error) {
            console.log('error',error)
    
        }
     });
}

API.playerBattles = function(playerTag,cb){
    var url='https://exuberant-paperback.glitch.me/playerBattles/';

    $.ajax({
        url: url+playerTag,
        type: 'GET',
        contentType: 'application/json',
    
        success: function (result) {
            if(cb) cb(JSON.parse(result))
        },
        error: function (error) {
            console.log('error',error)
    
        }
     });
}

API.queryList = function(lst,cb){
    var timeStamp = (Date.now().toString())

    lst.forEach(playerTag => {
        API.player(playerTag,(res) => {

            let saveTime = timeStamp.substring(0,6)+"9999999"
            DB.syncData(res,'/'+playerTag+'/profile/'+saveTime,() => {
    
                API.playerBattles(playerTag,(res) => {

                    // save the latest battle data
                    res.items.forEach(item => {
                        let d = {
                            event:item.event,
                            battle:item.battle
                        }
                        let battleTime = item.battleTime.split('.')[0]
                        DB.syncData(d,'/'+playerTag+'/battles/'+battleTime,() => {
                            if(cb) cb
                        })
                    })
    
                })
            })
        })
    
    })
}

