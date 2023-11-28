var __read = function(iterable, count) {
    var result = [];
    var iterator = iterable[Symbol.iterator]();

    for(var i = 0;(count === undefined || i < count); i++) {
        var item = iterator.next();
        if(item.done) {
            break;
        }
        result.push(item.value);
    }
    return result;
};

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
        for (var k in mod) {
            if (Object.hasOwnProperty.call(mod, k))
                result[k] = mod[k];
        }
    }
    result["default"] = mod;
    return result;
};

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

define("index", ["react", "react-dom", "require", "exports"], function (react_1, react_dom_1, require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    react_1 = __importStar(react_1);
    react_dom_1 = __importDefault(react_dom_1);

    var GAL_BG = 'gal-bg';
    var Line = function(lineProps) {
        var str = lineProps.str;
        var defaultSpeed = lineProps.speed;
        var speed = defaultSpeed === void 0 ? 100 : defaultSpeed;
        var handleNext = lineProps.onNext;
        var onNext = handleNext === void 0 ? function() {} : handleNext;
        var skip = lineProps.skip;
        var shouldWait = lineProps.wait;
        var wait = shouldWait === void 0 ? true : shouldWait;
    
        if(skip){
            return react_1.default.createElement('span', null, str, react_1.default.createElement('br', null));
        }
        if(wait){
            return react_1.default.createElement(react_1.Fragment, null);
        }
    
        var [state, setState] = react_1.useState(0);
        var ref = react_1.useRef(0);
        var click = function() { 
            return state < str.length ? setState(str.length) : onNext(); 
        };
    
        react_1.useEffect(function() {
            if(state < str.length) {
                ref.current = setTimeout(function() { return setState(state + 1); }, speed);
            }
            var container = document.getElementById(GAL_BG);
            container.onclick = click;
            return function() {
                clearTimeout(ref.current);
                container.onclick = null;
            };
        }, [state]);
    
        return react_1.default.createElement(react_1.default.Fragment, null, str.slice(0, state));
    };

    var Lines = react_1.default.forwardRef(function(linesProps, ref) {
        var lines = linesProps.lines;
        var onNext = linesProps.onNext;
        var init = linesProps.init ?? 0;
        var speed = linesProps.speed;
        var speaker = linesProps.speak[0];
        var [state, setState] = react_1.useState(init);
    
        var nextStep = function() {
            if(state < lines.length - 1) {
                setState(state + 1);
            }
            else {
                var hasNext = onNext();
                hasNext && setState(0);
            }
        };
    
        react_1.useImperativeHandle(ref, function() {
            return({
                getLine: function() { return state; }
            });
        });
    
        return react_1.default.createElement('div', { className: "dialog-background" },
            react_1.default.createElement('div', { className: "dialog-box" },
            // react_1.default.createElement("img", { className: "character-image", src: "character.png", alt: "Character" }),
            react_1.default.createElement('div', { className: "dialog-text" },
            // react_1.default.createElement('span', { style: {fontSize: "25px"} }, speaker, react_1.default.createElement('br', null)),
            lines.map(function(line, index) {
                return react_1.default.createElement(
                    Line,
                    { key: line, skip: index < state, str: line, speed: speed, wait: state !== index, onNext: nextStep }
                );
            }),
            react_1.default.createElement('span', { className: "cursor" })),
        ));
    });

    var BG_Picture = function (bg) {
        var src = bg.src;
        return react_1.default.createElement("picture", { style: {
                backgroundImage: "url(" + src + ")",
                // opacity: 0.5,
                width: "100%",
                height: "100%",
                position: "fixed",/* absolute */
                zIndex: "-1",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: "brightness(0.6)"
            }
        });
    };

    var Char_Picture = function(charInfo) {
        var char_num = charInfo.src.length;
        var charImages = [];
    
        for(var i = 0; i < char_num; i++) {
            var findEmpty = !Boolean(charInfo.speak.indexOf(charInfo.src[i].name) === -1);
            var char_src = charInfo.src[i].imgPath;
            var imgStyle = {
                opacity: 1,
                position: "fixed",
                top: "50%",
                left: i === 0 ? "50%" : "0%",
                transform: "translate(-20%, -25%)",
                maxWidth: "70%",
                zIndex: -1,
                filter: findEmpty ? "brightness(1)" : "brightness(.5)"
            };
    
            charImages.push(
                react_1.default.createElement('img', { key: i, src: char_src, style: imgStyle })
            );
        }
        return react_1.default.createElement('div', { className: "char-img" }, charImages);
    };
    

    var CharStat = function() {
        return react_1.default.createElement('div', { className: "player-status", style: {
            position: "fixed",
            top: "10px",
            left: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            padding: "5px"
        }}, Object.keys(arr1).map(function(index) {
            var str = arr1[index].key + " : " + arr1[index].value;
            return react_1.default.createElement('span', { key: index }, str, react_1.default.createElement('br', null));
        }));
    };

    var Music = react_1.default.forwardRef(function (music, thisRef) {
        var src = music.src;
        return react_1.default.createElement("audio", { ref: thisRef, autoPlay: true, src: src });
    });

    const myArray = [];
    function addElement(element) {
      const galBgElement = element.querySelector("#gal-bg");
      if (galBgElement) {
        myArray.push(galBgElement);
        if (myArray.length > 3) {
          myArray.shift();
        }
      }
    }

    var Gal = react_1.default.forwardRef(function (screenConfig, thisRef) {
        var { pages, end, speed, initLine: initLineDefault, initPage: initPageDefault, start: galStart } = screenConfig;
        var initLine = initLineDefault === undefined ? 0 : initLineDefault;
        var initPage = initPageDefault === undefined ? 0 : initPageDefault;
    
        var [state, setState] = react_1.useState(initPage);
        var currentPage = pages[state];
        var { lines, bg, char, speaker: char_speak, music, charStat } = currentPage;
    
        var ref = react_1.useRef();
        var music_ref = react_1.useRef();
        addElement(document.getElementById('root'));

        react_1.useImperativeHandle(thisRef, function () { 
            return ({
                getLine: function () { return ref.current.getLine(); },
                getPage: function () { return state; }
            }); 
        });
        
        return react_1.default.createElement('div', { id: GAL_BG, style: { userSelect: 'none', }, onClick: function () {
                if (music_ref.current.currentTime === 0) {
                    music_ref.current.play();
                }
            } },
            bg && react_1.default.createElement(BG_Picture, { src: bg }),
            //char && react_1.default.createElement(Char_Picture, { src: char, speak: char_speak}),
            //!galStart ? react_1.default.createElement(CharStat, null) : null,
            music && react_1.default.createElement(Music, { ref: music_ref, src: music }),
            react_1.default.createElement(Lines, { speed: speed, init: initLine, ref: ref, lines: lines, speak: char_speak,
                onNext: function () {
                    var hasNext = state < pages.length - 1;
                    if (hasNext) {
                        setState(state + 1);
                    }
                    else {
                        end && end();
                    }
                    return hasNext;
                } 
            })
        );
    });
    

    const arr1 = new Array(6).fill('', 0).map(() => ({
        key: '', value: 0
    }));

    var Select = function (selectOptions) {
        var selects = selectOptions.selects;
        var onSelect = selectOptions.onSelect;

        return react_1.default.createElement("div", { className: "select-btn-container" },
            react_1.default.createElement("div", { className: "select-btn-group" },
                Object.keys(selects).map(
                    function (title, index) {
                        return react_1.default.createElement("button", { className: "select-button", key: title, 
                            onClick: function () {
                                // Object.entries(selects[title].charStat).forEach(([key], index) => {
                                //     arr1[index].key = key;
                                //     arr1[index].value += selects[title].charStat[key];
                                // });
                                return onSelect(selects[title].join); 
                            } },
                            title
                        );
                    }
                )
            )
        );
    };

    var Galgame = react_1.default.forwardRef(function (initProps, thisRef) {
        var Scenes = initProps.Scenes;
        var paras = initProps.paras;
        var selects = initProps.selects;
        var end = initProps.end;
        var initLine = initProps.initLine;
        var initPage = initProps.initPage;
        var initPara = initProps.initPara;
        var speed = initProps.speed;
        var chp = initProps.chp;

        var createSelect = function (page) {
            var newNode = react_1.default.createElement(Select, { selects: selects[page],
                onSelect: function (target) {
                    return setDisplay(react_1.default.createElement(IndexPage, { page: target }));
                }
            });

            var htmlElement = myArray[2];
            var newNode2 = function() {
                if (htmlElement && htmlElement instanceof HTMLElement) {
                    var htmlString = htmlElement.outerHTML;
                    const divWithDangerousHTML = react_1.default.createElement('div', {
                        dangerouslySetInnerHTML: { __html: htmlString }
                    });
                    return divWithDangerousHTML;
                    // return (
                    //     <div dangerouslySetInnerHTML={{ __html: htmlString }} />
                    // );
                } else {
                    return react_1.default.createElement('div');
                }
            };
    
            console.log("createSelect");
            return react_1.default.createElement(
                react_1.default.Fragment,
                {},
                newNode,
                newNode2()
            );            
        };
        
        var IndexPage = function (pageInfo) {
            var page = pageInfo.page;
            var ref = react_1.useRef();
            var gameStart = !Boolean(page === Object.keys(Scenes)[0]);

            react_1.useImperativeHandle(thisRef, function () { return ({
                getLine: function () { return ref.current.getLine(); },
                getPage: function () { return ref.current.getPage(); },
                getPara: function () { return page; }
            }); });
            
            return react_1.default.createElement(Gal, { speed: speed, initLine: initLine, initPage: initPage, ref: ref, pages: Scenes[page], start: gameStart,
                end: function () {
                    if (page in selects) {
                        setDisplay(createSelect(page));
                    }
                    else {
                        end && end();
                    }
                }}
            );
        };

        var currentPage = react_1.default.createElement(IndexPage, { page: initPara || chp });
        var [display, setDisplay] = __read(react_1.useState(currentPage), 2);
        
        return display;
    });

    var KEYS = {
        GAL_PARA: 'GAL_PARA',
        GAL_PAGE: 'GAL_PAGE',
        GAL_LINE: 'GAL_LINE',
        GAL_SPEED: 'GAL_SPEED'
    };

    var App = function (data) {
        var jsonData = data.jsonData;
        var Scenes = jsonData.Scenes;
        var selects = jsonData.selects;
        var ref = react_1.useRef();
        var chp = data.chp;

        var save = function () {
            var Para = ref.current.getPara();
            var Page = ref.current.getPage();
            var Line = ref.current.getLine();
            localStorage.setItem(KEYS.GAL_PARA, Para);
            localStorage.setItem(KEYS.GAL_PAGE, String(Page));
            localStorage.setItem(KEYS.GAL_LINE, String(Line));
        };

        var clear = function () {
            localStorage.removeItem(KEYS.GAL_PARA);
            localStorage.removeItem(KEYS.GAL_PAGE);
            localStorage.removeItem(KEYS.GAL_LINE);
        };

        return react_1.default.createElement(react_1.default.Fragment, null,
            // react_1.default.createElement("nav", { style: { position: 'fixed', bottom: '0.5rem', right: '0.5rem' } },
            // react_1.default.createElement("button", { onClick: save }, "saveeeeeee"),
            // react_1.default.createElement("button", { onClick: clear }, "clear")),
            react_1.default.createElement(Galgame, { initPara: localStorage.getItem(KEYS.GAL_PARA), initPage: Number(localStorage.getItem(KEYS.GAL_PAGE)), initLine: Number(localStorage.getItem(KEYS.GAL_LINE)), ref: ref, Scenes: Scenes, selects: selects, chp: chp,
                end: function () {
                    if (confirm('需要重新開始嗎?')) {
                        clear();
                        location.reload();
                    }
                }}
            )
        );
    };
    return function(info) {
        fetch('./data.json').then(function (res) { return res.json(); }).then(function (data) {
            return react_dom_1.default.hydrate(
                react_1.default.createElement(App, { jsonData: data, chp: info }),
                document.getElementById('root')
            );
        });
    }
});
// require(["index"], function(index) {
//     document.getElementById('styleGame-sheet').disabled = false;
//     document.getElementById('styleMenu-sheet').disabled = true;
//     index("保母");
// });

const imgBoxes = document.querySelectorAll('.img-box');
function imgBoxClickHandler() {
    const info = this.querySelector('.info h3').textContent;
    const that = this;
    document.getElementById('styleGame-sheet').disabled = false;
    document.getElementById('styleMenu-sheet').disabled = true;
    document.getElementById("root").innerHTML = "";
    require(["index"], function(index) {
        index(info);
        that.removeEventListener('click', imgBoxClickHandler);
    });
}

imgBoxes.forEach(imgBox => {
    imgBox.addEventListener('click', imgBoxClickHandler);
});
