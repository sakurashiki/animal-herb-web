//////////////////////////////////////////////////////////////////////////////////////////
// Sakura Leaves Controller 
//   based on task system algorithm
(function() {

    class Tasks {
        constructor(klass, count, dom) {
            this.list = new Array();
            for(var i=0 ; i<count ; i++ ) {
                this.list.push(new klass(dom));
            }
        }
        moveAll() {
            this.list.forEach(function(a) { a.move(); });
        }
        renderAll() {
            this.list.forEach(function(a) { a.render(); });
        }
    }

    class SakuraTask {
        constructor(dom) {
            this.rand = Math.random();
            this.x = Math.random()*100;
            this.y = Math.random()*100;
            this.rotateX = 0;
            this.rotateY = 0;
            this.rotateZ = 0;
            this.div = document.createElement('div');
            this.div.className = 'sakura_block';
            this.div.style.width  = (1 + 10 * this.rand) + '%';
            this.div.style.height = (1 + 10 * this.rand) + '%';
            this.img = new Image();
            this.img.src = '../img/firstview/sakura_tex.png';
            this.img.className = 'sakura_tex';
            this.div.append(this.img);
            dom.append(this.div);
        }
        move() {
            this.rotateX += this.rand * 2.0 + this.rand*0.5;
            this.rotateY += this.rand * 2.0 + this.rand*0.5;
            this.rotateZ += this.rand * 2.0 + this.rand*0.5;
            this.x = this.x > 100 ?  -5 : this.x + 0.01  + this.rand*0.25;
            this.y = this.y > 100 ?  -5 : this.y + 0.005 + this.rand*0.125;
        }
        render() {
            this.div.style.right   = this.x + '%';
            this.div.style.top     = this.y + '%';
            this.img.style.transform = 'rotateX(' + this.rotateX + 'deg) '
                                    + 'rotateY(' + this.rotateY + 'deg) '
                                    + 'rotateZ(' + this.rotateZ + 'deg)';
            if ( this.y > 80 ) {
                this.img.style.opacity = (100-this.y)/5;
            } else if ( this.y < 10 ) {
                this.img.style.opacity = 1.0 - ((10-this.y)/10);
            } else {
                this.img.style.opacity = 1.0;
            }
        }
    }

    let sakuraTasks = new Tasks(SakuraTask, 10, document.getElementById('background'));
    (function() {
        sakuraTasks.moveAll();
        window.setTimeout(arguments.callee, 1000/70);
    })();
    (function() {
        sakuraTasks.renderAll()
        window.requestAnimationFrame(arguments.callee);
    })();

})();

//////////////////////////////////////////////////////////////////////////////////////////
// First view animation Controller 
(function() {

    // Waitng for loading assets finished
    function loadingSpinning(callback) {
        let elems = document.getElementsByClassName('load_target');
        let count = 0;
        for(let i=0 ; i<elems.length ; i++) {
            (function() {
                let elem = elems[i];
                let img = new Image();
                img.onload = function() {
                    count++;
                    if(count < elems.length) { return; }
                    document.getElementById('fv_loading').classList.add('disable');
                    setTimeout(callback, 1000);
                };
                img.src = elem.getAttribute('x-src');
            })();
        }
    }

    // After assets loaded, do animations
    loadingSpinning(function() {
        setTimeout(function(){
            let kakaoDom = document.getElementById('kakao');
            kakaoDom.classList.add('animate');
        }, 0);
        setTimeout(function(){
            let lilyDom = document.getElementById('lily');
            lilyDom.classList.add('animate');
        }, 500);
        setTimeout(function(){
            let mintDom = document.getElementById('mint');
            mintDom.classList.add('animate');
        }, 1000);
        setTimeout(function(){
            let fvTitleDom = document.getElementById('fv_title');
            fvTitleDom.classList.add('animate');
        }, 1300);


    });
})();

//////////////////////////////////////////////////////////////////////////////////////////
// Action Triger for each sections
(function() {
    let methods = [
        {
            query: '.introuction #movie1',
            method: function() {
                setTimeout(function(){ document.getElementById('int_description').classList.add('animate'); },  500 );
                setTimeout(function(){ document.getElementById('movie1').classList.add('animate'); }, 500 );
                setTimeout(function(){ document.getElementById('movie2').classList.add('animate'); }, 700 );
                setTimeout(function(){ document.getElementById('movie3').classList.add('animate'); }, 900 );
                setTimeout(function(){ document.getElementById('movie4').classList.add('animate'); }, 1100 );                
            }
        },
        {
            query: '.character',
            method: function() {
            }
        },
        {
            query: '.gallery',
            method: function() {
            }
        },
        {
            query: '.credit',
            method: function() {
            }
        }
    ];
    methods.forEach(function(m){
        let observer = new IntersectionObserver(function(entries) {
            for(let e of entries) {
                if(e.isIntersecting) {
                    m.method && m.method();
                    m.method = undefined;
                }
            }
        });
        observer.observe(document.querySelector(m.query));    
    });

})();

//////////////////////////////////////////////////////////////////////////////////////////
// Gallery Viewer
(function() {
    let viewer = document.querySelector('#g_viewer');
    let loading = document.querySelector('#g_loading');
    let elems = document.querySelectorAll('.item img');
    let content = document.querySelector('#g_viewer .content');
    
    for(let elem of elems) {
        elem.addEventListener('click', function() {
            loading.style.display = 'block';
            viewer.style.display = 'flex';
            let src = this.getAttribute('x-src')
            content.src = src;
            setTimeout(function(){
                viewer.classList.add('show');
            }, 0);
            setTimeout(function(){
                let img = new Image();
                img.onload = function() {
                    loading.style.display = 'none';
                    content.classList.add('show');
                };
                img.src = src;
            }, 1000);
        }, false);
    }

    viewer.addEventListener('click', function() {
        viewer.classList.remove('show');
        content.classList.remove('show');
        setTimeout(function(){
            loading.style.display = 'none';
            viewer.style.display = 'none';
        }, 300);
    }, false);
})();

//////////////////////////////////////////////////////////////////////////////////////////
// Charactor List
(function() {
    let buttons = document.querySelectorAll('.selector_inner .button');
    buttons.forEach(function(b){
        b.addEventListener('click', function() {
            let className = this.getAttribute('x-target');
            document.querySelectorAll('.character_all').forEach(function(a) {
                a.classList.remove('shown');
            });
            buttons.forEach(function(e) {
                e.classList.remove('active');
            });
            this.classList.add('active');
            setTimeout(function(){
                document.querySelector('.'+className).classList.add('shown');
            }, 0);
        });
    });
    buttons[0].click();
})();

//////////////////////////////////////////////////////////////////////////////////////////
// Header Menu Actions
(function() {
    let bg = document.querySelector('.side_menu_bg');
    let menu = document.querySelector('.side_menu');
    let button = document.querySelector('.menu_button');

    button.addEventListener('click', function() {
        bg.style.display = 'block';
        menu.style.display = 'block';
        setTimeout(function(){
            bg.classList.add('active');
            menu.classList.add('active');    
        }, false);
    }, false);

    let closeMenu = function() {
        bg.classList.remove('active');
        menu.classList.remove('active');
        setTimeout(function(){
            bg.style.display = 'none';
            menu.style.display = 'none';
        }, 500);
    }

    let anchors = document.querySelectorAll('.side_menu a');
    for( let i=0 ; i< anchors.length ; i++ ) {
        let a = anchors[i];
        a.addEventListener('click', closeMenu);
    }
    bg.addEventListener('click', closeMenu);
})();

