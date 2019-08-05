function load_dialog(){
    $(".title-back").each(function () {
        var title_back_width = $(this).prev().outerWidth() + 30;
        $(this).css("width", title_back_width);
    });
    $(".row-header > .header").each(function () {
        var divWidth = $(this).outerWidth();
        divWidth = $(this).closest("div").innerWidth() - divWidth;
        $(this).prev().css("width",divWidth/2 - 10);
        $(this).next().css("width",divWidth/2 - 10);
        $(this).css("left", (divWidth)/2 );
    });
}
function init_windowSize() {
    if($(window).width() < 575.98){
    }else {
        var contentWidth = $(document).innerWidth() - 250;
        var contentMargin = 0.0862 * contentWidth - 63.9655;
        $(".info-card").css({
            "margin-right": contentMargin,
            "margin-left": contentMargin
        });
        $(".content").css({
            "width": contentWidth,
            "height": "90%"
        });
        $(".side-bar").css("height", "100%");
    }
}
function loading() {
    $(".main").addClass("blur-div");
    var canvas = $("#loading-canvas");
    canvas.drawArc({
        strokeStyle: '#000',
        strokeWidth: 4,
        rounded: true,
        endArrow: true,
        arrowRadius: 15,
        arrowAngle: 90,
        x: 160, y: 120,
        start: 90,
        end: 360,
        radius: 50
    });
}
function blur_div_toggle(content) {
    if($(content).hasClass("blur-div")) {
        $(content).removeClass("blur-div");
    }else {
        $(content).addClass("blur-div");
    }
}
function init_dialog_btn(element, dialogClass) {
    $(element).click(function (){
        blur_div_toggle(".main");
        $(dialogClass).css("display","block");
        close_dialog(dialogClass);
        dialog_comment_init();
        load_dialog();
        // $(".project-info-innerDiv").height($(".project-info-content").outerHeight());
        if( dialogClass === ".showProject"){
            accept_project();
        }
    });
}
function input_focus(){
    if( $("input,textarea").prop("disabled") ) {
        $(this).each(function () {
            var inputLabel = "label[for='"+$(this).attr("id")+"']";
            $(inputLabel).css({
                "font-size":"13px",
                "top":"0px",
                "right":"15px",
                "color":"#8d8d8d"
            });
        });
    }
    $("input,textarea").on("focus", function () {
        if($(this).hasClass("solid-label"))
            return false;
        var inputLabel = "label[for='"+$(this).attr("id")+"']";
        $(inputLabel).css({
            "font-size":"13px",
            "top":"0px",
            "right":"15px",
            "color":"#3CCD1C"
        });
        $(this).css("color","#3ccd1c");
    }).on("focusout", function () {
        if($(this).hasClass("solid-label"))
            return false;
        var inputLabel = "label[for='"+$(this).attr("id")+"']";
        $(inputLabel).css("color","#6f7285");
        if($(this).val() === ''){
            $(inputLabel).css({
                "font-size":"14px",
                "top":"28px",
                "right":"25px",
                "color":"#6f7285"
            });
        }else {
            $(this).css("color","#8d8d8d");
            $(inputLabel).css("color","#8d8d8d");
        }
    });
}
function cancel_add(className){
    div = "<span class='initial-value' style='border: 1px dashed #bdbdbd;width: fit-content;border-radius: 0.25em;padding: 5px 10px;font-size: 13px;font-weight: 300;'>برای افزودن سابقه جدید روی <i class='fas fa-plus'></i>  کلیک کنید!  </span>";
    $(".refuse-btn").click(function () {
        $(className+ " div#" + $(this).attr("id")).remove();
        alert($(className).val());
        if($(className).val() === '') {
            $(className).append(div);
        }
    });
}
function accept_project(){
    $(".accept-btn").click(function () {
        $(".showProject").slideUp('slow').delay('slow');
        $(".project-details").delay('slow').slideDown('slow');
        close_dialog(".project-details");
        vote_dialog_init();
        load_dialog();
    });
}
function close_dialog(className){
    $(".close").click(function (){
        $(className).css("display","none");
        $(".main").removeClass("blur-div");
    });
}
function education_record() {
    $(".education-btn > i.fa-plus").click(function (){
        div = document.createElement("div");
        $(div).addClass('card').addClass('ch-card-item');
        $(div).attr("id",edu_count);
        $(div).html("<form action='' method='post'><div class='row'>" +
            "<div class='col-lg-6'>" +
              "<label for=\"edu-section"+edu_count+"\">مقطع تحصیلی</label>\n" +
              "<input type=\"text\" id=\"edu-section"+edu_count+"\" class=\"w-100\">" +
            "</div>" +
            "<div class='col-lg-6'>" +
              "<label for=\"edu-subject"+edu_count+"\">رشته تحصیلی</label>\n" +
              "<input type=\"text\" id=\"edu-subject"+edu_count+"\" class=\"w-100\">" +
            "</div>" +
            "</div>"+
            "</div>" +
            "<div class='row'>" +
            "<div class='col-lg-5'>" +
              "<label for=\"university"+edu_count+"\">دانشگاه</label>\n" +
              "<input type=\"text\" id=\"university"+edu_count+"\" class=\"w-100\">" +
            "</div>" +
            "<div class='col-lg-4'>" +
              "<label for=\"edu-city"+edu_count+"\">شهر محل تحصیل</label>\n" +
              "<input type=\"text\" id=\"edu-city"+edu_count+"\" class=\"w-100\">" +
            "</div>" +
            "<div class='col-lg-3'>" +
              "<label for=\"edu-year"+edu_count+"\">سال اخذ مدرک</label>\n" +
              "<input type=\"text\" id=\"edu-year"+edu_count+"\" class=\"w-100\">" +
            "</div>" +
            "</div>" +
            "<div class='row mtop-lg-25'>" +
                "<div class='col-lg-9'>" +
                    "<button type='button' id='"+edu_count+"' class='w-100 accept-btn btn'>افزودن</button>" +
                "</div>"+
                "<div class='col-lg-3'>" +
                    "<button type='button' id='"+edu_count+"' class='w-100 refuse-btn btn'>لغو</button>" +
                "</div>" +
            "</div></form>");
        if($(".education > .initial-value").hasClass("initial-value")) {
            $(".education").html(div);
        }else {
            $('.education').append(div);
        }
        cancel_add(".education");
        add_education_record(edu_count);
        input_focus();
        edu_count ++;
      });
}
function add_education_record(edu_count) {
    div = "<span class='initial-value' style='border: 1px dashed #bdbdbd;width: fit-content;border-radius: 0.25em;padding: 5px 10px;font-size: 13px;font-weight: 300;'>برای افزودن سابقه جدید روی <i class='fas fa-plus'></i>  کلیک کنید!  </span>";
    $(".education .accept-btn").click(function () {
        row = "<tr>" +
                    "<td>" + $("#edu-section" + edu_count).val() + "</td>" +
                    "<td>" + $("#edu-subject" + edu_count).val() + "</td>" +
                    "<td>" + $("#university" + edu_count).val() + "</td>" +
                    "<td>" + $("#edu-city" + edu_count).val() + "</td>" +
                    "<td>" + $("#edu-year" + edu_count).val() + "</td>" +
                    "<td>" +
                        "<i class='fas fa-pen'></i>" +
                        "<i class='fas fa-trash-alt'></i>" +
                    "</td>" +
                "</tr>";
        if(! $(".education > table").hasClass("table")) {
            table = "<table class='table mtop-lg-25'>" +
                    "<thead>" +
                        "<tr>" +
                            "<td>مقطع تحصیلی</td>" +
                            "<td>رشته تحصیلی</td>" +
                            "<td>دانشگاه</td>" +
                            "<td>شهر محل تحصیل</td>" +
                            "<td>سال اخذ مدرک</td>" +
                            "<td></td>" +
                        "</tr>" +
                    "</thead>" +
                    "<tbody>" +
                    "</tbody>" +
                "</table>";
            $(".education").html(table);
        }
        $(".education > table > tbody").append(row);
        $(".education div#" + $(this).attr("id")).remove();
    });
}
function executive_record() {
    $(".executive-btn > i.fa-plus").click(function () {
        div = document.createElement("div");
        $(div).addClass('card').addClass('ch-card-item');
        $(div).attr("id",exe_count);
        $(div).html("<form action='' method='post'><div class='row'>" +
              "<div class='col-lg-5'>" +
                "<label for='duty"+ exe_count +"'>سمت</label>" +
                "<input type='text' id='duty"+ exe_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-1'>" +
                "<span class='center-vr'>زمان :</span>" +
              "</div>" +
              "<div class='col-lg-3'>" +
                "<label for='from"+ exe_count +"'>از تاریخ</label>" +
                "<input type='text' id='from"+ exe_count +"' class='w-100'>" +
              "</div>" +
              "<div class='col-lg-3'>" +
                "<label for='until"+ exe_count +"'>تا تاریخ</label>" +
                "<input type='text' id='until"+ exe_count +"' class='w-100'>" +
              "</div>" +
            "</div>"+
            "<div class='row'>" +
              "<div class='col-lg-5'>" +
                "<label for='workplace"+ exe_count +"'>محل خدمت</label>" +
                "<input type='text' id='workplace"+ exe_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-4'>" +
                "<label for='exe-city"+ exe_count +"'>شهر</label>" +
                "<input type='text' id='exe-city"+ exe_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-3'></div>" +
            "</div>" +
            "<div class='row mtop-lg-25'>" +
                "<div class='col-lg-9'>" +
                    "<button type='button' id='"+exe_count+"' class='w-100 accept-btn btn'>افزودن</button>" +
                "</div>"+
                "<div class='col-lg-3'>" +
                    "<button type='button' id='"+exe_count+"' class='w-100 refuse-btn btn'>لغو</button>" +
                "</div>" +
            "</div></form>");
        if($(".executive > .initial-value").hasClass("initial-value")){
            $(".executive").html(div);
        }else {
            $('.executive').append(div);
        }
        cancel_add(".executive");
        input_focus();
        $("#from"+ exe_count).persianDatepicker({

        });
        $("#until"+ exe_count).persianDatepicker({

        });
        exe_count ++;
      });
}
function studious_record() {
    $(".studious-btn > i.fa-plus").click(function () {
        div = document.createElement("div");
        $(div).addClass('card').addClass('ch-card-item');
        $(div).attr("id",stu_count);
        $(div).html("<form action='' method='post'><div class='row'>" +
              "<div class='col-lg-5'>" +
                "<label for='subject"+ stu_count +"'>عنوان طرح پژوهشی</label>" +
                "<input type='text' id='subject"+ stu_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-3'>" +
                "<label for='admin"+ stu_count +"'>نام مجری</label>" +
                "<input type='text' id='admin"+ stu_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-4'>" +
                "<label for='liable"+ stu_count +"'>مسئول اجرا/همکار</label>" +
                "<input type='text' id='liable"+ stu_count +"' class='w-100'>" +
              "</div>"+
            "</div>"+
            "<div class='row'>" +
              "<div class='col-lg-7 rankDiv'>" +
                "<label class='rankLabel' for='rank' style='width:245px'>وضعیت طرح پژوهشی</label>" +
                "<select id='rank'>" +
                  "<option selected dir='rtl'>انتخاب کنید ...</option>" +
                  "<option value='1'>در دست  اجرا</option>" +
                  "<option value='2'>خاتمه یافته</option>" +
                  "<option value='3'>متوقف</option>" +
                "</select>" +
              "</div>"+
              "<div class='col-lg-5'></div>" +
            "</div>" +
            "<div class='row mtop-lg-25'>" +
                "<div class='col-lg-9'>" +
                    "<button type='button' id='"+stu_count+"' class='w-100 accept-btn btn'>افزودن</button>" +
                "</div>"+
                "<div class='col-lg-3'>" +
                    "<button type='button' id='"+stu_count+"' class='w-100 refuse-btn btn'>لغو</button>" +
                "</div>" +
            "</div></form>");
        if($(".studious > .initial-value").hasClass("initial-value")){
            $(".studious").html(div);
        }else {
            $('.studious').append(div);
        }
        cancel_add(".studious");
        input_focus();
        stu_count ++;
      });
}
function article_record() {
    $(".article-btn > i.fa-plus").click(function () {
        div = document.createElement("div");
        $(div).addClass('card').addClass('ch-card-item');
        $(div).attr("id",art_count);
        $(div).html("<form action='' method='post'><div class='row'>" +
              "<div class='col-lg-4'>" +
                "<label for='article-name"+ art_count +"'>عنوان مقاله</label>" +
                "<input type='text' id='article-name"+ art_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-4'>" +
                "<label for='publish-date"+ art_count +"'>تاریخ انتشار</label>" +
                "<input type='text' id='publish-date"+ art_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-4'>" +
                "<label for='published-at"+ art_count +"'>محل دقیق انتشار</label>" +
                "<input type='text' id='published-at"+ art_count +"' class='w-100'>" +
              "</div>"+
            "</div>" +
            "<div class='row'>" +
              "<div class='col-lg-5'>" +
                "<label for='impact-factor"+ art_count +"'>Impact Factor</label>" +
                "<input type='text' id='impact-factor"+ art_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-4'>" +
                "<label for='referring-num"+ art_count +"'>تعداد ارجاع به مقاله شما</label>" +
                "<input type='text' id='referring-num"+ art_count +"' class='w-100'>" +
              "</div>"+
              "<div class='col-lg-3'></div>" +
            "</div>" +
            "<div class='row mtop-lg-25'>" +
                "<div class='col-lg-9'>" +
                    "<button type='button' id='"+art_count+"' class='w-100 accept-btn btn'>افزودن</button>" +
                "</div>"+
                "<div class='col-lg-3'>" +
                    "<button type='button' id='"+art_count+"' class='w-100 refuse-btn btn'>لغو</button>" +
                "</div>" +
            "</div></form>");
        if($(".article > .initial-value").hasClass("initial-value")){
            $(".article").html(div);
        }else {
            $('.article').append(div);
        }
        cancel_add(".article");
        input_focus();
        art_count ++;
      });
}

function dialog_comment_init() {
    // add emoji to comment
    $(".new-comment-tools > .fa-smile").click(function() {
        alert("Not working");
        // $('#comment').emojiPicker('toggle');
        // alert("a");
    });
    // delete user comment
    $(".comment-tools > .fa-trash-alt").click(function () {
        $(this).parents("div.my-comment").remove();
    });
    // attach file to comment
    $(".new-comment-tools > label[for='comment-attach']").click(function () {
        rows = $("textarea#comment").attr("rows");
        $("textarea#comment").attr("rows", ++rows);
        padding_bottom = parseInt($("textarea#comment").css("padding-bottom")) + 30;
        $("textarea#comment").css("padding-bottom", padding_bottom);

        if($("div.attachment > div").last().hasClass("attach")){
            bottom_position = parseInt($("div.attachment > div").last().css("bottom"));
        }else {
            bottom_position = 10;
        }

        $("div.attachment").append("<div class='attach'>" +
            "<span>" + "نام فایل" + "</span>" +
            "<div class='progress'>" +
                "<div class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='75' aria-valuemin='0' aria-valuemax='100' style='width: 75%'></div>" +
            "</div>" +
        "</div>");
        $("div.attachment > div").last().css("bottom", bottom_position + 30);
    });
    // replay to a comment
    $(".comment-tools > .fa-reply").click(function () {
        var text = $.trim($(this).closest("div").children(2).text());
        $("textarea#comment").closest("div").append("<div class='replay-div'></div>");
        $(".replay-div").html("<i class='fa fa-reply fa-lg'></i>" + text + "<i class='fa fa-times'></i>");
        $(".replay-div > .fa-times").click(function () {
           $(".replay-div").remove();
           $("textarea#comment").css("padding-top","2px").focus().on("focusout", function () {
                var inputLabel = "label[for='"+$(this).attr("id")+"']";
                $(inputLabel).css("color","#6f7285");
                if($(this).val() === ''){
                    $(inputLabel).css({
                        "font-size":"14px",
                        "top":"28px",
                        "right":"25px",
                        "color":"#6f7285"
                    });
                }else {
                    $(this).css("color","#8d8d8d");
                    $(inputLabel).css("color","#8d8d8d");
                }
            });
        });
        $("textarea#comment").css("padding-top","35px").focus().on("focusout", function () {
            var inputLabel = "label[for='"+$(this).attr("id")+"']";
            $(inputLabel).css("color","#6f7285");
            if($(this).val() === ''){
                $(inputLabel).css({
                    "font-size":"14px",
                    "top":"58px",
                    "right":"25px",
                    "color":"#6f7285"
                });
            }else {
                $(this).css("color","#8d8d8d");
                $(inputLabel).css("color","#8d8d8d");
            }
        });
    });
    // edit user comment
    $(".comment-tools > .fa-pen").click(function () {
        text = $.trim($(this).closest("div").children(2).text());
        $("textarea#comment").html(text);
        $("textarea#comment").focus();
    });
}
function vote_slider_industry(slide_count) {
    industry_counter = 0;
    $(".industry-voting .next-button").click(function () {
        alert("industry_counter = " + industry_counter);
        if( industry_counter < slide_count - 1) {
            industry_counter ++;
            progressWidth = parseInt($(".industry-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".industry-voting .progress-line").css('width'));
            $(".industry-voting .progress-line").css('width', width + progressWidth);
            $(".industry-voting .swiper-wrapper").css({
                "transform" : "translate3d(-" + 100 * industry_counter +"%, 0, 0)",
                "transition-duration" : "0.3s"
            });
        }
        if( industry_counter === slide_count - 1) {
            $(this).html("<i class='fas fa-check'></i>" +
                "ثبت");
        }
        if(industry_counter > 0) {
            $(".industry-voting .prev-button").removeClass("disabled");
        }
    });
    $(".industry-voting .prev-button").click(function () {
        alert("industry_counter = " + industry_counter);
        if(industry_counter > 0) {
            industry_counter --;
            progressWidth = parseInt($(".industry-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".industry-voting .progress-line").css('width'));
            $(".industry-voting .progress-line").css('width', width - progressWidth);
            $(".industry-voting .swiper-wrapper").css({
                "transform" : "translate3d(-" + 100 * industry_counter +"%, 0, 0)",
                "transition-duration" : "0.3s"
            });
        }
        if( industry_counter === slide_count - 2) {
            $(".industry-voting .next-button").html("<i class='fas fa-arrow-right'></i>" +
                "بعدی");
        }
        if(industry_counter === 0) {
            $(this).addClass('disabled');
        }
    });
}
function vote_slider_researcher(slide_count) {
    researcher_counter = 0;
    $(".researcher-voting .next-button").click(function () {
        alert("researcher_counter = " + researcher_counter);
        if (researcher_counter < slide_count - 1) {
            researcher_counter++;
            progressWidth = parseInt($(".researcher-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".researcher-voting .progress-line").css('width'));
            $(".researcher-voting .progress-line").css('width', width + progressWidth);
            $(".researcher-voting .swiper-wrapper").css({
                "transform": "translate3d(-" + 100 * researcher_counter + "%, 0, 0)",
                "transition-duration": "0.3s"
            });
        }
        if (researcher_counter === slide_count - 1) {
            $(this).html("<i class='fas fa-check'></i>" +
                "ثبت");
        }
        if (researcher_counter > 0) {
            $(".researcher-voting .prev-button").removeClass("disabled");
        }
    });
    $(".researcher-voting .prev-button").click(function () {
        alert("researcher_counter = " + researcher_counter);
        if (researcher_counter > 0) {
            researcher_counter--;
            progressWidth = parseInt($(".researcher-voting .vote-list > .vote-item").css('width'));
            width = parseFloat($(".researcher-voting .progress-line").css('width'));
            $(".researcher-voting .progress-line").css('width', width - progressWidth);
            $(".researcher-voting .swiper-wrapper").css({
                "transform": "translate3d(-" + 100 * researcher_counter + "%, 0, 0)",
                "transition-duration": "0.3s"
            });
        }
        if (researcher_counter === slide_count - 2) {
            $(".researcher-voting .next-button").html("<i class='fas fa-arrow-right'></i>" +
                "بعدی");
        }
        if (researcher_counter === 0) {
            $(this).addClass('disabled');
        }
    });
}
function vote_dialog_init() {
    flag = 0;
    $(".vote-question").hover(function () {
        $(this).parent('.col-lg-12').children('.vote-question-text').slideDown().css({
            "color": "#3ccd1c",
            "border-color":"#3ccd1c"
        });
    }, function () {
        if(!$(this).parent('.col-lg-12').children('.vote-question-text').hasClass('fix')) {
            $(this).parent('.col-lg-12').children('.vote-question-text').slideUp();
        } else {
            $(this).parent('.col-lg-12').children('.vote-question-text').css({
                "color": "#707070",
                "border-color":"#707070"
            })
        }
    }).click(function () {
        $(this).parent('.col-lg-12').children('.vote-question-text').toggleClass('fix');
    });
    $(".vote").click(function () {
        if($('.vote-dialog').css('display') === 'none') {
            $('.vote-dialog').slideDown();
            $('.vote > .dots').addClass('expand');
        }else{
            $('.vote-dialog').slideUp();
            $('.vote > .dots').removeClass('expand');
        }
    });
    $(".vote-dialog > .industry-back").hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    }).click(function () {
        $(".project-details").slideUp('slow').delay('slow');
        $(".industry-voting").delay('slow').slideDown('slow');
        close_dialog('.industry-voting');
        vote_slider_industry(12);
        $(".progress-line").css("width","calc(100% / 12)");
    });
    $(".vote-dialog > .researcher-back").hover(function () {
        $(this).addClass('hover');
    }, function () {
        $(this).removeClass('hover');
    }).click(function () {
        $(".project-details").slideUp('slow').delay('slow');
        $(".researcher-voting").delay('delay').slideDown('slow');
        close_dialog('.researcher-voting');
        vote_slider_researcher(10);
        $(".progress-line").css("width","calc(100% / 10)");
    });
}