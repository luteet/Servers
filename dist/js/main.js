
const body = document.querySelector('body'),
      html = document.querySelector('html'),
      wrapper = document.querySelector('.wrapper'),
      header = document.querySelector('.header');

new lc_select('.custom-select');

// =-=-=-=-=-=-=-=-=-=-=-=- <popup> -=-=-=-=-=-=-=-=-=-=-=-=

(function () {
  var FX = {
      easing: {
          linear: function (progress) {
              return progress;
          },
          quadratic: function (progress) {
              return Math.pow(progress, 2);
          },
          swing: function (progress) {
              return 0.5 - Math.cos(progress * Math.PI) / 2;
          },
          circ: function (progress) {
              return 1 - Math.sin(Math.acos(progress));
          },
          back: function (progress, x) {
              return Math.pow(progress, 2) * ((x + 1) * progress - x);
          },
          bounce: function (progress) {
              for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
                  if (progress >= (7 - 4 * a) / 11) {
                      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
                  }
              }
          },
          elastic: function (progress, x) {
              return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
          }
      },
      animate: function (options) {
          var start = new Date;
          var id = setInterval(function () {
              var timePassed = new Date - start;
              var progress = timePassed / options.duration;
              if (progress > 1) {
                  progress = 1;
              }
              options.progress = progress;
              var delta = options.delta(progress);
              options.step(delta);
              if (progress == 1) {
                  clearInterval(id);
  
                  options.complete();
              }
          }, options.delay || 10);
      },
      fadeOut: function (element, options) {
          var to = 1;
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to - delta;
              }
          });
      },
      fadeIn: function (element, options) {
          var to = 0;
          element.style.display = 'block';
          this.animate({
              duration: options.duration,
              delta: function (progress) {
                  progress = this.progress;
                  return FX.easing.swing(progress);
              },
              complete: options.complete,
              step: function (delta) {
                  element.style.opacity = to + delta;
              }
          });
      }
  };
  window.FX = FX;
})()

class Popup {

  static body = document.querySelector('body');
  static html = document.querySelector('html');
  static idOnUrl = false;
  static duration = 200;

  static popupCheck = true;
  static popupCheckClose = true;

  static remHash() {
    let uri = window.location.toString();
    if (uri.indexOf("#") > 0) {
        let clean_uri = uri.substring(0, uri.indexOf("#"));
        window.history.replaceState({}, document.title, clean_uri);
    }
  }

  static open(id) {
    
    if(Popup.popupCheck) {
      Popup.popupCheck = false;

      let popup = document.querySelector(id);

      if(popup) {

          Popup.body.classList.remove('_popup-active');
          Popup.html.style.setProperty('--popup-padding', window.innerWidth - Popup.body.offsetWidth + 'px');
          Popup.body.classList.add('_popup-active');

          popup.classList.add('_active');
          
          if(Popup.idOnURL) history.pushState('', "", id);

          FX.fadeIn(popup, {
              duration: Popup.duration,
              complete: function () {
                Popup.popupCheck = true;
                Popup.body.classList.add('blur');
              }
          });

      } else {
        return new Error(`Not found "${id}"`)
      }
    }
  }

  static close(popupClose) {
    
    if (Popup.popupCheckClose) {
      Popup.popupCheckClose = false;

      let popup
      if(typeof popupClose === 'string') {
        popup = document.querySelector(popupClose)
      } else {
        popup = popupClose.closest('.popup');
      }

      FX.fadeOut(popup, {
          duration: Popup.duration,
          complete: function () {
              popup.style.display = 'none';

              if(Popup.idOnURL) Popup.remHash();

              Popup.body.classList.remove('_popup-active');
              Popup.html.style.setProperty('--popup-padding', '0px');
              popup.classList.remove('_active');
              Popup.body.classList.remove('blur');

              Popup.popupCheckClose = true;
          }
      });
      
  }
  }

  static start() {
    let thisTarget
    Popup.body.addEventListener('click', function(event) {

        thisTarget = event.target;

        let popupOpen = thisTarget.closest('.open-popup');
        if(popupOpen) {
            event.preventDefault();

            Popup.open(popupOpen.getAttribute('href'))
        }

        let popupClose = thisTarget.closest('.popup-close');
        if(popupClose) {

            Popup.close(popupClose)
            
        }

    });

    if(Popup.idOnURL) {
      let url = new URL(window.location);
      if(url.hash) {
        let timeoutDuration = Popup.duration;
        Popup.duration = 0;
        Popup.open(url.hash);
        setTimeout(() => {
          Popup.duration = timeoutDuration;
        }, timeoutDuration)
      }
    }
  };

  constructor () {
    Popup.start()
  }
}

new Popup();

// =-=-=-=-=-=-=-=-=-=-=-=- </popup> -=-=-=-=-=-=-=-=-=-=-=-=

// =-=-=-=-=-=-=-=-=-=-=-=- <slider> -=-=-=-=-=-=-=-=-=-=-=-=

if(document.querySelector('.docSlider')) {

  docSlider.init({
    speed: 600,
    afterChange : function(){
      history.pushState({}, "", "#" + docSlider.getCurrentPage().getAttribute('id'))
    },
  });

} else {

  body.classList.add('._slider-active')

}

// =-=-=-=-=-=-=-=-=-=-=-=- </slider> -=-=-=-=-=-=-=-=-=-=-=-=

// =-=-=-=-=-=-=-=-=-=-=-=- <click events> -=-=-=-=-=-=-=-=-=-=-=-=

let thisTarget, serverTabCheck = true;
body.addEventListener('click', function (event) {

    thisTarget = event.target;

    function $(elem) {
      return thisTarget.closest(elem);
    }

    // =-=-=-=-=-=-=-=-=-=- <Выбор языка сайта в шапке> -=-=-=-=-=-=-=-=-=-=-

    const headerLanguageSelected = $('.header__language--selected');
    if (headerLanguageSelected) {
      const headerLanguage = headerLanguageSelected.closest('.header__language');
      headerLanguage.classList.toggle('_active');
    } else if(!$('.header__language')) {
      document.querySelectorAll('.header__language').forEach(headerLanguage => {
        headerLanguage.classList.remove('_active')
      })
    }

    // =-=-=-=-=-=-=-=-=-=- </Выбор языка сайта в шапке> -=-=-=-=-=-=-=-=-=-=-



    // =-=-=-=-=-=-=-=-=-=- <Табы> -=-=-=-=-=-=-=-=-=-=-

    const serverTabNavLink = $('.server__tab-nav--link');
    if(serverTabNavLink) {
      event.preventDefault();

      if(!serverTabNavLink.classList.contains('_active') && serverTabCheck) {

        serverTabCheck = false;

        const parent      = serverTabNavLink.closest('.server__tab-wrapper'),
              list        = parent.querySelector('.server__tab-list'),
              activeBlock = list.querySelector('.server__tab-block._active'),
              block       = document.querySelector(serverTabNavLink.getAttribute('href'));

        list.style.minHeight = list.offsetHeight + 'px';
        
        document.querySelector('.server__tab-nav--link._active').classList.remove('_active');
        serverTabNavLink.classList.add('_active')

        FX.fadeOut(activeBlock, {
          duration: 200,
          complete: function () {
            activeBlock.classList.remove('_active');
            activeBlock.style.removeProperty('display');

            block.classList.add('_hidden');
            list.style.minHeight = block.offsetHeight + 'px';
            block.classList.remove('_hidden');

            setTimeout(() => {
              block.style.opacity = 0;
              FX.fadeIn(block, {
                duration: 200,
                complete: function () {
                  block.classList.add('_active')
                  list.style.removeProperty('min-height')

                  setRequired(block, '.server__card--input')

                  serverTabCheck = true;
                }
              });
            },200)
            
          }
        });

      }
    }

    // =-=-=-=-=-=-=-=-=-=- </Табы> -=-=-=-=-=-=-=-=-=-=-

})

// =-=-=-=-=-=-=-=-=-=-=-=- </click events> -=-=-=-=-=-=-=-=-=-=-=-=

// =-=-=-=-=-=-=-=-=-=-=-=- <Табы (переключение блоков)> -=-=-=-=-=-=-=-=-=-=-=-=

const tabNavWrapper = document.querySelector('.server__tab-nav--wrapper');
function tabNavWrapperScroll() {
  const elemConfig = tabNavWrapper.querySelector('.server__tab-nav--list').getBoundingClientRect();
  
  if(tabNavWrapper.scrollWidth <= (elemConfig.x - elemConfig.x - elemConfig.x + elemConfig.width + 10)) {
    tabNavWrapper.parentElement.classList.remove('_end');
  } else {
    tabNavWrapper.parentElement.classList.add('_end');
  }
  
  if(tabNavWrapper.scrollLeft <= 0) {
    tabNavWrapper.parentElement.classList.remove('_start');
  } else {
    tabNavWrapper.parentElement.classList.add('_start');
  }
}

if(tabNavWrapper) {
  tabNavWrapper.addEventListener('scroll', function(event) {
    tabNavWrapperScroll();
  })
  tabNavWrapperScroll();
}

function setRequired(block, inputClass) {
  const inputs = block.querySelectorAll(inputClass),
        allInputs = document.querySelectorAll(inputClass);

  allInputs.forEach(input => {
    input.removeAttribute('required');
    input.checked = false;
  })

  inputs.forEach(input => {
    input.required = true;
  })

}

if(document.querySelector('.server__tab-block._active')) {
  setRequired(document.querySelector('.server__tab-block._active'), '.server__card--input')
}

// =-=-=-=-=-=-=-=-=-=-=-=- </Табы (переключение блоков)> -=-=-=-=-=-=-=-=-=-=-=-=



// =-=-=-=-=-=-=-=-=-=-=-=- <Media screen> -=-=-=-=-=-=-=-=-=-=-=-=

let windowSize;

function resize() {

  windowSize = window.innerWidth
  html.style.setProperty('--height-screen', window.innerHeight + 'px');

}

resize();

window.onresize = resize;

// =-=-=-=-=-=-=-=-=-=-=-=- </Media screen> -=-=-=-=-=-=-=-=-=-=-=-=


function servicesItemZIndex() {
  const wrapper = document.querySelectorAll('.services-z-index-wrapper');

  wrapper.forEach(wrapper => {
    const item = wrapper.querySelectorAll('.services-z-index-item');

    for(let index = item.length-1, count = 1; index >= 0; index--, count++) {
      item[index].style.zIndex = count;
    }
  })
  
}

servicesItemZIndex();
