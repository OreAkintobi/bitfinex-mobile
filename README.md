### Bitfinex Project

#### To run:

- In the root folder, run `npm install` and then run `npx expo start`. Feel free to use the Android or iOS simulator as will be indicated in the command line.

#### What I would do if I had more time:

- **BUGS!!!** There is a big bug on the main screen where the UI has to wait a while before you can do things like switch between tabs or even disconnect from the Socket once connected (I have experimented with WebSockets before but not to this scale, so apart from the instance paradigm and the incorporation of redux toolkit, I am still figuring it out). It is huge, but I have no idea how to fix it. Also, the Precision switcher is not currently working.
- Would improve the view a bit, make style updates to hide dodgy bits like the vertical scroll indicator, add icons, and improve styling.
- Would also do a lot of refactoring. Componentize the code and such.
