$('#imgInp').change(function(){
    if (this.files.length > 0) {
        //Get selected file information
        var file = this.files[0];
        //Store the file data encoded as a data URL in the result property of reader
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            $('#showimg').attr('src', reader.result);
        }
    }
});

// Read the apigw url from the config.json file
var apiURL;
// fetch("config.json")
//     .then(Response => Response.json())
//     .then(data => {
//         apiURL = data.apigw_url;
//     });
apiURL = "https://5l4se5o1tl.execute-api.ap-southeast-2.amazonaws.com/prod/";

// 
$('#uploadForm').on('submit', function(e) {
    e.preventDefault();
    console.log("apiURL: ", apiURL);
    var filesSelected = document.getElementById("imgInp").files[0];
    var reader = new FileReader();
    reader.readAsDataURL(filesSelected);
    reader.onload = function(e){
        var imgData = reader.result;
        $.ajax($(this).attr('action'), {
            type: 'post',
            url: apiURL,  
            processData: false,
            contentType: false,
            data: imgData,
            // success: document.getElementById('compUpload').innerHTML = 'Processing' //When the transmission is successful
        }).done(function(data, textStatus, jqJHR){
            console.log(data);
            console.log(textStatus);
            console.log(jqJHR);

            // document.getElementById('compUpload').innerHTML = 'Processing Finished'

            if(data.status == 'Fail-Img'){
                $("#ahh").text("TestHahaha Please select a valid image to upload first.");
                $("#ahh").removeAttr("hidden");
            }
            else if(data.status == 'Fail-Endpoint'){
                $("#ahh").text("Unable to reach ML Endpoint. Please try again later.");
                $("#ahh").removeAttr("hidden");
            }
            else{
                console.log('Success!');
                $("#title").attr("hidden", true);
                $("#ahh").attr("hidden", true);
                $('#result').text(data.name);
                if(data.name === "Pothole Detected"){
                    $('#result').css({"color" : '#008000'});
                }
                else{
                    $('#result').css({"color" : '#e63946'});
                }
                // $('#confidence').text("Confidence: " + data.confidence);
                $("#picture").attr("src", "data:image/*;base64," + data.img);
                $("#picture").removeAttr("hidden");
                document.getElementById('space').remove();
                $("#upload-title").text("Upload Another?");
                // $("#showimg").attr("hidden", true)
            }            
        }).fail(function(data) {
                console.log('error!'); //When an error occurs
                $("#ahh").removeAttr("hidden");
                $("#picture").attr("hidden", true);
                $('#result').attr("Unable to upload");
            });
            // return false;
    }  
});