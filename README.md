# Trace Kanji - A Japanese Kanji trainer

Start learning [here](https://tracekanji.com)!

An extensive study tool for Japanese learners, specifically in the meanings and stroke orders of over 2000 kanji. Features recognition of handwritten kanji, which updates the best matching kanji every time a stroke is made. Users can login to save specfic kanji to their own created decks, providing an easy way to facilitate their study at their own pace. In-depth information such as the JLPT grade, onyomi and kunyomi readings, and more are provided through KanjiAPI, and stroke orders are retrieved from KanjiVG, a collection of vector graphics.

## Features
- Draw area to practice writing kanji, as well as overlaying stroke orders onto the canvas, undo-ing strokes and hiding the kanji tracing.
- Handwritten kanji recognition to make it easy to find out what that kanji means. Stroke order does not matter!
- After signing in, you are able to create your own decks of kanji to facilitate and organize your study
- Spaced-repetition system implemented to streamline study sessions and remember more Kanji
- Information on all [Jōyō kanji](https://en.wikipedia.org/wiki/J%C5%8Dy%C5%8D_kanji) (2,136 kanji) and [Jinmeiyō kanji](https://en.wikipedia.org/wiki/Jinmeiy%C5%8D_kanji) (863 kanji): basic meanings, kunyomi/onyomi readings, grade, JLPT level, and words that use the kanji. This information is retrieved from [KanjiAPI](https://github.com/onlyskin/kanjiapi.dev), an excellent API of thousands of kanji.
- Stroke orders/images of each kanji, courtesy of SVG files from the [KanjiVG project](https://kanjivg.tagaini.net/)
- Search filter to find specific kanji. Meanings, kanji, and kunyomi/onyomi readings can simply be typed into the search bar. Grades and JLPT levels can be filtered using ```grade:[level]``` and ```jlpt:[level]``` respectively.
- Simplistic and clear design, dark/light mode, desktop and mobile friendly

![image](https://i.gyazo.com/d37db4d59f9d3b7f4de809301aaed10d.png)

### SRS
![image](https://i.gyazo.com/322ebca394b9e4a905c2d8106c51cc3d.png)

---

## Technologies Used
- [KanjiAPI](https://github.com/onlyskin/kanjiapi.dev)
- [KanjiVG](https://kanjivg.tagaini.net/)
- [KanjiRecognizerAPI (Tensorflow)](https://github.com/sicfran774/KanjiRecognizerAPI) (Courtesy of [CaptainDario's Kanji recognition machine learning model](https://github.com/CaptainDario/DaKanji-Single-Kanji-Recognition))
- React
- NextJS (deployed on Vercel)
- MongoDB

This project is a work-in-progress. If you have any suggestions, feel free to create a PR or [contact me](mailto:sicfran.774@gmail.com?subject=Trace%20Kanji%20Feedback).
