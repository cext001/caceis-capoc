(function(e){var t=!1,i=!1,n={isUrl:function(e){var t=RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$","i");return t.test(e)?!0:!1},loadContent:function(e,t){e.html(t)},addPrefix:function(e){var t=e.attr("id"),i=e.attr("class");"string"==typeof t&&""!==t&&e.attr("id",t.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-id-$1")),"string"==typeof i&&""!==i&&"sidr-inner"!==i&&e.attr("class",i.replace(/([A-Za-z0-9_.\-]+)/g,"sidr-class-$1")),e.removeAttr("style")},execute:function(n,s,a){"function"==typeof s?(a=s,s="sidr"):s||(s="sidr");var r,d,l,c=e("#"+s),u=e(c.data("body")),f=e("html"),p=c.outerWidth(!0),g=c.data("speed"),h=c.data("side"),m=c.data("displace"),v=c.data("onOpen"),y=c.data("onClose"),x="sidr"===s?"sidr-open":"sidr-open "+s+"-open";if("open"===n||"toggle"===n&&!c.is(":visible")){if(c.is(":visible")||t)return;if(i!==!1)return o.close(i,function(){o.open(s)}),void 0;t=!0,"left"===h?(r={left:p+"px"},d={left:"0px"}):(r={right:p+"px"},d={right:"0px"}),u.is("body")&&(l=f.scrollTop(),f.css("overflow-x","hidden").scrollTop(l)),m?u.addClass("sidr-animating").css({width:u.width(),position:"absolute"}).animate(r,g,function(){e(this).addClass(x)}):setTimeout(function(){e(this).addClass(x)},g),c.css("display","block").animate(d,g,function(){t=!1,i=s,"function"==typeof a&&a(s),u.removeClass("sidr-animating")}),v()}else{if(!c.is(":visible")||t)return;t=!0,"left"===h?(r={left:0},d={left:"-"+p+"px"}):(r={right:0},d={right:"-"+p+"px"}),u.is("body")&&(l=f.scrollTop(),f.removeAttr("style").scrollTop(l)),u.addClass("sidr-animating").animate(r,g).removeClass(x),c.animate(d,g,function(){c.removeAttr("style").hide(),u.removeAttr("style"),e("html").removeAttr("style"),t=!1,i=!1,"function"==typeof a&&a(s),u.removeClass("sidr-animating")}),y()}}},o={open:function(e,t){n.execute("open",e,t)},close:function(e,t){n.execute("close",e,t)},toggle:function(e,t){n.execute("toggle",e,t)},toogle:function(e,t){n.execute("toggle",e,t)}};e.sidr=function(t){return o[t]?o[t].apply(this,Array.prototype.slice.call(arguments,1)):"function"!=typeof t&&"string"!=typeof t&&t?(e.error("Method "+t+" does not exist on jQuery.sidr"),void 0):o.toggle.apply(this,arguments)},e.fn.sidr=function(t){var i=e.extend({name:"sidr",speed:200,side:"left",source:null,renaming:!0,body:"body",displace:!0,onOpen:function(){},onClose:function(){}},t),s=i.name,a=e("#"+s);if(0===a.length&&(a=e("<div />").attr("id",s).appendTo(e("body"))),a.addClass("sidr").addClass(i.side).data({speed:i.speed,side:i.side,body:i.body,displace:i.displace,onOpen:i.onOpen,onClose:i.onClose}),"function"==typeof i.source){var r=i.source(s);n.loadContent(a,r)}else if("string"==typeof i.source&&n.isUrl(i.source))e.get(i.source,function(e){n.loadContent(a,e)});else if("string"==typeof i.source){var d="",l=i.source.split(",");if(e.each(l,function(t,i){d+='<div class="sidr-inner">'+e(i).html()+"</div>"}),i.renaming){var c=e("<div />").html(d);c.find("*").each(function(t,i){var o=e(i);n.addPrefix(o)}),d=c.html()}n.loadContent(a,d)}else null!==i.source&&e.error("Invalid Sidr Source");return this.each(function(){var t=e(this),i=t.data("sidr");i||(t.data("sidr",s),"ontouchstart"in document.documentElement?(t.bind("touchstart",function(e){e.originalEvent.touches[0],this.touched=e.timeStamp}),t.bind("touchend",function(e){var t=Math.abs(e.timeStamp-this.touched);200>t&&(e.preventDefault(),o.toggle(s))})):t.click(function(e){e.preventDefault(),o.toggle(s)}))})}})(jQuery);jQuery(function(){jQuery('#responsive-menu-button').sidr({name:'sidr-main',source:'#nav_main, #menu_top, #top-search,.cart, #menu_lang',side:'right',displace:'false'})});jQuery(document).ready(function($){if($('.contenttable th').length){$('.contenttable th').closest('.contenttable').cardtable()}
$("#footer").prepend($("#ancre"));


$('.news-list-view .article').matchHeight();$('.news-list-view .article').matchHeight();$('html').removeClass('no-js').addClass('js');$('.page-top a').click(function(){var speed=750;$('html, body').animate({scrollTop:0},speed);return!1});$('#menu_lang ul').prepend($('#menu_lang ul li.active'));var screenwidth=$(window).width();$('#nav_main .image-section').css({'width':screenwidth+100});$('#nav_main .image-section').css('left',function(){var positionleft=$(this).parent().offset().left;return-positionleft});var markUp=["<select id='datefilter'>"],li,a;var list=$(".news-menu-view ul");$(".news-menu-view > ul > li").each(function(){var li=$(this);var subli=li.find(" li");if(subli.length==0){var a=li.find("a");if(li.hasClass('itemactive')){markUp.push("<option value='"+a.attr("href")+"' selected='selected'>"+a.text()+"</option>")}
else{markUp.push("<option value='"+a.attr("href")+"'>"+a.text()+"</option>")}}
else{markUp.push("<optgroup label='"+li.find("span").text()+"'>");subli.each(function(){var a=$(this).find("a");if($(this).hasClass('itemactive')){markUp.push("<option value='"+a.attr("href")+"' selected='selected'>"+a.text()+"</option>")}
else{markUp.push("<option value='"+a.attr("href")+"'>"+a.text()+"</option>")}});markUp.push("</optgroup>")}});markUp.push("</select>");list.replaceWith(markUp.join(''));$("#datefilter").change(function(){window.location=$(this).val()});if((sessionStorage.getItem('advertOnce')!=='true')&&($("#content_popup").length))
{$.fancybox({'content':$("#content_popup"),'autoSize':!1,'width':450,'autoScale':!1,'height':'auto'});sessionStorage.setItem('advertOnce','true')}
$('.fancybox-video').fancybox({openEffect:'none',closeEffect:'none',helpers:{media:!0},youtube:{autoplay:0,}});$('.kesearch_tools h2').click(function(){$(this).parent().toggleClass('open')});$('#kesearch_dates_from').datetimepicker({onShow:function(ct){this.setOptions({maxDate:$('#kesearch_dates_to').val()?$('#kesearch_dates_to').val():!1})},closeOnDateSelect:!0,timepicker:!1});$('#kesearch_dates_to').datetimepicker({onShow:function(ct){this.setOptions({minDate:$('#kesearch_dates_from').val()?$('#kesearch_dates_from').val():!1})},closeOnDateSelect:!0,timepicker:!1});$('.sidr ul li').click(function(){var $this=$(this);if($this.hasClass('sidr-class-actif')){$this.removeClass('sidr-class-actif')}else{$('.sidr ul li').removeClass('sidr-class-actif');$this.addClass('sidr-class-actif')}});jQuery(window).on("touchmove",function(){$('#nav_main li').trigger('mouseleave');$('#menu_top ul li').trigger('mouseleave');$('#ancre ul li').trigger('mouseleave')})});jQuery(window).scroll(positionAncre);function positionAncre(){if(jQuery(window).scrollTop()>300)
{jQuery("#ancretotop").css({"display":"block"})}
else{jQuery("#ancretotop").css({"display":"none"})}
haut_tot=jQuery(document).height();haut_foot=jQuery("#bottom_bar").height();haut_scroll=jQuery(window).scrollTop();haut_screen=jQuery(window).height();if((haut_screen+haut_scroll)>(haut_tot-haut_foot))
{}
else{jQuery("#ancretotop").css("position","fixed")}
if(jQuery(window).scrollTop()>30)
{jQuery("#header").addClass("sticky");jQuery("#top").addClass("sticky")}
else{jQuery("#header").removeClass("sticky");jQuery("#top").removeClass("sticky")}}
$(".searchbox input.searchbox-sword").on("focus",function(){$(".searchbox").addClass("keyup")});$(".searchbox input.searchbox-sword").on("focusout",function(){if(this.value.length<1){$(".searchbox").removeClass("keyup")}});$(".list-facettes input").on("click change keyup select",function(event){$(".submitbutt input").click();$(".loadingnewdiv").fadeIn()});(function($){$.fn.cardtable=function(options){var $tables=this,defaults={headIndex:0},settings=$.extend({},defaults,options),headIndex;if(options&&options.headIndex)
headIndex=options.headIndex;else headIndex=0;return $tables.each(function(){var $table=$(this);if($table.hasClass('stacktable')){return}
var table_css=$(this).prop('class');var $stacktable=$('<div></div>');if(typeof settings.myClass!=='undefined')$stacktable.addClass(settings.myClass);var markup='';var $caption,$topRow,headMarkup,bodyMarkup,tr_class;$table.addClass('stacktable large-only');$caption=$table.find("caption").clone();$topRow=$table.find('tr').eq(0);$table.find('tbody tr').each(function(){headMarkup='';bodyMarkup='';tr_class=$(this).prop('class');$(this).find('td,th').each(function(cellIndex){if($(this).html()!==''){bodyMarkup+='<tr class="'+tr_class+'">';if($topRow.find('td,th').eq(cellIndex).html()){bodyMarkup+='<td class="st-key">'+$topRow.find('td,th').eq(cellIndex).html()+'</td>'}else{bodyMarkup+='<td class="st-key"></td>'}
bodyMarkup+='<td class="st-val '+$(this).prop('class')+'">'+$(this).html()+'</td>';bodyMarkup+='</tr>'}});markup+='<table class=" '+table_css+' stacktable small-only"><tbody>'+headMarkup+bodyMarkup+'</tbody></table>'});$table.find('tfoot tr td').each(function(rowIndex,value){if($.trim($(value).text())!==''){markup+='<table class="'+table_css+' stacktable small-only"><tbody><tr><td>'+$(value).html()+'</td></tr></tbody></table>'}});$stacktable.prepend($caption);$stacktable.append($(markup));$table.before($stacktable)})};$.fn.stacktable=function(options){var $tables=this,defaults={headIndex:0},settings=$.extend({},defaults,options),headIndex;if(options&&options.headIndex)
headIndex=options.headIndex;else headIndex=0;return $tables.each(function(){var table_css=$(this).prop('class');var $stacktable=$('<table class="'+table_css+' stacktable small-only"><tbody></tbody></table>');if(typeof settings.myClass!=='undefined')$stacktable.addClass(settings.myClass);var markup='';var $table,$caption,$topRow,headMarkup,bodyMarkup,tr_class;$table=$(this);$table.addClass('stacktable large-only');$caption=$table.find("caption").clone();$topRow=$table.find('tr').eq(0);$table.find('tr').each(function(rowIndex){headMarkup='';bodyMarkup='';tr_class=$(this).prop('class');if(rowIndex===0){markup+='<tr class=" '+tr_class+' "><th class="st-head-row st-head-row-main" colspan="2">'+$(this).find('th,td').eq(headIndex).html()+'</th></tr>'}
else{$(this).find('td,th').each(function(cellIndex){if(cellIndex===headIndex){headMarkup='<tr class="'+tr_class+'"><th class="st-head-row" colspan="2">'+$(this).html()+'</th></tr>'}else{if($(this).html()!==''){bodyMarkup+='<tr class="'+tr_class+'">';if($topRow.find('td,th').eq(cellIndex).html()){bodyMarkup+='<td class="st-key">'+$topRow.find('td,th').eq(cellIndex).html()+'</td>'}else{bodyMarkup+='<td class="st-key"></td>'}
bodyMarkup+='<td class="st-val '+$(this).prop('class')+'">'+$(this).html()+'</td>';bodyMarkup+='</tr>'}}});markup+=headMarkup+bodyMarkup}});$stacktable.prepend($caption);$stacktable.append($(markup));$table.before($stacktable)})};$.fn.stackcolumns=function(options){var $tables=this,defaults={},settings=$.extend({},defaults,options);return $tables.each(function(){var $table=$(this);var num_cols=$table.find('tr').eq(0).find('td,th').length;if(num_cols<3)
return;var $stackcolumns=$('<table class="stacktable small-only"></table>');if(typeof settings.myClass!=='undefined')$stackcolumns.addClass(settings.myClass);$table.addClass('stacktable large-only');var tb=$('<tbody></tbody>');var col_i=1;while(col_i<num_cols){$table.find('tr').each(function(index){var tem=$('<tr></tr>');if(index===0)tem.addClass("st-head-row st-head-row-main");var first=$(this).find('td,th').eq(0).clone().addClass("st-key");var target=col_i;if($(this).find("*[colspan]").length){var i=0;$(this).find('td,th').each(function(){var cs=$(this).attr("colspan");if(cs){cs=parseInt(cs,10);target-=cs-1;if((i+cs)>(col_i))
target+=i+cs-col_i-1;i+=cs}
else i++;if(i>col_i)
return!1})}
var second=$(this).find('td,th').eq(target).clone().addClass("st-val").removeAttr("colspan");tem.append(first,second);tb.append(tem)});++col_i}
$stackcolumns.append($(tb));$table.before($stackcolumns)})}}(jQuery));jQuery(document).ready(function($){var accordeons=$('.tc-accordeon');if(accordeons!=undefined){accordeons.addClass('closed');accordeons.click(function(){var acc=$(this);var opening=acc.hasClass('closed')
accordeons.filter('.opened').find('.tc-accordeon-content').slideUp();accordeons.filter('.opened').removeClass('opened').addClass('closed');if(opening){acc.find('.tc-accordeon-content').slideToggle('slow');acc.removeClass('closed');acc.addClass('opened')}
else{acc.removeClass('opened');acc.addClass('closed')}})}});!function(t){"use strict";"function"==typeof define&&define.amd?define(["jquery"],t):"undefined"!=typeof module&&module.exports?module.exports=t(require("jquery")):t(jQuery)}(function(t){var e=-1,o=-1,i=function(t){return parseFloat(t)||0},a=function(e){var o=1,a=t(e),n=null,r=[];return a.each(function(){var e=t(this),a=e.offset().top-i(e.css("margin-top")),s=r.length>0?r[r.length-1]:null;null===s?r.push(e):Math.floor(Math.abs(n-a))<=o?r[r.length-1]=s.add(e):r.push(e),n=a}),r},n=function(e){var o={byRow:!0,property:"height",target:null,remove:!1};return"object"==typeof e?t.extend(o,e):("boolean"==typeof e?o.byRow=e:"remove"===e&&(o.remove=!0),o)},r=t.fn.matchHeight=function(e){var o=n(e);if(o.remove){var i=this;return this.css(o.property,""),t.each(r._groups,function(t,e){e.elements=e.elements.not(i)}),this}return this.length<=1&&!o.target?this:(r._groups.push({elements:this,options:o}),r._apply(this,o),this)};r.version="0.7.0",r._groups=[],r._throttle=80,r._maintainScroll=!1,r._beforeUpdate=null,r._afterUpdate=null,r._rows=a,r._parse=i,r._parseOptions=n,r._apply=function(e,o){var s=n(o),h=t(e),l=[h],c=t(window).scrollTop(),p=t("html").outerHeight(!0),d=h.parents().filter(":hidden");return d.each(function(){var e=t(this);e.data("style-cache",e.attr("style"))}),d.css("display","block"),s.byRow&&!s.target&&(h.each(function(){var e=t(this),o=e.css("display");"inline-block"!==o&&"flex"!==o&&"inline-flex"!==o&&(o="block"),e.data("style-cache",e.attr("style")),e.css({display:o,"padding-top":"0","padding-bottom":"0","margin-top":"0","margin-bottom":"0","border-top-width":"0","border-bottom-width":"0",height:"100px",overflow:"hidden"})}),l=a(h),h.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||"")})),t.each(l,function(e,o){var a=t(o),n=0;if(s.target)n=s.target.outerHeight(!1);else{if(s.byRow&&a.length<=1)return void a.css(s.property,"");a.each(function(){var e=t(this),o=e.attr("style"),i=e.css("display");"inline-block"!==i&&"flex"!==i&&"inline-flex"!==i&&(i="block");var a={display:i};a[s.property]="",e.css(a),e.outerHeight(!1)>n&&(n=e.outerHeight(!1)),o?e.attr("style",o):e.css("display","")})}a.each(function(){var e=t(this),o=0;s.target&&e.is(s.target)||("border-box"!==e.css("box-sizing")&&(o+=i(e.css("border-top-width"))+i(e.css("border-bottom-width")),o+=i(e.css("padding-top"))+i(e.css("padding-bottom"))),e.css(s.property,n-o+"px"))})}),d.each(function(){var e=t(this);e.attr("style",e.data("style-cache")||null)}),r._maintainScroll&&t(window).scrollTop(c/p*t("html").outerHeight(!0)),this},r._applyDataApi=function(){var e={};t("[data-match-height], [data-mh]").each(function(){var o=t(this),i=o.attr("data-mh")||o.attr("data-match-height");i in e?e[i]=e[i].add(o):e[i]=o}),t.each(e,function(){this.matchHeight(!0)})};var s=function(e){r._beforeUpdate&&r._beforeUpdate(e,r._groups),t.each(r._groups,function(){r._apply(this.elements,this.options)}),r._afterUpdate&&r._afterUpdate(e,r._groups)};r._update=function(i,a){if(a&&"resize"===a.type){var n=t(window).width();if(n===e)return;e=n}i?-1===o&&(o=setTimeout(function(){s(a),o=-1},r._throttle)):s(a)},t(r._applyDataApi),t(window).bind("load",function(t){r._update(!1,t)}),t(window).bind("resize orientationchange",function(t){r._update(!0,t)})});(function($){adaptResponsiveView=function(){var screenW=$(window).width();var screenT=$('html').data('screen');if((screenW>1024)&&(screenT!='desktop')){$('html').data('screen','desktop');slides=$('.item-slide');slides.each(function(i,el){var elem=$(el);if(elem.data('image')!==undefined){elem.css("background-image","url("+elem.data('image')+")")}});$(".tx-caceisproducts-preview h3").off("click","a",toogleAccordionProductHome);destructSubFamilyAccordion();if($(".tx-caceisproducts .family .grid-row.addtablet").length){$(".tx-caceisproducts .family .grid-row.addtablet .grid-50-50 .column-2").append($(".tx-caceisproducts .family .grid-row.addtablet .grid-50-50 .column-1 .twitter"));$(".tx-caceisproducts .family .grid-row:first .grid-70-30").append($(".tx-caceisproducts .family .grid-row.addtablet .grid-50-50 .column-2"));$(".tx-caceisproducts .family .grid-row.addtablet").remove();$(".tx-caceisproducts .family .wrapper").append($(".tx-caceisproducts .family .grid-row .tools"))}}
else if((screenW<1025)&&(screenW>767)&&(screenT!='tablet')){$('html').data('screen','tablet');slides=$('.item-slide');slides.each(function(i,el){var elem=$(el);if(elem.data('image-tablet')!==undefined){elem.css("background-image","url("+elem.data('image-tablet')+")")}});$(".tx-caceisproducts-preview h3").off("click","a",toogleAccordionProductHome);destructSubFamilyAccordion();$("<div class='grid-row clearfix row-cols2 addtablet'><div class='grid-50-50'><div class='column column-1'></div></div></div>").insertBefore(".tx-caceisproducts .family .tools");$(".tx-caceisproducts .family .grid-row .manager").parent().append($(".tx-caceisproducts .family .tools"))}
else if((screenW<768)&&(screenT!='mobile')){$('html').data('screen','mobile');slides=$('.item-slide');slides.each(function(i,el){var elem=$(el);if(elem.data('image-mobile')!==undefined){elem.css("background-image","url("+elem.data('image-mobile')+")")}});$(".tx-caceisproducts-preview h3").on("click","a",toogleAccordionProductHome);$(".products li.product-item ").on("click","h3",toogleAccordionProductsList);constructSubFamilyAccordion();if($(".tx-caceisproducts .family .grid-row.addtablet").length){$(".tx-caceisproducts .family .grid-row.addtablet .grid-50-50 .column-2").append($(".tx-caceisproducts .family .grid-row.addtablet .grid-50-50 .column-1 .twitter"));$(".tx-caceisproducts .family .grid-row:first .grid-70-30").append($(".tx-caceisproducts .family .grid-row.addtablet .grid-50-50 .column-2"));$(".tx-caceisproducts .family .grid-row.addtablet").remove();$(".tx-caceisproducts .family .wrapper").append($(".tx-caceisproducts .family .grid-row .tools"))}}};var toogleAccordionProductHome=function(e){e.preventDefault();family=$(this).closest('.family');if(family.hasClass('open')){$('.family').removeClass('open')}else{$('.family').removeClass('open');family.addClass('open')}};var toogleAccordionProductsList=function(){item=$(this).closest('.product-item');if(item.hasClass('open')){$('.product-item').removeClass('open')}else{$('.product-item').removeClass('open');item.addClass('open')}};var constructSubFamilyAccordion=function(){$('.subfamilies .subfamilies-list .subfamily').each(function(index){var el=$(this);el.appendTo('.subfamilies #menuitem-'+el.attr('id'))})};var destructSubFamilyAccordion=function(){$('.subfamilies .subfamily-menuitem .subfamily').each(function(index){var el=$(this);el.appendTo('.subfamilies-list')})}})(jQuery);var subfamilyItems=$('.subfamily-menuitem ');jQuery(document).ready(function($){adaptResponsiveView();var timer;$(window).resize(function(){if(timer)
clearTimeout(timer);timer=setTimeout(function(){adaptResponsiveView()},1000)});subfamilyItems.find('.title a').click(function(e){e.preventDefault()});subfamilyItems.find('.title').click(toggleSubFamily);subfamilyItems.find('.short-desc').click(toggleSubFamily)});var toggleSubFamily=function(){var el=$(this).closest('.subfamily-menuitem ');var isAcc=0;if($(window).width()<768){isAcc=1}
var isActif=el.hasClass('actif');var target=el.find('.title a').first().attr('rel');subfamilyItems.removeClass('actif');$('.subfamily').removeClass('opened');if((isAcc==0)||(!isActif)){el.addClass('actif');$('#'+target).addClass('opened')}
$('.product-item .description').matchHeight()};$("#header_right  ul.lvl-1 > li em").each(function(){var lien_a_prendre=$(this).nextAll('ul.lvl-2').find('li:first-child a').attr('href');$(this).wrap('<a href="'+lien_a_prendre+'" />')})
  
  
 window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

var voir_repo = mobilecheck();
if ( voir_repo ) { $("#nav_main ul.menu.lvl-1 > li > a").each(function(){   $(this).replaceWith($(this).text()); $(this).wrap("<em></em>");  }); }