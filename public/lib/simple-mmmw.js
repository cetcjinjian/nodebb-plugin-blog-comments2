(function() {
    "use strict";

    function loadScript(url, callback){
        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState && callback){  //IE
            script.onreadystatechange = function(){
                if (script.readyState == "loaded" ||
                        script.readyState == "complete"){
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else if (callback) {  //Others
            script.onload = function(){
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    function loadCSS(url) {
        var stylesheet = document.createElement("link");
        stylesheet.setAttribute("rel", "stylesheet");
        stylesheet.setAttribute("type", "text/css");
        stylesheet.setAttribute("href", url);
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
    }

    var nbb = {};
    var scriptDiv = document.getElementById('nodebb-comments-script');
    var articleEl = document.getElementsByClassName('markdown-body')[0];
    nbb.url = scriptDiv.getAttribute('ourl');
    nbb.cid = scriptDiv.getAttribute('ocid');
    nbb.blogger = scriptDiv.getAttribute('blogger');
    nbb.articlePath = location.href;

    if (!articleEl) {
        console.warn("It's not the article page");
        return;
    }

    nbb.articleID = location.hash.replace('#','');

    // get title and content from the article
    nbb.articleTitle = document.title.split(' - ')[0];
    var articleContent = [];
    var pagraphs = articleEl.getElementsByTagName('p');
    for (var j = 0; j < pagraphs.length; j++) {
        // only get the first and second paragraph.
        if (j ===0 || j===1){
            articleContent.push(pagraphs[j].innerText);
        }
    }
    nbb.articleContent = articleContent.join('\n\n');

    if (!nbb.url || !nbb.cid || !nbb.articleID || !nbb.blogger || !nbb.articleContent) {
        console.warn('[nodebb-plugin-blog-comments2] information is imcomplete.', nbb);
        return;
    } else {
        console.log('[nodebb-plugin-blog-comments2] information: ', nbb);
    }

    loadCSS(nbb.url + '/plugins/nodebb-plugin-blog-comments2/css/comments.css');

    // mmmw's blog doesn't have jQuery, can't fix youtube embed video right now.

    var commentPositionDiv = document.getElementById('nodebb-comments');
    if (!commentPositionDiv) {
        commentPositionDiv = document.createElement('div');
        commentPositionDiv.setAttribute('id', 'nodebb-comments');
        var respondEl = document.getElementById("post");
        if (!respondEl) {
            console.log('Couldnot find the respond section!');
            return;
        }
        respondEl.appendChild(commentPositionDiv);
    }

    loadScript(nbb.url + '/plugins/nodebb-plugin-blog-comments2/lib/common.js', function () {
        blogComments2Common(commentPositionDiv, nbb);
    });

}());
