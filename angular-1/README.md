# Charcoal Blue
> Room Design Guide: [roomdesignguide.withgoogle.com](http://roomdesignguide.withgoogle.com/)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version `7.0.2`.

Use Node [`v8.x.x`](https://github.com/nodejs/node/releases/tag/v8.16.2), or run `nvm use` if you have [Node Version Manager](https://github.com/nvm-sh/nvm) installed.

## Install dependencies

Run `npm install` to install all needed dependencies.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Analytics

The project makes use of Google Analytics to track various parts of the site. This has been implemented using Google Tag Manager where and all triggers are set there.

There is a Charcoal Blue (Room Design Guide) account and tag manager setup available for testing analytics with google@nomensa.com and [`localhost` will automatically be detected](https://stackoverflow.com/questions/4375447/can-you-test-google-analytics-on-a-localhost-address) with no additional setup.

There are a few tags setup on Google Tag Manager. There either track page views or elements that get clicked (based on an element's `class`).

The [Google Analytics Debugger extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna?hl=en) can be used to get insights on how elements and interactions are being tracked as browser console output.

Furthermore, [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk?hl=en) can aid in testing tags.

There is also the [Google Tag Manager preview mode](https://support.google.com/tagmanager/answer/6107056?hl=en) which allow real-time checks on triggers that occur on the page.

### Google Tag Manager Tags

|     Name  |     Type   |   Firing Triggers   |  Target |
| -------------|:-------------:|:-------------:|:-------------:|
| **History**     | Google Analytics: Universal Analytics | History - All Route Changes | All - pageview |
| **Section Clicks** | 	Google Analytics: Universal Analytics | Click - Sections | `main-section-link` (class) |
| **Sub Section Clicks** | Google Analytics: Universal Analytics | Click - Sub Section Clicks | `sub-section-link` (class) |
| **Subsection Card Clicks** | Google Analytics: Universal Analytics | Click - Subsection Cards | `sub_section_card_clicked` (custom event) |
| **Room Planner Slider** | Google Analytics: Universal Analytics | Interaction - Room Planner Slider | `room_planner_slider` (custom event) |
| **Room Planner Jamboard** | Google Analytics: Universal Analytics | Interaction - Room Planner Jamboard | `room_planner_jamboard` (custom event) |
| **Download Resources Clicks** | Google Analytics: Universal Analytics | Interaction - Download Resource | `download_resource` (custom event) |
| **Download Resources Locked Clicks** | Google Analytics: Universal Analytics | Interaction - Download Resource Locked | `download_resource_locked` (custom event) |
| **Main Contact Sales** | Google Analytics: Universal Analytics | Interaction - Main Contact Sales | `main_contact_sales` (custom event) |

> `!` Custom events might be issued with `gtag()`. On Google Tag Manager, both _"Event name"_ and `Some Custom Events -> Event -> equals -> <event_name>` have to be the same value in order to trigger correctly.

### Tracking and Container IDs

|     Platform  |     Type   |   ID   | Environment |
| -------------|:-------------:|:-------------:|:-------------:|
| Google Analytics  | Tracking ID | UA-149173172-1 | Development |
| Google Analytics  | Tracking ID | UA-132857609-1 | Production |
| Google Tag Manager | Container ID | GTM-TKCJZK4 | Development |
| Google Tag Manager  | Container ID | GTM-PQP449Z | Production |