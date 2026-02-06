# Natural Cycles Countdown App

A countdown timer that scales text to fill the screen. Built with Angular 21.

**Live Demo:** https://nc-timer.netlify.app/

## Quick Start

```bash
npm install
npm start
```

Open http://localhost:4200

## What It Does

- Countdown to any date (days, hours, minutes, seconds)
- Text automatically resizes to fill the screen width
- Saves your event name and date to localStorage
- Shows a random quote from an API (with loading spinner)
- Works on mobile (portrait/landscape) and desktop

## A Note on My Approach

This is my first Angular project. I come from 3.5 years of React/TypeScript. I leaned on the Angular docs and used Claude to help me understand patterns and get up to speed quickly. I'm used to functional programming, everything's a function, hooks everywhere, no classes. Angular has more of an OOP flavor with classes and decorators, which took a bit of adjusting. But honestly, once I got past that, a lot of it felt pretty intuitive.

State management clicked right away. Angular's `signal()` is basically `useState()`, you call `.set()` instead of the setter function, but same idea. What surprised me is `computed()`, it's like `useMemo()` but you don't need a dependency array. Angular just tracks what you read inside the function and knows when to recalculate. That's actually nicer and more intuitive than React.

The thing that took a minute was thinking in "directives" instead of hooks. In React, I'd write a `useTextFit()` hook that takes a ref and handles the resize logic. In Angular, the same thing is a directive. You slap `appTextFit` on any element and it just works. Different API, same concept: reusable behavior that attaches to DOM elements.

Services were new but make sense. Instead of importing utility functions directly, Angular injects singleton instances. It felt weird at first (why not just import?) but I get the benefit now, easier to mock in tests, and the framework manages the lifecycle. Used `inject()` which is the modern way instead of constructor injection.

The Observable/RxJS thing for HTTP was the biggest mental shift. In React I'd do `const data = await fetch(url)`. Angular's HttpClient returns an Observable, so you `.subscribe()` to it instead of awaiting. For a single request it feels like overkill, but I can see how it scales for streams and complex async flows.

Template syntax is just different. `@if` instead of ternaries, `{{ value() }}` with parentheses because signals are functions. Took 10 minutes to get used to.

Overall: if you know React, modern Angular isn't that foreign. The concepts translate, the syntax is just different.

## Project Structure

```
src/app/
├── directives/text-fit.directive.ts   # The reusable text-fit logic
├── components/quote/                  # Quote component with loading state
├── services/
│   ├── quote.service.ts               # Fetches from dummyjson.com
│   └── storage.service.ts             # localStorage wrapper
├── app.ts                             # Main component
├── app.html                           # Template
└── app.scss                           # Styles (mobile-first)
```

## Text-Fit Usage

```html
<h1 appTextFit [textFitContent]="myText">{{ myText }}</h1>
```

Pass the content as an input so the directive knows when to recalculate. Uses binary search (O(log n)) to find the optimal font size, researched optimization approaches with Claude. Packages like `ngx-fittext` exist, but implementing it made more sense for a take-home.

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Design Decisions

A couple places where the Figma and the written spec didn't quite match:

- **Countdown format** — The written spec shows "3 days, 15 h, 20 m, 5 s" (spaces before all units) but the Figma shows "20 days, 3 h, 15m, 10s" (no space before "m" or "s"). Went with the Figma since that's what the design actually shows.
- **Date input** — The Figma shows a plain text field for the date. I used a native date picker instead because it's better UX and prevents invalid input. Felt like the right call for a real app.

## Known Quirk

- **Date picker clipping in browser mobile mode** — When testing in Chrome DevTools mobile view, the native date picker can clip outside the viewport at the bottom. This is a browser simulation quirk, not a real issue. On an actual iOS/Android device, the native date picker is a modal that slides up from the bottom of the screen, so it never clips. Could be solved with a library like `ng-bootstrap` or `Angular Material` datepicker, but it felt a bit unnecessary for this scope.

## What I'd Add for Production

A few things I'd want before shipping this:

- **Error handling for the quote**, right now if the API fails you just get "Could not load quote". I'd add a retry button or auto-retry.
- **Tests**, the binary search in text-fit is the kind of logic I'd want unit tests for. Easy to break with an off-by-one error.
- **Debounce the title input**, currently it saves to localStorage on every keystroke which works but writes to storage unnecessarily.
- **Date validation**, you can pick a date in the past and it just shows 0 days. Should probably prevent that or show a message.
- **Timeout for the quote API**, if the API hangs the spinner just spins forever. Should timeout after a few seconds.
- **Long quote handling**, some quotes from the API are really long and might look weird. Could truncate or adjust font size.

Nothing critical for a demo, but stuff I'd notice in code review.

---

Overall this was a fun project. Angular's modern patterns (signals, standalone components) made the transition from React smoother than I expected.
