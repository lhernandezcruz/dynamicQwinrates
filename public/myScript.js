var region = "na";
var amount = 2;
$(document).ready(function () {
    var highestBox = 0;
        $('.btn-group-justified .btn').each(function(){  
                if($(this).height() > highestBox){  
                highestBox = $(this).height();  
        }
    });    
    $('.btn-group-justified .btn').height(highestBox);
    

    $("#frm1").on("submit", function (e) {
        e.preventDefault();
        
        console.log("clicked");
        var data = {};
        for (var i = 1; i<=amount; i++){
            data["name" + i] = $('[name="name' +i+ '"]').val();
        }
        data.region= region;
        data.amount = amount;
        console.log(data);
        $(".info").hide();
        $("#waitingText").show();
        $()
        //$("body").html(waitingText);
        $.ajax({
            url: '/getIds'
            , type: "POST"
            , dataType: "json"
            , data: JSON.stringify(data)
            , contentType: "application/json"
            , timeout: 300000
            , complete: function () {
                //called when complete
                console.log('process complete');
            },

            success: function (data) {
                $("#waitingText").hide();
                $(".info").show();
                
                console.log(data);
                
                $("#winrates").append("<div class='panel panel-primary'> <div class='panel-heading'> Summoners: " + data.sumNames.join(", ")+ "</div><div class='panel-body'> Winrate: "+ data.winRate+ "%<br> Games Played Together: "+ data.gamesPlayed+ "</div> </div>");
                //console.log(data);
                //console.log('process sucess');
            },

            error: function (err) {
                console.log(err);
                $("#waitingText").hide();
                $("#errorP").html("<h1>Something Went Wrong...Oops.. pls reload page");
                console.log('process error');
            }
        , });

    });

    $(".amount").on("click", function (e) {
        // update amount & search bars
        e.preventDefault();
        if (amount != this.id) {
            var changeBy = this.id - amount;
            if (changeBy > 0){
                while (changeBy > 0){
                    $("<input name='name" + (amount+1) + "' type='text' class='form-control' placeholder='Summoner Name " + (amount+1) +"'>" ).insertAfter('[name="name' + amount + '"]');
                    
                    changeBy --;
                    amount ++;
                }
            }else{
                while(changeBy < 0){
                    $('[name="name' + amount + '"]').remove();
                    changeBy ++;
                    amount --;
                }
                
            }

            
        }

    });

    $(".region").on("click", function (e) {
        //e.preventDefault();
        region = this.id;
        console.log(region);
    });

    

});