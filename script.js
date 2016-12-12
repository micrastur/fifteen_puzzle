/**
 * Created by micrastur on 10.12.2016.
 */
"use strict";

class Game {
    constructor (name, gameContent) {
        let data = {
            name: name,
            defaultSize: [4, 4],
            blockElement: gameContent
        };
        data.cells = data.defaultSize[0] * data.defaultSize[1];
        data.content = this.mixData(data.cells);

        this.getData = function () {
            let dataCopy = data;
            return dataCopy;
        };
        this.init();
    }

    init() {
        let gameData = this.getData(),
            gameElement = gameData.blockElement,
            gameContent = gameData.content;

        console.log(gameData.content);

        document.getElementsByTagName('h1')[0].innerHTML = gameData.name;
        this.buildTable(gameElement, gameData.defaultSize);
        this.fillContent(gameContent);

    }

    buildTable(element, size) {
        let row = size[0],
            col = size[1],
            str = "";

        for (let i = 0; i < row; i++) {
            let item = i + 1;
            str += "<div class='row row-" + item + "'>";
            for (let k = 0; k < col; k++) {
                str += "<div></div>"
            }
            str += "</div>";
        }
        document.getElementById(element).innerHTML = str;
    }
    mixData(cellsAmount) {
        let numbers = [],
            mixNumbers = function mix(max){
                let item = Math.ceil(Math.random() * max);
                item = item === cellsAmount ? '' : item;
                return numbers.indexOf(item) === -1 ? item : mix(max);
            };

        for (let i = 0; i < cellsAmount; i++){
            let randomItem = mixNumbers(cellsAmount);
            numbers.push(randomItem);
        }

        return this.checkStage(numbers);
    }
    checkStage(numbers) {
        let comparableItems = 0;
        for (let i = 1, len = numbers.length; i < len; i++){
            let currentItem = numbers[i];
            if(currentItem !== ''){
                for (let k = i-1; k >= 0; k--){
                    if(numbers[k] !== '' && currentItem > numbers[k]){
                        comparableItems += 1;
                    }
                }
            }
        }

        console.log(comparableItems);
        if(comparableItems % 2 !== 0){
            let n = numbers[1];
            numbers[1] = numbers[2];
            numbers[2] = n;
        }
        return numbers;
    }
    fillContent(content) {
        let cellsElement = document.querySelectorAll('.row div');
        for (let i = 0, len = content.length; i < len; i++){
            cellsElement[i].innerHTML = content[i];
        }
    }
}


(function () {
    window.onload = () => new Game('Fifteen Puzzle', 'game');
}());

