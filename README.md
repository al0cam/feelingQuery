# FeelingQuery

A simple web app to help you track your feelings

## Purpose

The main idea of the app is to track the feelings of a group of people which can be useful in a scrum team for example.

## Stack: Svelte + TS + Vite + TailwindCSS + DaisyUI

The application is built using Svelte and TypeScript. The build tool is Vite.
The app uses TailwindCSS and DaisyUI for styling.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).
Also, install the [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) extension.

## How to run the app

First of all, you need to have Node.js and Git installed on your machine.
I will assume you already have that done and go from there.

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open your browser and go to `http://localhost:SOME_PORT` where `SOME_PORT` is the port number that Vite is using, it is random because there was no need for a specific port.
5. Enjoy the app!

## How to build the app

1. Run `npm ci`
2. Run `npm run build`
3. The build will be in the `dist` folder

## How to run the tests

There are no tests yet.

## How to contribute

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Open a pull request

## Documentation

The application uses a repository for fetching things from the backend and a store to manage the fetched and cached information.
Current use of the repository and store looks like this.
![alt text](Docs/generalTransactions.png)

I want to change the current arhitecture so that all the calls for the repository, at least for a basic user go through the teamStore.
Since all the caching is happening in the teamStore and so on, that would prevent extra calls to the Repository and it would make more sense to interface the teamStore from the frontend dev perspective.
All the values which I am supposed to fetch for the frontend come from the store anyway.

After further contemplation, I have come to the conclusion that the repository shouldnt have any complex logic in it. The only responsibility it should have is fetching things from the database or backend.

All the logic should be pushed into the store. The store should be the one that is responsible for managing the state of the application and checking whether it's even required to call the repository or if the data is already in the store.

Another important point is that svelte stores, at present, don't have a get method which complicates things. Because of that I like vue's stores more. But since the application is done in svelte now, I will try to make a workaround for that. (As far as I have seen, in Svelte 5 this is addressed)

Even though I wrote all of this I don't feel like implementing them right now.
But it's a good reference for future development.

Now that I look closely at the repository, I see that it only contains CRU calls and helper methods such as isCached...

## License

MIT License

Copyright (c) [2024] [Benjamin Filip Šikač]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish copies of the Software,
and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## TOOD

- [x] Add secrets to Firebase
- [x] write code that generates toast messages for success, error and warning
- [x] Define logic for setting the dates and teams
- [x] Define logic for adding the dates and teams
- [x] Define logic for fetching the feelings
- [ ] Add a way to share the feelings with the team
- [ ] Add a way to visualize the feelings
- [ ] Add a way to export the feelings
- [ ] Add a way to import the feelings
- [ ] Add CI/CD pipeline for testing branch
- [ ] Add CI/CD pipeline for main branch
- [ ] Add tests
