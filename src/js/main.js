import '@babel/polyfill';

import scrollMonitor from 'scrollmonitor';

/*
import backgroundNoise from './components/background-noise';
import { init as initNavigation } from './components/navigation';
import { init as initScrollTo } from './components/scroll-to';
import { init as initSubmissionForm } from './components/submission-form';

backgroundNoise();
initNavigation();
initScrollTo();
initSubmissionForm();
*/

const navToggleOpen = document.getElementById('nav-toggle-open');
const navToggleClose = document.getElementById('nav-toggle-close');
const navContainer = document.querySelector('.masthead__nav');


navToggleOpen.addEventListener('click', ev => {
   ev.preventDefault();
   navContainer.classList.add('masthead__nav--open');
});

navToggleClose.addEventListener('click', ev => {
   ev.preventDefault();
   navContainer.classList.remove('masthead__nav--open');
});


var header = document.querySelector('.masthead');
header.classList.add('masthead--sticky');

/*
var myElement = document.querySelector('main');
var elementWatcher = scrollMonitor.create( myElement );
var header = document.querySelector('.masthead');

var elementWatcher2 = scrollMonitor.create( header );

elementWatcher2.enterViewport(function() {
    console.log( 'I have entered the viewport' );
   // header.classList.remove('masthead--sticky');
});
elementWatcher2.exitViewport(function() {
    header.classList.add('masthead--sticky');
});
*/

/*
masthead__nav--open
*/
