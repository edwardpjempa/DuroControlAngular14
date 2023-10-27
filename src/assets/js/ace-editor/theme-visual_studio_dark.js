define("ace/theme/visual_studio_dark",["require","exports","module","ace/lib/dom"], function(require, exports, module) {
    "use strict";
    
    exports.isDark = false;
    exports.cssText = ".ace-visual_studio_dark .ace_gutter {\
    background: #1E1E1E;\
    border-right: 1px solid #FFFFFF40;\
    color: #FFFFFF40;\
    }\
    .ace-visual_studio_dark .ace_print-margin {\
    width: 1px;\
    background: #ebebeb;\
    }\
    .ace-visual_studio_dark {\
    background-color: #1E1E1E;\
    color: #DCDCDC;\
    }\
    .ace-visual_studio_dark .ace_fold {\
    background-color: rgb(60, 76, 114);\
    }\
    .ace-visual_studio_dark .ace_cursor {\
    color: #DCDCDC;\
    }\
    .ace-visual_studio_dark .ace_storage,\
    .ace-visual_studio_dark .ace_keyword,\
    .ace-visual_studio_dark .ace_variable {\
    color: #569CD6;\
    }\
    .ace-visual_studio_dark .ace_constant.ace_buildin {\
    color: #569CD6;\
    }\
    .ace-visual_studio_dark .ace_constant.ace_library {\
    color: #B5CEA8;\
    }\
    .ace-visual_studio_dark .ace_function {\
    color: #DCDCDC;\
    }\
    .ace-visual_studio_dark .ace_string {\
    color: #D69D85;\
    }\
    .ace-visual_studio_dark .ace_comment {\
    color: #608B4E;\
    }\
    .ace-visual_studio_dark .ace_comment.ace_doc {\
    color: #608B4E;\
    }\
    .ace-visual_studio_dark .ace_comment.ace_doc.ace_tag {\
    color: #608B4E;\
    }\
    .ace-visual_studio_dark .ace_constant.ace_numeric {\
    color: #B5CEA8;\
    }\
    .ace-visual_studio_dark .ace_tag {\
    color: rgb(25, 118, 116);\
    }\
    .ace-visual_studio_dark .ace_support.ace_constant,\
    .ace-visual_studio_dark .ace_support.ace_class,\
    .ace-visual_studio_dark .ace_support.ace_type {\
    font-style: italic;\
    color: #66D9EF\
    }\
    .ace-visual_studio_dark .ace_xml-pe {\
    color: rgb(104, 104, 91);\
    }\
    .ace-visual_studio_dark .ace_marker-layer .ace_selection {\
    background: #264F78;\
    }\
    .ace-visual_studio_dark .ace_marker-layer .ace_bracket {\
    margin: -1px 0 0 -1px;\
    border: 1px solid rgb(192, 192, 192);\
    }\
    .ace-visual_studio_dark .ace_meta.ace_tag {\
    color:rgb(25, 118, 116);\
    }\
    .ace-visual_studio_dark .ace_invisible {\
    color: #ddd;\
    }\
    .ace-visual_studio_dark .ace_entity.ace_other.ace_attribute-name {\
    color:rgb(127, 0, 127);\
    }\
    .ace-visual_studio_dark .ace_marker-layer .ace_step {\
    background: rgb(255, 255, 0);\
    }\
    .ace-visual_studio_dark .ace_active-line {\
    background-color : #1E1E1E;\
    border-top: 1px solid #FFFFFF40;\
    border-bottom: 1px solid #FFFFFF40;\
    }\
    .ace-visual_studio_dark .ace_gutter-active-line {\
    background-color : #1E1E1E;\
    }\
    .ace-visual_studio_dark .ace_marker-layer .ace_selected-word {\
    border: 1px solid #FFFFFF40;\
    }\
    .ace-visual_studio_dark .ace_indent-guide {\
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y\
    }";
    
    exports.cssClass = "ace-visual_studio_dark";
    
    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
    });                (function() {
                        window.require(["ace/theme/visual_studio_dark"], function(m) {
                            if (typeof module == "object" && typeof exports == "object" && module) {
                                module.exports = m;
                            }
                        });
                    })();
                