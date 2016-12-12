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

        this.getData = () => {
            let dataCopy = data;
            return dataCopy;
        };
        this.init();
    }

    init() {
        let gameData = this.getData(),
            gameElement = gameData.blockElement,
            gameContent = gameData.content;


        document.getElementsByTagName('h1')[0].innerHTML = gameData.name;
        this.buildTable(gameElement, gameData.defaultSize);
        this.fillContent(gameContent);
        this.activateGame();
    }

    buildTable(element, size) {
        let row = size[0],
            col = size[1],
            str = "";

        for (let i = 0; i < row; i++) {
            let item = i + 1;
            str += "<div class='row'>";
            for (let k = 0; k < col; k++) {
                str += "<div class='cell'></div>";
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
        console.log(numbers);
        if(comparableItems % 2 !== 0){
            let n = numbers[0];
            numbers[0] = numbers[1];
            numbers[1] = n;
        }
        console.log(numbers);
        return numbers;
    }
    fillContent(content) {
        let cellsElement = document.querySelectorAll('.cell');
        for (let i = 0, len = content.length; i < len; i++){
            let contentItem = content[i],
                currentElement = cellsElement[i];

            if (typeof contentItem !== "number") {
                currentElement.id = "empty"
            }
            currentElement.innerHTML = contentItem;
        }
    }
    activateGame() {
        let _self = this;
        document.onkeydown =  function (event) {
            let keyName = event.code.toLocaleLowerCase().replace('arrow', '');
            _self.move(null, keyName);
        };
        document.getElementById('game').onclick = function (event) {
            if(event.target !== this && !event.target.id){
                _self.move(event.target);
            }
        }
    }
    move(element, keyDirection) {
        let cellElements = Array.prototype.slice.call(document.getElementsByClassName('cell')),
            emptyElement = document.getElementById('empty'),
            emptyIndex = cellElements.indexOf(emptyElement),
            moveObj = element ? movements(element) : movements(emptyElement);

        if (!element){
            let reverseDir = {
                left: 'right',
                up: 'down',
                right: 'left',
                down: 'up'
            },
                thisElement = moveObj[reverseDir[keyDirection]];
            thisElement ? replaceCells(thisElement) : false;

        } else {
            for (let key in moveObj){
                if(moveObj.hasOwnProperty(key) && moveObj[key] === emptyElement){
                    replaceCells(element);
                }
            }
        }

        function replaceCells(currentElement){
            let currentValue = currentElement.innerHTML;
            currentElement.innerHTML = emptyElement.innerHTML;
            emptyElement.innerHTML = currentValue;

            currentElement.setAttribute('id', 'empty');
            emptyElement.removeAttribute('id');
        }

        function movements(el) {
            let direction = {
                left: el.previousSibling,
                up: cellElements[cellElements.indexOf(el)-4],
                right: el.nextSibling,
                down: cellElements[cellElements.indexOf(el)+4]
            };

            return direction;
        };

    }
}


(function () {
    window.onload = () => new Game('Fifteen Puzzle', 'game');
}());
