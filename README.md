# Trace Kanji - A Japanese Kanji trainer

Start learning [here](https://tracekanji.com)!

An extensive study tool for Japanese learners, specifically in the meanings and stroke orders of over 2000 kanji. Users can login to save specfic kanji to their own created decks, providing an easy way to facilitate their study at their own pace. In-depth information such as the JLPT grade, onyomi and kunyomi readings, and more are provided through KanjiAPI, and stroke orders are retrieved from KanjiVG, a collection of vector graphics.

## Features
- Information on all [Jōyō kanji](https://en.wikipedia.org/wiki/J%C5%8Dy%C5%8D_kanji) (2,136 kanji): basic meanings, kunyomi/onyomi readings, grade, JLPT level, and words that use the kanji. This information is retrieved from [KanjiAPI](https://github.com/onlyskin/kanjiapi.dev), an excellent API of thousands of kanji.
- Stroke orders/images of each kanji, courtesy of SVG files from the [KanjiVG project](https://kanjivg.tagaini.net/)
- Draw area to practice writing kanji, as well as overlaying stroke orders onto the canvas, undo-ing strokes and hiding the kanji tracing.
- Search filter to find specific kanji. Meanings, kanji, and kunyomi/onyomi readings can simply be typed into the search bar. Grades and JLPT levels can be filtered using ```grade:[level]``` and ```jlpt:[level]``` respectively.
- After signing in, you are able to create your own decks of kanji to facilitate and organize your study

![image](https://github.com/sicfran774/TraceKanji/assets/1214993/73cbd4e7-af53-41e1-ba53-d54414f3f178)

---

## Technologies Used
- [KanjiAPI](https://github.com/onlyskin/kanjiapi.dev)
- [KanjiVG](https://kanjivg.tagaini.net/)
- React
- NextJS (deployed on Vercel)
- MongoDB

This project is a work-in-progress. If you have any suggestions, feel free to create a PR.
