// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var totalScore = 0; // Total score
var wonScore = 0; // Won score
var levelScore = 0; // Score you can win in that level
var failedLevels = 0; // Number of failed levels
var level = 1; // Level number (max = 7)
var grid = 0; // Will be an array when game will be initialized
var x = -1; // Current cursor position
var y = -1;
let highestScore = 0;
let highscoreObj;

var debugmode = 0; // This will display the answers.

var borderOver = '#DFCD7D';
var borderClick = '#FEFF8F';
getHighestScore();
function loadGame() {
    // Set limits depending on the level

    var minScore = 12 * Math.pow(2, level);
    var maxScore = 24 * Math.pow(2, level);
    var minVoltorb = 5 + level;
    var maxVoltorb = 7 + level;

    // Choose how many 2, 3 and voltorbs we will put in the grid

    var scoreList = new Array();
    var maxpowerscore = 0;
    levelScore = 1;
    while (levelScore < minScore) {
        var rnd = Math.round(2 + Math.random());
        while (levelScore * rnd > maxScore) rnd = Math.round(2 + Math.random());
        levelScore *= rnd;
        scoreList.push(rnd);
        maxpowerscore += rnd - 1;
    }

    var nbVoltorb = minVoltorb + Math.floor((maxVoltorb - minVoltorb) * Math.random());

    // Now build the grid (and they will come)

    var i;
    var j;
    var k;
    var gridok = 0;

    while (!gridok) {
        // A fresh new grid we have here...

        grid = new Array(new Array(1, 1, 1, 1, 1), new Array(1, 1, 1, 1, 1), new Array(1, 1, 1, 1, 1), new Array(1, 1, 1, 1, 1), new Array(1, 1, 1, 1, 1));

        // Put the scores in

        for (i = 0; i < scoreList.length; i++) {
            j = Math.floor(5 * Math.random());
            k = Math.floor(5 * Math.random());
            while (grid[j][k] != 1) {
                j = Math.floor(5 * Math.random());
                k = Math.floor(5 * Math.random());
            }
            grid[j][k] = scoreList[i];

            if (debugmode) document.getElementById('s' + j.toString() + k.toString()).innerHTML = scoreList[i];
        }

        // Put the voltorbs in

        for (i = 0; i < nbVoltorb; i++) {
            j = Math.floor(5 * Math.random());
            k = Math.floor(5 * Math.random());
            while (grid[j][k] != 1) {
                j = Math.floor(5 * Math.random());
                k = Math.floor(5 * Math.random());
            }
            grid[j][k] = 0;

            if (debugmode) document.getElementById('s' + j.toString() + k.toString()).innerHTML = '0';
        }

        // Here, we've got a nice grid to play with.
        // Calculate hints and check if it's ain't too easy

        var emptylinescore = 0;
        var emptyorfulllines = 0;
        var uselesslines = 0;

        for (i = 0; i < 5; i++) {
            var rowsumScore = 0;
            var rowsumVoltorb = 0;
            var colsumScore = 0;
            var colsumVoltorb = 0;
            for (j = 0; j < 5; j++) {
                rowsumScore += grid[i][j];
                if (grid[i][j] == 0) rowsumVoltorb++;
                colsumScore += grid[j][i];
                if (grid[j][i] == 0) colsumVoltorb++;
            }

            if (rowsumVoltorb == 0) {
                emptylinescore += rowsumScore - 5;
                emptyorfulllines++;
                uselesslines++;
            } else if (rowsumVoltorb == 5) {
                emptyorfulllines++;
                uselesslines++;
            } else if (rowsumScore + rowsumVoltorb == 5) uselesslines++;

            if (colsumVoltorb == 0) {
                emptylinescore += colsumScore - 5;
                emptyorfulllines++;
                uselesslines++;
            } else if (colsumVoltorb == 5) {
                emptyorfulllines++;
                uselesslines++;
            } else if (colsumScore + colsumVoltorb == 5) uselesslines++;

            document.getElementById('h' + i.toString() + '5').innerHTML = '<em>' + rowsumScore + '<' + '/em><br/><strong>' + rowsumVoltorb + '<' + '/strong>';
            document.getElementById('h5' + i.toString()).innerHTML = '<em>' + colsumScore + '<' + '/em><br/><strong>' + colsumVoltorb + '<' + '/strong>';
        }

        gridok = 1; // Assume this one is ok...

        if (emptylinescore > (maxpowerscore / 2)) gridok = 0; // Make sure we don't give the solution away
        if (uselesslines > 7 - level) gridok = 0; // Don't give too much useless lines, depending on the level
        if (emptyorfulllines > 2) gridok = 0; // Don't give too much empty nor full voltorb lines
        if ((level > 5) && (emptyorfulllines > 0)) gridok = 0; // Don't give empty nor full voltorb lines at all after level 5
        if ((level == 1) && (emptyorfulllines == 0)) gridok = 0; // Be a dear, let at least one empty line at first level
    }
}

function KeyPress(ev) {
    // Get the keycode (full-browsers edition)
    ev = ev || event;
    var c = 0;
    if (ev.which == null)
        c = ev.keyCode;
    else if (ev.which != 0 && ev.charCode != 0)
        c = ev.which;
    c -= 48; // Let it begin with 0
    if ((c < 0) || (c > 3)) return true;
    if ((x < 0) || (y < 0)) return true;

    // Get previous state
    var s = document.getElementById('s' + x.toString() + y.toString());
    var tmp = s.innerHTML;

    // And build the new one
    var nums = new Array('&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;');
    var i;
    for (i = 0; i < 4; i++) if (tmp.indexOf(i.toString()) >= 0) nums[i] = i;
    if (nums[c] == '&nbsp;') nums[c] = c; else nums[c] = '&nbsp;';
    tmp = '';
    for (i = 0; i < 4; i++) tmp += nums[i].toString() + ' ';
    s.innerHTML = tmp;
}

function initGame() {
    getHighestScore();
    var i;
    var j;

    document.onkeypress = KeyPress;
    x = -1;
    y = -1;
    wonScore = 0;

    document.getElementById('ingame').style.display = '';
    document.getElementById('gameover').style.display = 'none';
    document.getElementById('youwin').style.display = 'none';
    document.getElementById('needjavascript').style.display = 'none';

    document.getElementById('currentscore').innerHTML = 'Current Score: 0';
    document.getElementById('level').innerHTML = 'Level: ' + level;
    //document.getElementById('totalscore').innerHTML = 'Total Score: ' + totalScore;
    document.getElementById('highScore').innerHTML = 'Highest Score: ' + highestScore;

    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            var s = document.getElementById('s' + i.toString() + j.toString());
            s.className = 'squareboard';
            s.style.cursor = '';
            s.innerHTML = '';
            s.onmouseover = function () {
                if (this.className != 'squareboard') return true;
                var tmp = this.id.toString();
                x = tmp.substring(1, 2);
                y = tmp.substring(2, 3);
                this.style.borderColor = borderOver;
                borderOver = this.style.borderColor;
            }
            s.onmouseout = function () {
                if (this.className != 'squareboard') return true;
                x = -1;
                y = -1;
                this.style.borderColor = '#000';
            }
            s.onmousedown = function () {
                if (this.className != 'squareboard') return false;
                this.style.borderColor = borderClick;
                borderClick = this.style.borderColor;
                return false;
            }
            s.onmouseup = function () {
                if (this.className != 'squareboard') return false;
                if (this.style.borderColor != borderClick) return false;
                this.style.borderColor = borderOver;
                borderOver = this.style.borderColor;
                if ((x >= 0) && (y >= 0)) {
                    this.className = 'opensquareboard';
                    var v = grid[x][y];
                    if (v > 0) {
                        if (v === 3) {
                            this.innerHTML = "<img src='data:image/png;base64,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' width='50px' height='50px' style='padding-bottom: 10px;' />";
                        } else if (v === 2) {
                            this.innerHTML = "<img src='data:image/png;base64,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' width='50px' height='50px' style='padding-bottom: 10px;' />";
                        } else if (v === 1) {
                            this.innerHTML = "<img src='data:image/png;base64,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' width='50px' height='50px' style='padding-bottom: 10px;' />";
                        }
                    }
                    else {
                        this.innerHTML = "<img src='data:image/png;base64,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' width='50px' height='50px' style='padding-bottom: 10px;' />";
                    }
                    if (wonScore == 0) wonScore = 1;
                    wonScore *= v;
                    document.getElementById('currentscore').innerHTML = 'Current Score: ' + wonScore;
                    if (v == 0) gameOver();
                    if (wonScore == levelScore) youWin();
                }
                x = -1;
                y = -1;
            }
            s.onselectstart = function () { return false; }
        }
    }
    loadGame(); // When the board is ready, load up the values!
}

function disableBoard() {
    // Disable any input on the board.
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            var s = document.getElementById('s' + i.toString() + j.toString());
            s.onmousedown = '';
            s.onmouseup = '';
            s.onmouseout = '';
            s.onmouseover = '';
            s.style.borderColor = '';
            s.style.cursor = 'default';
        }
    }
}

function gameOver() {
    var i;
    var j;
    if (wonScore > highestScore) {
        highscoreObj = { highscore: wonScore }
        postHighestScore();
    }
    // Make sure we cannot get anything
    wonScore = 0;
    // One more failure...
    failedLevels++;
    // This changes the level if you've made too much failures.
    // The formula tells that you have 5 chances of failing at level 2, 4 at level 3 etc... and 0 at level 7.
    // If you fail, you then get to the last level that would let you have that much failures.
    // Example: you're at level 7, with 2 previous failures. If you fail again, you then have 3 failures.
    // According to the formula, you get back to the last level that would let you have 3 failures : level 4.
    // That means if you failed 6 times, you're doomed and must get back to the first level.
    level = level - Math.max(0, level + failedLevels - 7);
    // And if you're back (or stuck) to level 1, we start it all over.
    if (level == 1) failedLevels = 0;

    document.getElementById('ingame').style.display = 'none';
    document.getElementById('gameover').style.display = '';
    disableBoard(); // No more tries on this one, loser.
}

function youWin() {
    if (wonScore > highestScore) {
        highscoreObj = { highscore: wonScore }
        postHighestScore();
    }
    // Well done!
    totalScore += wonScore;
    wonScore = 0;

    // Update score (but not level yet, changed later)
    document.getElementById('level').innerHTML = 'Level: ' + level;
    //document.getElementById('totalscore').innerHTML = 'Total Score: ' + totalScore;

    level++;
    if (level > 7) level = 7; // No more than level 7.

    document.getElementById('ingame').style.display = 'none';
    document.getElementById('youwin').style.display = '';
    disableBoard(); // Stop it now, you're already a winner.
}

function showAnswer() {
    disableBoard(); // Be sure to make the board unplayable, you funny man!

    var i;
    var j;

    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            var s = document.getElementById('s' + i.toString() + j.toString());
            s.className = 'opensquareboard';
            var v = grid[i][j]
            if (v > 0) {
                if (v === 3) {
                    s.innerHTML = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSkUrDhYRcchQBcGCqIijVLEIFkpboVUHk0v/oElDkuLiKLgWHPxZrDq4OOvq4CoIgj8gri5Oii5S4ndJoUWMdxz38N73vtx9Bwj1MlPNjglA1SwjGYuKmeyqGHiFgAGaPRiTmKnHU4tpeI6ve/j4fhfhWd51f45eJWcywCcSzzHdsIg3iGc2LZ3zPnGIFSWF+Jx43KALEj9yXXb5jXPBYYFnhox0cp44RCwW2lhuY1Y0VOJp4rCiapQvZFxWOG9xVstV1rwnf2Ewp62kuE5rGDEsIY4ERMioooQyLERo10gxkaTzqId/yPEnyCWTqwRGjgVUoEJy/OB/8Lu3Zn5q0k0KRoHOF9v+GAECu0CjZtvfx7bdOAH8z8CV1vJX6sDsJ+m1lhY+Avq2gYvrlibvAZc7wOCTLhmSI/lpCfk88H5G35QF+m+B7jW3b81znD4AaerV8g1wcAiMFih73ePdXe19+7em2b8fhqFyr1nBuxgAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAhYWKBZ5BR6AAAAHlElEQVRo3tWZeXCU5RnAf++3m002m2zibiBNuLIJJYJIEFR0gHJDG84oUpzWCrZmEcc6jANamCI4NuM0HQaLUAIeIFdRrjJSKkp1OOSSMY2mApGsGKhJ2CwJm2uv7+0fYJItm2O/bAJ9/vuu531/+5zvs4IIy5KJQ9KkZCPgAV7IP1x0nm4QJdIKpeR3wERgKnB28YQh0/8vQYTA0eLSBOxbPGHImK4GERF3rXGDBTpljZQ82+J2OTAg/3CRO9Q3yQW5ZhCZQBQQEILL5bkFV7oVpE9B7novYhKQBjQAx4Btv9p9qpaAug0w3lxpWf7HRXnNm7enAnbgUeCeEKodArZIWFVhL6jpctfyIcxA+k1dJmAK8O67j454qbavdVVz8DC/BcQyoBRY3goEgE3eeH4uucA+ssst0n9DboZbikIgLsTjS3MOf2mNqaqNA1AUem+a/fBSYGGYy9QBwyrsBRe6zCLf5G64CGQbwRnicb+i+zOaAIvHDFquAQI96BXo1847nUy3Lls6HBpd2xhf/uGF/knrSq0U+5p/n3MJsQxNjCUQpaPYGp8brn4dXJbw8+/tBZ91iWtJl206sAgYFxQzfgOlVamUVCVS6IxjTUUsj5w4z5mhNi4bDeEuUwjMrLAXfBfxGJEu20+AVcDwjrxfU29m8q77uGSMDmudQVHq4WKfMqPSXlDfQffrmKjO9AShyNXAvHA2ZI5xMyIZLl3v2PsD9Cp/yPoPo9P/PQyYJexsj1gdkS7bMGAXYNPihjX1iSw/lsXOmtatYgDy+ruYcXcJZmNQ2dgEcqGwfNvQKRDpsuUAW4HYziQFv6qn6IqN41esfF0dzR63gdlmL5kJXrJ61HBfrzLiY9ytfX5MSjFdsZZWawKRLtsvgM03ksdtlzNSVSYqSRevhwUiXbbJwAc3+58fPBgMU0CXCrIOvKdBPdSdMJ8CPxUWh6dDBVG6bAOA3UEQymQwPgn6XiAEKHEQMx7EA90JMhbI75BFpMsWDZwGhjTnthwwjGil2SoB31u33C6v8HP0ZB3HTtRzttCL1wfDs6IYM9LE2NEmftSzU7V4mrA4DrQH8jKwIsgSMePb6BrPgW9T02Vjo2TH7mqeeq66zZ3s3WJlxs/MKNqapDIgU1gcDSFdS61K7w0sacYcCDFtnYkC4P+86eq6W2XR0u956rlqFsyL5siBnlwt6YOnPA1fZRpXS/ryyf6eTJ2kJ+eJKnbuqdZ8eiD4vBNsEemyrQ1q6gyLQJ/cSoWsA+8/QD3TdGvFa5Ws/GMd+7ZamTYlHp0udC5x16osfaWcN9708PXJVO4eEK0Fxgn0ERZHY5BFpMtmCaraysg2IKqgcU0QBIDXJ/lgRxIzs82tQgDExymseCmZARmC9/9Wo9UqScCcUK41N6jo6bJat0TjRuBWt8j7fTJTp8R3aBdWi47nF5jJ/3Mdfr/UCvN4KJCc4MRsCv2p958hIbRIv95RuOugoVEzyETpshmbQALOdOP/tuP4QnTOAReoxyNWFJwuP71TBaZYzec7vRpQRjWBKIoceksbov4dfGUtrt3g3RsxiPp6lU3b3SyYb9Kagm84jk4d1LKNvzdEbgHfWvDZbs4UvooYhNcreb2gik+PB1i/ytxZdfe0BOnb+nuOSEwfAaitUym56GH92y42bvGye7OVzB9Hd1p9S5AeXdUc5a26yrJXa4MPTxmCj/b0YMKYuDt3ZHrL8CDEAWDOLCODB8YgIjjnVG4ax99VIC8+3wNfZRrXHH358ngK77yRyPZdDWSNKuPgx+6IraO/4cPivBCyy6yi1wsSE3QkJugYPDCGWVPNbNp+jew5TvZulczK7lTAV7aMke/oRklM0PFbexIGg0LOL6twFMaQ1tegNdSLml1L8EV3n1sVBZ6cm8jIBxX2H+yEiwlONhdEa+klJGXdDWMyKeRMM7Frf61WFd8Ii6MsOGsJ9nIbJD5OoaZGc3zuDJV+t3c3hN8v2X+wjinjY7SqeOsWEGFxnEKKs1q0eTySOfMu88nRurC+23fgOgc+8pM9OV5LkL8vLA5HyIIoJa9pDDjqGyTjZ1ay+i9OrlUH2rXEe3treGy+i2fmRzPqofBnf1IVK9sePlTZjiAYHa7iiqt+lr5SwdvbvKT3E7z8YiIPDjfSKyWK2FiFgF9yrTrAuRIP72yrZvNfvcx9JIp1f0rhrsSw53/rhMXxbHtTlEzgC3747y8M8fkkh4/U8mq+i+On1TbfXZ1n5tdP3EWcKewu6Vu/R39vVEpJbbuTRlllW4hgrdYI9HgkhV81cOrzBo6daODsv/xkpCkMGWzgofuNPPxALL1SozQdY4BxwuI4Hc7IdAPwNHeSSDFPWEs3h9X91l+NfUb1K/vvIAx7axBtgpgyiwPemujHkGy+zQBe4DfC4tjQTuJsX1Rn+nKhyJW3AeIK8LiwOI52oAJ0TFRn+lihyDeBjG6C2IPELqwOZwdLWRix5rLFIsVihFxCJ//BakOKVb/ygq7nxQ/DrMkakofLliSlWCSEfDqC5/3PgNeFxfGexuZCu6jODJ1Q1GxgNjAJSAl381IVh0DsUJIuXujMXv4LxYGYdnJ3OxAAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==' width='50px' height='50px' style='padding-bottom: 10px;' />";
                } else if (v === 2) {
                    s.innerHTML = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSkUrDhYRcchQBcGCqIijVLEIFkpboVUHk0v/oElDkuLiKLgWHPxZrDq4OOvq4CoIgj8gri5Oii5S4ndJoUWMdxz38N73vtx9Bwj1MlPNjglA1SwjGYuKmeyqGHiFgAGaPRiTmKnHU4tpeI6ve/j4fhfhWd51f45eJWcywCcSzzHdsIg3iGc2LZ3zPnGIFSWF+Jx43KALEj9yXXb5jXPBYYFnhox0cp44RCwW2lhuY1Y0VOJp4rCiapQvZFxWOG9xVstV1rwnf2Ewp62kuE5rGDEsIY4ERMioooQyLERo10gxkaTzqId/yPEnyCWTqwRGjgVUoEJy/OB/8Lu3Zn5q0k0KRoHOF9v+GAECu0CjZtvfx7bdOAH8z8CV1vJX6sDsJ+m1lhY+Avq2gYvrlibvAZc7wOCTLhmSI/lpCfk88H5G35QF+m+B7jW3b81znD4AaerV8g1wcAiMFih73ePdXe19+7em2b8fhqFyr1nBuxgAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAhYWHgrkGNO6AAAHOklEQVRo3tWZe1BU1xnAf2cfwIKAIoIaLCIUjUkvrTHa1DGxSkyT1Fd0os1tM3aqrNG2o0m1NBlt7PRlTZ3ajHawJQPWW1smWELTzGhkxsakaoip3o4xiIogRkABkccuj72nf4ArG3Zld9lF+/1379n7nfOb73m+FYRYNmUrE6Xkj0An8NL2Mr2CYRBTqBVKyU+AbOBp4OTGecqC/0sQIajq9xgDlGycpzwWbhARctf6+oMCs+l1KVnX73UdkLm9TG/19k1yXk4ciMmAFXAJQW1dTt6VYQW5L8++uweeACYCDuB9QHu++EQbLkMDbH07vbL9sP7L24e3jwfswFLgAS+qqwT8WcKOenteS9hdywUjgUl9umLohdq7d+nM3LYvjN5xO3j4bj+IV4CLwBYfEABpsnf90+Q8+6ywWyRjT056qxSngBFelqufLfvv6KjGthEAJhMpBcseeRlYG+A27cC0enveubBZ5HzOngvAU1a45mU5VZ+e7ga8MGfq1iAgsIDFBKlhdS2pKZPqRhybfTbmVP0uaxMPCMNj/dP4aLpGRuMYE8vJhNjvBarfDLUS5l61570bFteSmrIAWA/M7f++W1q46BpNpSuOU0YMr7tsPHOsgvIvp1Friwh0m1PAonp7Xk3IY0RqyqPADuAhf37fYkQzv3EK1bbIgPaZKoyyM9K0sMGe1+Gn+/knhqbECdgJrAzkQHEmBzNiBNWGf7/PxOAXEfXMjrg0DVgkYH/I6ojUlGnAm0BaMG7YImPY4pjC3wzfrmUFfmW5wcLIauKEhxEKkKwV39YdQwKRmrIE2AdEDyUp9GBG7x7HB65RnDUiOGBYWWbqZrLoIsvcxlesdcQKn2c9CiwUqn4jKBCpKSpQ2Js87rqUS8g2qfrNgECkpswH3u6zel9EjYVRM8A2BnoccOMT6Dg1nDBHgG8IVe/0q45ITckEij0gorNg3JNgS+rlt0RD4nSInDScIHOA7X5ZRGpKJPAhoLhfxs6EUV/yrrqtBpoODXh9ubGL987e5ERlK8fPdZAUb+aRzFgenRrLVzNisVqG1B09LVT9ncFAtgBbPSyR+LBvla1V0FzmfnR0GRQcucbawnqfnyydFsVrz6cycUxksCA1wBSh3s5kwrNWZKUIZIU7Q1nHwdgnQfjoZKQBdYegu9YN8YM3qsg/2s76+XF8Z/YY0sdGMSLKRLdLUnejmyNnbvLDgqvE2wSHN2cwebwtWJiNQtVf8woiNWWXR1OXtASiRvvIpw5oPAadF92vtr11hdyiRko2pLDgoQRMPrznfJ2T53ZeAODQ5imMjA4qKV43EBPM6mmnR7BLTUnwqNpRmb4hOm/A1QMeEGcud5Bb1Mi+F8azaLpvCICMsVEUfn8S5TUuSj5sCtYiiSbks96y1gqPojci07clGv4J0rN4HTzdwrQUM8/MSPDrFPffZ+PVxQnsPtiAy5DBwnzLG8hiz/7Zh+82fTQAAiDWZiJ3yVhsEf7fDKanx1Be46LV4QoWJFtqWTZ302jsy7KB9GjHcV6FyHjPz7pawOl9TLV6XvLdqPYWiZwFHDb1jnBk1oA25GY5dNT1u2i0w/V/hfQUxyvbePx+K3HRlqB1iL47/y0NysDU2gnX3wZLIogod4oNlZy94uDnpc2UvjjhjonBD/EAmeC7bb0ecn9obu/hpb3VrJwVw3wlfsi37f4gScPl1G1OF7laDc1tBvlrJhBpDc2w0zKckdnudPHy/hrer+igdFMG40ZFhC7qb4VyuCFaHb0Qh/R2Sjelk54cFdr0dWtqE06IprYeXiy8xH8uOSndlD6U/sqbNLhBJFwWYYK42tzFC3+q4vpNFyUbv0haUmSot9DdlV30zo9CLlUNnSz/3Xm6eiRFGzLCAQFw/DaIqlf39fghrRPf3FZJamIEe9elMz4hIhwQ54WqX/58r1USKu3HzrUy59XzzHswhl2r0kiMs4Yr/P46oGmU8JdQaP7HyWa+trWKdU+MYpuaSpwtfAMYiXjD18WqHJge1NzKkBQcucbq/Dr+sDKZVXOTsJgFYZQioerLvU5RJPw6GI3OboPfvPUZq/Pr+Pv6FOzZyX5BVDV0suy353B2G0FYo99c4fMgJlUvBt4LVOmbx5vY+U4TJ7ZOYvHDCQg/DfFZUxfFHztpaQ/4PrLbpOqfDNai5AAfE8CItLvHoKFDMvOnF4Pv+vyXSwZi06ADOqHqFcBG7k3pAJab1dPtgw7o+gX+HmD1PQayUqh6obcFnz10qzlijYQD9xCE3RfEHUHiVnxkOMyWFUDBXQboAlYJVd8zyJV3cDE0ZbOAn90FiFrgOaHqR/24u/snhqY8JiAfSB8miGIJa0yq7tddO6DSa2hKtIAfAT9miP9g3UHOSNhgUvV3A5ymBJH3NSVRwnrRW3PGhAjgA+D3QtWLghwLBS+GlmUWyKeAZcDjwLgAVfxbwkEQ+03q6cqhnOV/eANtBrqrNtkAAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==' width='50px' height='50px' style='padding-bottom: 10px;' />";
                } else if (v == 1) {
                    s.innerHTML = "<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AYht+mSkUrDhYRcchQBcGCqIijVLEIFkpboVUHk0v/oElDkuLiKLgWHPxZrDq4OOvq4CoIgj8gri5Oii5S4ndJoUWMdxz38N73vtx9Bwj1MlPNjglA1SwjGYuKmeyqGHiFgAGaPRiTmKnHU4tpeI6ve/j4fhfhWd51f45eJWcywCcSzzHdsIg3iGc2LZ3zPnGIFSWF+Jx43KALEj9yXXb5jXPBYYFnhox0cp44RCwW2lhuY1Y0VOJp4rCiapQvZFxWOG9xVstV1rwnf2Ewp62kuE5rGDEsIY4ERMioooQyLERo10gxkaTzqId/yPEnyCWTqwRGjgVUoEJy/OB/8Lu3Zn5q0k0KRoHOF9v+GAECu0CjZtvfx7bdOAH8z8CV1vJX6sDsJ+m1lhY+Avq2gYvrlibvAZc7wOCTLhmSI/lpCfk88H5G35QF+m+B7jW3b81znD4AaerV8g1wcAiMFih73ePdXe19+7em2b8fhqFyr1nBuxgAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAhYWITqaH8kqAAAGO0lEQVRo3t2Za2xT5xmAn/ccH8ex05MrhXIJSagY15QBGrSdxhhpx8poaaHVqmlsk9ZYAu0HqqDtkJjYj20SEuu00c1UnVpaVm0FunWTOiZSrSqjlApBU6IVRptCgCZpnIuT2Il9zvn2A+o4xAk2sU2899853/U57/X7jpBh2VZXW6UUzwODwJO7GhrPkgPRMj2hUjwD1AFrgJNbV9WuzUsQEZoTHn3AX7auql2RbRDJuGmtXCDo2m+UYnPC61Zg9q6Gxt5kYyYH6k2QLwEGYItwqbU+cDmnIDMC9b+PIvcBVUAEOArs33jwvT5sZz9QeG2l7buONP58aPP+qYAfWA/MTzJ1s8DLCna3+QM9WTetGGICNdfm8gHfBPbtW7/s6b7K8t1DzsMPEyC2A58AO0aBAKhWV9s/mhzw35t1jdy5t35Wr5LTQFGS5guPNXxY7gn2FQFoGtNf3HD3T4BNaS7TDyxu8wfOZU0j5+v3fgw8UAgdSZpnNi6dFQdsWjFvx01A4AKXBjPH6qOPF6REmTX2kjNr9Hnt1WWa73an04tlDym6w2Mw93In0ds8/Hvu9CUxSc8IdLgErP3MH3g7K6ZVrMy1AlscWJn4fpJVhLTVEG0vw2o1sVp8PPLuWd5fVM2lQne6y5wGHmrzBy5m3EdKlfk1B3YrWJJK/5q+KbhfuIcLhQVprVPgdhoGotqD7f5AOEXzS02WWaXFZ3X7WRt+kM6G+ryfUzAN6ExxgNvBs7yFzjnHFrtgHX7+mLE8YipzscABBdU3Y4aVfVOxDi+nKzi6VtyAvTCIcdeHdHk/S2x60YFNfRKKjAukXJkPx+AVwDueoOCzPRRfWEDo09up6PDQ2e2mpDRKsHwAzx3dFMw8zxVve9KxBhyd4mhrm/Tu7psCMZX5XeClTES3DNRS71fZRt0HrmAoLZBSZd5vw9+v1T8A3KsWs4rVTJFphFU/JznBq3Iglzz/EljdI6HBlPKIqczZChridRLwfWcD92vrMKUEEAxxUyXVKBXhv9KcK5AqoHhw5+CbN8zsZcosAF5LLDk2spFl2jfQr+NWwFy5K9dW9uNyZa65IYgGTwO1Xzx/z1nPcpaPOmsUe/QlbbA+sRg4MED4t+GMkRjwO1OZhaOCVDol023YFs8dLOUr2tfH2KdNozoxXEuDitiZGJE/ROit6yU8K0z00SjqksoYSBhmFCvZPCpISJxn7IQw+221ZoQ5xTWh+jnEId6W4wA4HQ7hZ8P01vYSWRjBesPC2Gzgu+hD25Lxgyg9op6apEzPiMxerMwyErL2alZTLpOTThIkyH728BGtQ9pps7HfsjG2Gxj3GLhqXEOfSbLiKxUWPAbsGwbiwHckQRvLnEVJi/yY6udl9nBOWofb7XwD4w0jp17vgse/AIlvtUjJw4mdPOJLOvgIDSMgbpXEoM5zzek1gDlWWWG/qGHleJszsnLuUkH+Jv9googDrqWW8dU4SFC3Fl2fHF/RX+dzp2XorKl6OSgHmWjygSs2L+4jA7Dwen/soIOfar/gbrWAYlXEm9rxLPnsuGuw+XEQH1IZJnmcf1fOgDAhIRIKjKum1Y+aRJ6Llr0wfwtApinN+r8AcSk5m8cM7XGQQsXFfKUoVdIYBwkLp/IVpE3U8TjIGb3rQoWSljzkOD8goZZhtVa3qNfzjcKL/GnEeURI7SJsIkkE9cIIkKCE3qtU2sk8cvLXeiTUnPSE6FL8Ml9AZjj6zlGPuqf17gNlSt6Z6BACzx11dTaNeYuiwxPG1X+BE1U+/VbE+1QSuJFS7RRvCorak87s1n8swuvCcC7Nbc0G71+9uOa4UtFEWIOVXRI6ccN7LYBmrec5Bc/n0lZSkXIlm5JBjDnFr67cqR+u6D50zIg+OEFMyh+S0N4xi8ZksmXqeXtVp/loiZKXbuXuPUhUwY/GgkhZqV+2S3dc1OydsRxDGHB5AB7vl9ANI2lKV4Cn9K6fTXX0lQIf5wrChxy6TcmiVCDSPhy6lemdqbSt7eJsU+P8gzXGl21aGjOePOIOHs5CvBgupjIrpilty2VxngAmZciMjhUo+fUVrefPWQx8yWWFVaE36dEHYrBB4D4H7khnvAPHZjn6PzXk1VN657nx7OV/vI4SEGjCe48AAAAOZVhJZk1NACoAAAAIAAAAAAAAANJTkwAAAABJRU5ErkJggg==' width='50px' height='50px' style='padding-bottom: 10px;' />";
                }
            }
            else {
                s.innerHTML = "<img src='data:image/png;base64,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' width='50px' height='50px' style='padding-bottom: 10px;' />";
            }
        }
    }
    if (wonScore > highestScore) {
        highscoreObj = { highscore: wonScore }
        postHighestScore();
    }
}

function stopLevel() {
    // Okay we stop here. Score added, then displayed.
    totalScore += wonScore;
    document.getElementById('level').innerHTML = 'Level: ' + level;
    //document.getElementById('totalscore').innerHTML = 'Total Score: ' + totalScore;
    if (wonScore > highestScore) {
        highscoreObj = { highscore: wonScore }
        postHighestScore();
    }
    gameOver(); // And the game is then over.
}

function toggleDarkBG() {
    if (document.getElementById('darkbg').checked) {
        document.body.className = 'darkbg';
    } else {
        document.body.className = '';
    }
}
function callback(response) {
    highestScore = response.value;
}
function getHighestScore() {
    var geturl = document.getElementById('GetUrl').value;
    $.ajax({
        type: "GET",
        url: geturl,
        dataType: "json",
        /*        async: false,*/
        success: function (result) {
            callback(result);
        },
        error: function (req, status, error) {
            console.log(status)
        }
    });
}

function postHighestScore() {
    var posturl = document.getElementById('PostUrl').value;
    $.ajax({
        type: "POST",
        url: posturl,
        dataType: "json",
        data: highscoreObj,
        success: function (result) {
        },
        error: function (req, status, error) {
            console.log(status)
        }
    });
}