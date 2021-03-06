var commentIDX = 0;

function initComment(id = null) {
    var jsonreq = new XMLHttpRequest();
    jsonreq.onreadystatechange = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            displayComments(this.responseText, id);
        }
        if (this.readyState == XMLHttpRequest.DONE && this.status == 404) {
            alert("error occured in loading image json");
        }
    };
    jsonreq.open('GET', 'image-data.json', true);
    jsonreq.send();

    //Close big picture
    $(document).click(function(e) {
        var el = e.srcElement || e.target;
        if (el.id == "pic_img") {

        } else {
            $("#cover").fadeOut();
            $("#modelDiv").fadeOut();
        }
    });
    $('#back-button').click(function(e) {
        loadPage('post-page.html', initPost);
    });
}


function displayComments(jsonInfo, id) {
    var imgData = JSON.parse(jsonInfo);
    if (id) {
        $.each(imgData, function(index, value) {
            if (value.id == id) {
                commentIDX = index;
            }
        });
    }
    if (imgData[commentIDX].title) {
        $("#title-for-comment").html(imgData[commentIDX].title);
    }
    if (imgData[commentIDX].creator) {
        $("#author-comment").html(imgData[commentIDX].creator);
    }
    if (imgData[commentIDX].goodRating) {
        $("#good_count").html(imgData[commentIDX].goodRating);
    } else {
        $("#good_count").html(0);
    }
    if (imgData[commentIDX].badRating) {
        $("#bad_count").html(imgData[commentIDX].badRating);
    } else {
        $("#bad_count").html(0);
    }
    $("#pic_img").attr('src', imgData[commentIDX].data);
    $("#pic_img").attr('data-title', imgData[commentIDX].title)
    $("#pic_img").attr('data-creator', imgData[commentIDX].creator)

    $("#big_pic_img").attr('src', imgData[commentIDX].data);

    var comments = imgData[commentIDX].comments;
    var commetHtml = "";
    $.each(comments, function(index, value) {
        commetHtml += value + "<br/><br/>"
    })
    $("#TextArea").html(commetHtml);
}


//Additional comments
function comment() {
    var lasttext = $("#TextArea").html();
    var name = $("#commentator").val();
    var txt = $("#txt_pl").val();
    lasttext += name + ": " + txt + '<br/><br>';

    var comment = {
        "newcomment": name + ": " + txt,
        "idx": commentIDX
    };
    var counterForTxt = 0;
    var counterForName = 0;
    for (var i = 0; i < name.length; i++) {
        if (name[i] == ' ') {
            counterForName++;
        }
    }
    for (var i = 0; i < txt.length; i++) {
        if (txt[i] == ' ') {
            counterForTxt++;
        }
    }
    if (counterForName == name.length || counterForTxt == txt.length) {
        alert(" One Of The Required Fields Does Not Have A Valid Input");
    } else {

        if (name == "" || txt == "") {
            alert(" One Of The Required Fields Does Not Have An Input ");
        } else {
            console.log(" We Made It Here ");
            var postreq = new XMLHttpRequest();
            postreq.onreadystatechange = function() {
                if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {}
                if (this.readyState == XMLHttpRequest.DONE && this.status == 404) {
                    alert("error occured in comment image");
                }
            };
            postreq.open('POST', 'comment', true);
            postreq.setRequestHeader('Content-Type', 'application/json');
            postreq.send(JSON.stringify(comment));

            $("#TextArea").html(lasttext);
        }
    }

}

//Good or bad evaluation
function Good(check) {
    var srctype = $("#good_img").attr("src");
    if (srctype.indexOf("good.png") > -1) {
        check = false;
        var badCount = $("#bad_count").text();
        var goodCount = $("#good_count").text();

        if ($("#bad_img").attr('src') == 'Images/bad_orang.png') {
            badCount--;
            $("#bad_count").text(badCount);
        }
        $("#good_img").attr("src", "Images/good_orang.png");
        $("#bad_img").attr("src", "Images/bad.png");
        goodCount++;
        $("#good_count").text(goodCount);

        SendAjax(goodCount, badCount, "error occured in good image");
    } else {
        check = true;
        $("#good_img").attr("src", "Images/good.png");

        var badCount = $("#bad_count").text();
        var goodCount = $("#good_count").text();
        goodCount--;
        $("#good_count").text(goodCount);
        SendAjax(goodCount, badCount, "error occured in cancel good image");
    }

}

////Good or bad evaluation
function Bad(check) {
    var srctype = $("#bad_img").attr("src");
    if (srctype.indexOf("bad.png") > -1) {
        check = false;
        var goodCount = $("#good_count").text();
        var badCount = $("#bad_count").text();
        console.log("==GoodCount", goodCount, "==BadCount", badCount);

        if ($("#good_img").attr('src') == 'Images/good_orang.png') {
            goodCount--;
            $("#good_count").text(goodCount);
        }
        $("#bad_img").attr("src", "Images/bad_orang.png");
        $("#good_img").attr("src", "Images/good.png");

        badCount++;
        $("#bad_count").text(badCount);

        SendAjax(goodCount, badCount, "error occured in bad image");
    } else {
        check = true;
        $("#bad_img").attr("src", "Images/bad.png");
        var goodCount = $("#good_count").text();
        var badCount = $("#bad_count").text();

        badCount--;
        $("#bad_count").text(badCount);

    }
    SendAjax(goodCount, badCount, "error occured in cancel bad image");
}

function SendAjax(goodCount, badCount) {
    var CommentCount = {
        "goodCount": goodCount,
        "badCount": badCount,
        "idx": commentIDX
    };
    var postreq = new XMLHttpRequest();
    postreq.open('POST', 'CommentCount', true);
    postreq.setRequestHeader('Content-Type', 'application/json');
    postreq.send(JSON.stringify(CommentCount));
}

//View larger image
function showBigPic() {
    $("#cover").fadeIn();
    $("#modelDiv").fadeIn();
}
