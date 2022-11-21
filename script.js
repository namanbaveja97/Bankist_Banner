'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnsOpenModal.forEach((btn)=>btn.addEventListener('click',openModal)); // btnOpenModal is not a array but is a nodelist which still have most of array methods so foreach works on it 

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
// button scrolling

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click',function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('curren scroll (x/y)',window.pageXOffset,window.pageYOffset);

  console.log('height/width of viewport',
  document.documentElement.clientHeight,
  document.documentElement.clientWidth);

  // scrolling  old way

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top +  window.pageYOffset
  // );
// not very old way 

    // window.scrollTo({
    //   top: s1coords.top +  window.pageYOffset,
    //   left:  s1coords.left + window.pageXOffset,
    //   behavior : 'smooth',
    // });

// new method
  section1.scrollIntoView({behavior: 'smooth'});

});

//////////////// event delegation 
// use case - multible eventHandling
// use case - dynamic button creation event handling

// page navigation  -- also event delegation in practice

// document.querySelectorAll('.nav__link').forEach(function(el){
//  el.addEventListener('click',function(e){
//    e.preventDefault();
//    const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'});
  
//  })
// });    // this is not good 

// event delegation
// step 1 - Add event listener to common parent element 
// step 2 - Determine what element originated the event
// step 3 - matching strategy

document.querySelector('.nav__links').addEventListener('click',function(e){
  console.log(e.target);
  e.preventDefault();
  // console.log(e.target.classList.contains('nav__link'));
  // matching strategy 
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior:'smooth'});
  }
})
// tabbed component
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');
// console.log(tabContent);

// we will use event delegation for attaching event with tab buttons for most effecient way
tabContainer.addEventListener('click',function(e){
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  if(!clicked) return;  // if clicked == null then exit
 
  // activate tab
  tabs.forEach(l=>l.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // activate content area
  tabContent.forEach(el=> el.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`).classList.add('operations__content--active');

});

// making hover effect on nav
// using passing arguments in event handler function concept
const handleHover = function(e){
  if(e.target.classList.contains('nav__link')){
    
    const link = e.target;
    const siblings = e.target.closest('.nav').querySelectorAll('.nav__link');
    const logo = e.target.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
    
  }
}

const nav = document.querySelector('.nav');
// using bind to pass "argument " in eventHandler function only one argument is possible that is this for multiple arguments we can use array in .bind([0,1,78]) -> like this
nav.addEventListener('mouseover',handleHover.bind(0.5)); // mouseover supports event delegation but mousein does not that is why we used mouse over

nav.addEventListener('mouseout',handleHover.bind(1));

// ////// making sticky navbar

// innefecient way is using scroll event which fires at every small scroll therefore is very ineffecient.



// const initialCoords= section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll',function(){
// console.log(window.scrollY);
// if(this.window.scrollY >= initialCoords.top) nav.classList.add('sticky');
// else nav.classList.remove('sticky');
// });

///                                    ****     INTERSECTION OBSERVER API ***

// const obsCallback = function(entries, observer){
//   entries.forEach(entry => {console.log(entry)})
// }  // callback will called each time the observed element is intersecting the target element at the given percentage(threshold)

// const obsOption = {
//   root: null ,                 // it is the target element we are intersecting - null we can observe the target element intersecting the whole viewport
//   threshold: 0.1  // 10 percent 
// }

// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1)


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);

const stickyNav = function (entries){
  const [entry] = entries;

  if(!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');


};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);


//    ------------  REVEAL SECTIONS ------------------

const  allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
  const [entry] = entries;
  // console.log(entry);

  if(!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection,{
  root: null,
  threshold: 0.15,
});

allSections.forEach(function(section){

  sectionObserver.observe(section);
  section.classList.add('section--hidden');
 })


// Lazy loading images -------------------

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries,observer){

  const [entry] = entries;
  

  if(!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load',function(){
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg,{
  root: null,
  threshold: 0,
  rootMargin: '200px',  // because we don't want our users to find out that we are lazy loading
});

imgTargets.forEach(img => imgObserver.observe(img));


//       SLIDER 

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

/********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************              SELECTING CREATING DELETING DOM ELEMENTS            ********************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */

//       selecting dom elements

//  console.log(document.documentElement);
//  console.log(document.head);
//  console.log(document.body);
 

 // html collection and nodelist

//  const allSections = document.querySelectorAll('.section');
//  console.log(document.querySelectorAll('.section'));   // node list

//  console.log(document.getElementsByClassName('btn'));   // html collection
//  console.log(document.getElementsByTagName('button')); // html collection


 // unlike nodelist if we remove a relevant element from dom then html collections get updated automatically 

//  console.log(document.getElementById('section--1'));


// creating dom elements

// .insertAdjacentHTML()  covered earlier check mdn documentation

// console.log('creating elemens --------------------');
// const message = document.createElement('div'); // no div element is actually created and placed in dom it's just that a dom object has been created
// console.log(message);
// message.classList.add('cookie-message');
// console.log(message);
// message.textContent = 'we use cookies for improved functionality ';
// message.innerHTML = 'we use cookies for improved functionality <button class="btn btn--close--cookie"> got it </button';

// const header = document.querySelector('.header');
// header.prepend(message);  // inserting this element as the first child of header
// header.append(message);  // insert as the last child of header

// the dom element only appears once in html because it is now a live html element which is unique just like a person which can only be at one place at a time 

// to copy it 
// header.append(message.cloneNode(true));  // true meeans copy all children also 

// header.before(message);  // before header element as its sibling

// header.after(message); // after header element as its sibling

//        DELETING ELEMENT

// document
//   .querySelector('.btn--close--cookie')
//   .addEventListener('click',function(){
//     message.remove();  // this is new method
    // message.parentElement.removeChild(message);
  // });

  /********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************                  STYLES, ATTRIBUTE and CLASSES                   ********************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */

//  message.style.backgroundColor = 'black';
//  message.style.width = '120%';

//  console.log(message.style.height);   // blank it will only show inline style which we set ourselves

//  console.log(message.style.width);

//  // to get style of element  -- getComputedStyle

//  console.log(getComputedStyle(message));
//  message.style.height = Number.parseFloat(getComputedStyle(message).height,10) + 1000 + 'px';

// document.documentElement.style.setProperty('--color-primary','orangered');  // we can change the value of css variables .. documentElement is equivalent to css root:

// //        attributes
// console.log('--------------   attributes');
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);

// logo.alt = 'beautiful minimalist logo';


// // but we cannot select non statndard-attributes
// console.log(logo.designerBlahBlah);
// console.log(logo.getAttribute('designerBlahBlah'));
// logo.setAttribute('company','bankist');

// // difference between getAttribute and normal way
// console.log(logo.getAttribute('src')); // only what is written in html
// console.log(logo.src);    // return the full url 

// const link = document.querySelector('.nav__link--btn');

// console.log(link.href);
// console.log(link.getAttribute('href'));

// //    special attributes data  // search mdn data attributes js

// console.log(logo.dataset.versionNumber);
// console.log(logo.dataset.justForFun);

// //         classes

// logo.classList.add('c','j');
// logo.classList.remove('c','j');
// logo.classList.toggle('c');
// logo.classList.contains('j');

// // don't use this following
// logo.className = 'new-class';  // as this will completely overide the other class names. and also it allows us to only put one class to element

  /********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************                  IMPLEMENTING SMOOTH SCROLLING                   ********************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click',function(e){
//   const s1coords = section1.getBoundingClientRect();
//   console.log(s1coords);

//   console.log(e.target.getBoundingClientRect());

//   console.log('curren scroll (x/y)',window.pageXOffset,window.pageYOffset);

//   console.log('height/width of viewport',
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth);

//   // scrolling  old way

//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top +  window.pageYOffset
//   // );
// // not very old way 

//     // window.scrollTo({
//     //   top: s1coords.top +  window.pageYOffset,
//     //   left:  s1coords.left + window.pageXOffset,
//     //   behavior : 'smooth',
//     // });

// // new method
//   section1.scrollIntoView({behavior: 'smooth'});

// });

/*
 ********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************                  TYPES OF EVENTS AND EVENT HANDLERS                   ***************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */
 
//  const h1 = document.querySelector('h1');

//  h1.addEventListener('mouseenter',function(e){
//     alert('you are reading a line');
//  }); // recomended

//  h1.onmouseenter = function(e){   
//    alert('you are in onmouseenter');
//  }; // old method every event has onevent function 

 //             REmove EVENT listeners


//  const alertH1 = function(e){
//   alert('you are reading a line');

//   // h1.removeEventListener('mouseenter',alertH1);    // this will remove event listener mouseenter 
// };
// setTimeout(()=> h1.removeEventListener('mouseenter',alertH1),5000)
// h1.addEventListener('mouseenter',alertH1);


/*
 ********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************        009 Event Propagation_ Bubbling and Capturing                    ***************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */


 // watch video to get a better understanding

// ///////////////////////////////////////
// // Event Propagation in Practice
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);

//   // Stop propagation
//   // e.stopPropagation();
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// });

/*
 ********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************                    012 DOM TRAVERSING                                ***************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */

//  const h1 = document.querySelector('h1');
//  // going down  -- traversing child nodes
// // this way we can select all highlight class elements which are child to h1 only. this method of child selection can go as deep as necessary with grandchild, grandchild of grandchild etc.
//   console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);  // direct child nodes of h1 , nodes means all text,element,comment etc.

// console.log(h1.children);   // html collection (html collection is self updating) of child elements of h1

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color= 'red';


// // Going upwards

// console.log('going up ----------------');
// console.log(h1.parentElement);
// console.log(h1.parentNode);

// console.log(h1.closest('.header').style.background ='var(--gradient-secondary');    // .closest will find the closest parent element with the query selector query

// h1.closest('h1').style.background='var(--color-primary-darker)'; // it will refer to itself in this case.

// // Going sideways
// console.log('---------- sideways----------');
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling); // for node
// console.log(h1.nextSibling); // for node

// // trick to traverse through all siblings 
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function(el){
//   if(el !== h1) el.style.transform = 'scale(0.5)';
// })


//
/*
 ********************************************************************************************************************************************************
 ******************************************************************************************************************************************************** 
 ******************************                     Event lifecycle                             ***************************************************
 ********************************************************************************************************************************************************
 ********************************************************************************************************************************************************
 */
document.addEventListener('DOMContentLoaded',function(e){
  // it does not wait for images and external files to be loaded
console.log('HTML parsed and DOM tree built   ',e);
});

window.addEventListener('load',function(e){
  console.log('loading finished', e);
});

// window.addEventListener('beforeunload', function(e){
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });