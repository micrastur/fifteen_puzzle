/**
 * Created by micrastur on 10.12.2016.
 */
"use strict";

class Game {
    constructor (name, gameContent) {
        let data = {
            name: name,
            defaultSize: [4, 4],
            blockElement: gameContent,
            reverseDirection: {
                left: 'right',
                top: 'bottom',
                right: 'left',
                bottom: 'top'
            },
            cellsElement: null
        };
        data.cells = data.defaultSize[0] * data.defaultSize[1];
        data.content = this.mixData(data.cells);
        this.count = 0;
        this.getData = data;
        this.moveCells;
        this.init();
    }

    init() {
        let gameData = this.getData,
            gameElement = gameData.blockElement,
            gameContent = gameData.content;


        document.getElementsByTagName('h1')[0].innerHTML = gameData.name;
        this.buildGame(gameElement, gameData.defaultSize);
        this.fillContent(gameContent);
        this.activateGame();
    }

    buildGame(element, size) {
        let wrapperElement = document.getElementById(element),
            scoreElement = document.createElement("div"),
            row = size[0],
            col = size[1],
            str = "";

        scoreElement.setAttribute('id', 'score');
        this.scoreElement = wrapperElement.parentNode.insertBefore(scoreElement, wrapperElement);
        this.scoreElement.innerHTML = '<h2>Scores: &nbsp;<span id="count">0</span></h2>';
        for (let i = 0; i < row; i++) {
            str += "<div class='row'>";
            for (let k = 0; k < col; k++) {
                str += "<div class='cell'></div>";
            }
            str += "</div>";
        }
        wrapperElement.innerHTML = str;
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

        return this.checkState(numbers, cellsAmount);
    }
    checkState(numbers, cellsAmount) {
        let comparableItems = Math.ceil((numbers.indexOf('')+1)/4);

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
        if(comparableItems % 2 !== 0){
            this.mixData(cellsAmount)
        }
        console.log(comparableItems + ': ' + numbers);
        return numbers;
    }
    fillContent(content) {
        this.getData.cellsElement = Array.prototype.slice.call(document.querySelectorAll('.cell'));
        let emptyElement,
            cellsElement = this.getData.cellsElement;
        for (let i = 0, len = content.length; i < len; i++){
            let contentItem = content[i],
                currentElement = cellsElement[i];

            if (!contentItem) {
                currentElement.id = "empty";
                emptyElement = currentElement;
            }
            currentElement.innerHTML = contentItem;
        }
    }
    activateGame() {
        let _self = this;
        document.onkeydown =  function (event) {
            _self.moveCells ? clearInterval(_self.moveCells) : false;
            let keyName = event.code.toLocaleLowerCase().replace('arrow', '');
            keyName = keyName === 'up' ? 'top' : keyName === 'down' ? 'bottom' : keyName;
            _self.move(null, keyName);
        };
        document.getElementById('game').onclick = function (event) {
            if(event.target !== this && !event.target.id){
                _self.move(event.target);
            }
        }
    }
    movements(el, elslist) {
        return {
            left: el.previousSibling,
            top: elslist[elslist.indexOf(el)-4],
            right: el.nextSibling,
            bottom: elslist[elslist.indexOf(el)+4]
        };
    };
    move(element, keyDirection) {
        let cellElements = this.getData.cellsElement,
            emptyElement = document.getElementById('empty'),
            moveObj = element
                ? this.movements(element, cellElements)
                : this.movements(emptyElement, cellElements);

        if (!element){
            let thisElement = moveObj[this.getData.reverseDirection[keyDirection]];
            thisElement ? this.replaceCells(thisElement, emptyElement,keyDirection) : false;

        } else {
            for (let key in moveObj){
                if(moveObj.hasOwnProperty(key) && moveObj[key] === emptyElement){
                    this.replaceCells(element, emptyElement, key);
                    return false;
                }
            }
        }
    }
    replaceCells(currentElement, emptyElement, direction){
        this.count += 1;
        let content = this.getData.content,
            contentElements = this.getData.cellsElement,
            elementsData = {
                current: [currentElement, currentElement.innerHTML],
                empty: [emptyElement, emptyElement.innerHTML]
            };

        this.moveCells = setTimeout(function(){
            currentElement.className = 'cell '+ direction;
            document.getElementById('count').innerHTML = this.count;
            for (let key in elementsData){
                if (elementsData.hasOwnProperty(key)){
                    let element = elementsData[key][0],
                        contraryElText = elementsData[key === 'current' ? 'empty' : 'current'][1];
                    element.innerHTML = contraryElText;
                    content[contentElements.indexOf(element)] = contraryElText;
                    element.id ? element.removeAttribute('id') : element.setAttribute('id', 'empty');
                    key === 'current' ? element.className = 'cell' : false;
                }
            }
            console.log(this.getData.content);
            this.checkWin(content);

        }.bind(this), 250);

        console.log(this.moveCells);
    }
    checkWin(content){
        let elements = this.getData.cellsElement,
            currentEl,
            win;
        for (let i = 0, len = content.length; i < len; i++){
            currentEl = elements[i];
           if(content[i] != i+1){
               currentEl.classList.remove('win-color');
           } else {
               win = true;
               currentEl.className += ' win-color';
           }
        }
        return win;
    }
}


(function () {
    window.onload = () => new Game('Fifteen Puzzle', 'game');
}());
