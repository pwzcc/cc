new Vue({
    el: '#app',
    data: {
        
        loadingComplet:false,    
        currentWarData:null,    
        startingWarData:null,
        currentStartTime:null,
        recentCount:3,
        countCurrent:true,
        wars:null,
        sortingMode:'1',
        warCount:null,

        
    },

    mounted() {
        var dt = new Date();
        this.timeZoneOffset = dt.getTimezoneOffset(); 

        API.currentWar((warlog) => {
            console.log('current war', warlog)


            
            if (typeof warlog != 'string' && 'startTime' in warlog){
                this.currentWarData = warlog
                // console.log('warlog', warlog)
                this.currentStartTime = warlog['startTime'].split('.')[0]

                DB.syncData(warlog, `warlogs/${this.currentStartTime}`, ()=>{
                    console.log('data saved')

                })
            }

        })

        DB.getData("warlogs", (wars) => {
            this.wars = wars
            this.loadingComplet = true

            if (!this.currentWarData){
                let times = Object.keys(this.wars)

                this.currentWarData = this.wars[times[times.length-1]]
                this.startingWarData = this.recentWars[0]

            }

            console.log('this.wars', this.wars)

            console.log('recentWarMemberInfo', this.recentWarMemberInfo())
        })

        

    },




    methods: {
        handleSortChange:function (value){
            this.sortingMode = value
            console.log('this.sortingMode', this.sortingMode)

        },

        recentWarMemberInfo: function(){
            let memberInfo = {}

            this.recentWars.forEach(war => {
                let tempInfo = this.warMemberInfo(war)
                Object.keys(tempInfo).forEach((tag) => {
                    let info = tempInfo[tag]
                    if (!(tag in memberInfo)){
                        memberInfo[tag] = info
                        memberInfo[tag]['count'] = 1
                    }
                    else{
                        memberInfo[tag]['count'] = memberInfo[tag]['count'] + 1
                        Object.keys(info).forEach((key) => {
                            let val = info[key]

                            if (key =='stars' || key == 'attack_count' || key == 'avePercentage')
                                memberInfo[tag][key] = memberInfo[tag][key] + val
                            
                            if (key == 'th_level')
                                memberInfo[tag][key] = val

                        })


                    }

                })


            })
            

            Object.keys(memberInfo).forEach(tag => {
                if(memberInfo[tag]['attack_count']>0){
                    memberInfo[tag]['averageStar'] = memberInfo[tag]['stars'] / memberInfo[tag]['attack_count']
                    memberInfo[tag]['avePercentage'] = memberInfo[tag]['avePercentage'] / memberInfo[tag]['count']
                    memberInfo[tag]['aveAttack'] = memberInfo[tag]['attack_count'] / memberInfo[tag]['count']
                }
                else{
                    memberInfo[tag]['averageStar'] = 0
                    memberInfo[tag]['avePercentage'] = 0       
                    memberInfo[tag]['aveAttack'] = 0
                }           


            })

            let memberLst = []

            Object.keys(memberInfo).forEach(tag => {
                let member = memberInfo[tag]
                member['tag'] = tag

                memberLst.push(member)

            })
            
            if (this.sortingMode == '1')
                memberLst.sort((a, b) => (a.stars < b.stars) ? 1 : -1)
            if (this.sortingMode == '2')
                memberLst.sort((a, b) => (a.averageStar < b.averageStar) ? 1 : -1)
            if (this.sortingMode == '3')
                memberLst.sort((a, b) => (a.attack_count < b.attack_count) ? 1 : -1)
            if (this.sortingMode == '4')
                memberLst.sort((a, b) => (a.aveAttack < b.aveAttack) ? 1 : -1)
            if (this.sortingMode == '5')
                memberLst.sort((a, b) => (a.avePercentage < b.avePercentage) ? 1 : -1)





            return memberLst
            
        },

        warMemberInfo: function(war){
            let members = war.clan.members

            let memberInfo = {}

            members.forEach(member => {
                let tag = member.tag
                let name = member.name
                let thlevel = member.townhallLevel

                memberInfo[tag] = {
                    'name': name,
                    'th_level': thlevel,
                    'stars': this.memberStars(member),
                    'attack_count': this.memberAttackCount(member),
                    'avePercentage': this.memberAvePercentage(member)
                }
            })

            return memberInfo

            console.log('memberInfo', memberInfo)

        },

        memberAttackCount: function(member) {
            if (!member.attacks){
                return 0
            }
            else return member.attacks.length

        },

        memberStars: function(member){
            if (!member.attacks){
                return 0
            }
            else{
                let stars = 0

                member.attacks.forEach(attack => {
                    stars += attack.stars
                })
                return stars
            }
        },

        memberAvePercentage: function(member){
            if (!member.attacks){
                return 0
            }
            else{
                let count = 0

                member.attacks.forEach(attack => {
                    count += attack.destructionPercentage
                })
                return count/member.attacks.length
            }
        },


        formatSeconds: function (s) {
            return new Date(s * 1000).toISOString().substr(14, 5);
        },

        changeTimezone: function(date, ianatz) {

            // suppose the date is 12:00 UTC
            var invdate = new Date(date.toLocaleString('en-US', {
              timeZone: ianatz
            }));
          
            // then invdate will be 07:00 in Toronto
            // and the diff is 5 hours
            var diff = date.getTime() - invdate.getTime();
          
            // so 12:00 in Toronto is 17:00 UTC
            return new Date(date.getTime() + diff);
          
        },
          
        toLocalTime: function(s) {
            let year = s.substr(0, 4);
            let month = s.substr(4, 2);
            let day = s.substr(6, 2);
            let hour = s.substr(9, 2);
            let min = s.substr(11, 2);
            let sec = s.substr(13, 2);

            var mydate = new Date(year, month-1, day, hour, min)

            let dateSecs = mydate.getTime()
            
            var localDate = new Date(dateSecs-this.timeZoneOffset*60*1000)
            return this.formatDate(localDate)
        },

        formatDate: function(date) {

            return date.getFullYear() + '/' + 
                (date.getMonth() + 1) + '/' + 
                date.getDate() + ' ' + 
                date.getHours() + ':' + 
                date.getMinutes();
        },

        handleChangeMode(value) {
            this.filterOptions.mode = value
            this.battleDisplayCount = 10
            d3.select('.battle-data').style('display','none')  
            d3.select('.battle-data').style('height','0px')
        },
        handleChangeMap(value) {
            this.filterOptions.map = value
            this.battleDisplayCount = 10
            d3.select('.battle-data').style('display','none')  
            d3.select('.battle-data').style('height','0px')
        },

        loadMoreBattles: function(){
            this.battleDisplayCount = this.battleDisplayCount + 10
        },

        loadComplete: function(){
            if(this.filteredBattles)
            return this.battleDisplayCount >= this.filteredBattles.length
            else
            return true
        }
    },

    computed:{
        recentWars: function() {
            warList = Object.values(this.wars)
            let warCount = warList.length

            let out = null

            if (this.countCurrent){
                out =  warList.slice(warCount-(this.recentCount+1)+1, warCount)
                this.warCount = warCount
            }
            else{
                out =  warList.slice(warCount-(this.recentCount+1), warCount-1)
                this.warCount = warCount-1
            }
            this.startingWarData = out[0]

            return out

        },



        displayBattles(){

            if(this.loadComplete()) return this.filteredBattles

            else return this.filteredBattles.slice(0, this.battleDisplayCount)
        },

        filteredBattles(){
            let {mode,map,brawler} = this.filterOptions

            if (this.battles && this.battles.length){

                let out =  this.battles.filter(b => {
                    return mode.length?  b.battle.mode == mode : true
                })

                out =  out.filter(b => {
                    return map.length?  b.event.map == map : true
                })

                out =  out.filter(b => {
                    if(this.getBattleBrawler(b)){
                        return brawler.length?  this.getBattleBrawler(b).name == brawler : true
                    }

                    return true
                })

                return out
    
            }

            return this.battles

        },


        brawlers() {
            let out = []
            let battles = this.filteredBattles

            if(battles && battles.length){
                battles.forEach(b => {

                    if(this.getBattleBrawler(b)){
                        let thisB = this.getBattleBrawler(b).name

                        if(out.indexOf(thisB)==-1)
                        out.push(thisB)
                    }


                })
            }
            return out.sort()
        },

        modes() {
            let out = []
            let battles = this.filteredBattles
            if(battles && battles.length){
                battles.forEach(b => {
                    let thisB = b.battle.mode
    
                    if(out.indexOf(thisB)==-1)
                    out.push(thisB)
                })
            }

            return out.sort()
        },

        maps() {
            let out = []
            let battles = this.filteredBattles

            if(battles && battles.length){
                battles.forEach(b => {
                let thisB = b.event.map

                if(out.indexOf(thisB)==-1)
                    out.push(thisB)
                })
            }
            return out.sort()
        },

        trophyHistory() {
            let out = [...this.pastTrophyHistory]

            out = out.map(item => {
                let dt = new Date(item.date)
                item.date = dt.getTime()
                return item
            })

            let latest = this.profileHistory.map(p => {
                return {
                    date:parseInt(p.time),
                    trophies:p.trophies
                }
            })

            out.push(...latest)

            out = out.map(item => {
                let dt = new Date(item.date)
                let ele = {}
                ele.date = dt
                ele.value = item.trophies
                return ele
            })

            return out
        },

        vizStatData() {
            if(this.chosenVizStat == 'trophies'){
                return this.trophyHistory
            }
            else{

                let out = this.profileHistory.map(p => {
                    let dt = new Date(parseInt(p.time))

                    return {
                        date:dt,
                        value:p[this.chosenVizStat]
                    }
                })
        
                return out
            }
        },

        allBrawlers(){
            let lastProfile = this.profileHistory[this.profileHistory.length-1]

            let lst = lastProfile.brawlers

            lst.sort((a, b) => (a.trophies < b.trophies) ? 1 : -1)

            return lst
        },

        brawlersHistory(){

            // console.log('this.profileHistory',this.profileHistory)
            let lst = this.profileHistory.map(item => {
                return {
                    date:item.time,
                    brawlers:item.brawlers,
                }
            })

            let brawlerNames = this.allBrawlers.map(b => b.name)

            let out = {}

            brawlerNames.forEach(brawler => {

                let history = lst.map(data => {
                    let chosen = data.brawlers.filter(b => b.name == brawler)[0]
                    if(chosen)
                    return {
                        date:data.date,
                        value: Math.floor(chosen[this.brawlersChosenVizStat])
                    }
                })

                history = history.filter(i => i)

                out[brawler] = history

            })

            return out



        }






    }

    


  })