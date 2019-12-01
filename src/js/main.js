//import '@babel/polyfill';



/*
import scrollMonitor from 'scrollmonitor';
import backgroundNoise from './components/background-noise';
import { init as initNavigation } from './components/navigation';
import { init as initScrollTo } from './components/scroll-to';
import { init as initSubmissionForm } from './components/submission-form';

backgroundNoise();
initNavigation();
initScrollTo();
initSubmissionForm();
*/

/*
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
*/

var navToggleOpen = document.getElementById('nav-toggle-open');
var navToggleClose = document.getElementById('nav-toggle-close');
var navContainer = document.querySelector('.masthead__nav');

navToggleOpen.addEventListener('click', function(ev) {
   ev.preventDefault();
   alert('click');
   navContainer.classList.add('masthead__nav--open');
   alert('class added');
});

navToggleClose.addEventListener('click', function(ev) {
   ev.preventDefault();
   navContainer.classList.remove('masthead__nav--open');
});
