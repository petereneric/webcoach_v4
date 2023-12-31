import {animate, animateChild, group, query, style, transition, trigger} from '@angular/animations';
// guide: https://medium.com/ngconf/animating-angular-route-transitions-ef02b871cc30

export const routeTransitionAnimations = trigger('triggerName', [
  transition('One => Two', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100%'
      })
    ]),
    query(':enter', [style({ right: '-100%', opacity: 1 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('0.2s ease-out', style({ right: '100%', opacity: 1 }))]),
      query(':enter', [animate('0.2s ease-out', style({ right: '0%', opacity: 1 }))])
    ]),
    query(':enter', animateChild())
  ]),
  transition('Two => One', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [style({ left: '-100%', opacity: 1 })]),
    query(':leave', animateChild()),
    group([
      query(':leave', [animate('0.2s ease-out', style({ left: '100%', opacity: 1 }))]),
      query(':enter', [animate('0.2s ease-out', style({ left: '0%', opacity: 1 }))])
    ]),
    query(':enter', animateChild())
  ])
]);
