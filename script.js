/**
 * Created by micrastur on 10.12.2016.
 */
"use strict";

class Game {
    constructor (name, gameContent) {
        let savedContent = localStorage.getItem('content'),
            savedCount = localStorage.getItem('count'),
            data = {
                name: name,
                size: [4, 4],
                cells: 16,
                cellsElement: null,
                moveCells: false,
                blockId: gameContent,

                reverseDirection: {
                    left: 'right',
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top'
                },
                count: savedCount ? parseInt(savedCount) : 0
            };
        data.content = savedContent ? savedContent.split(',') : this.mixData(data.cells);
        this.gameData = data;
        this.init();
    }

    init() {
        let gameData = this.gameData,
            gameContent = gameData.content,
            winElement = document.getElementById('win');

        document.getElementsByTagName('h1')[0].innerHTML = gameData.name;
        this.buildGame(gameData.blockId, gameData.size);
        this.fillContent(gameContent, gameData.count);
        this.checkWinState(gameContent);
        this.activateGame();


        winElement.onclick = function() {
            winElement.style.display = 'none';
        }
    }

    buildGame(element, size) {
        let wrapperElement = document.getElementById(element),
            row = size[0],
            col = size[1],
            str = "";

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

        return this.checkResolution(numbers, cellsAmount);
    }
    checkResolution(numbers, cellsAmount) {
        let comparableItems = Math.ceil((numbers.indexOf('')+1)/4);

        for (let i = 0, len = numbers.length; i < len; i++){
            let currentItem = numbers[i];
            if(currentItem !== ''){
                for (let k = i+1; k < len; k++){
                    if(numbers[k] !== '' && currentItem > numbers[k]){
                        comparableItems += 1;
                    }
                }
            }
        }

        console.log(comparableItems + ': ' + numbers);
        return comparableItems % 2 !== 0 ? this.mixData(cellsAmount) : numbers;
    }
    fillContent(content, count) {
        this.gameData.cellsElement = Array.prototype.slice.call(document.querySelectorAll('.cell'));
        let emptyElement,
            cellsElement = this.gameData.cellsElement,
            countElement = document.getElementById('count');

        for (let i = 0, len = content.length; i < len; i++){
            let contentItem = content[i],
                currentElement = cellsElement[i];

            if (!contentItem) {
                currentElement.id = "empty";
                emptyElement = currentElement;
            }
            currentElement.innerHTML = contentItem;
        }
        countElement.innerHTML = count;
    }
    activateGame() {
        let _self = this, direction, element,
            launch = (event) => {
                let keyName = event.code;
                direction = keyName ? keyName.toLocaleLowerCase().replace('arrow', '') : false;

                if(!direction && !event.target.id) {
                    element = event.target;
                } else {
                    element = null;
                    direction = direction === 'up' ? 'top' : direction === 'down' ? 'bottom' : direction;
                }
                return _self.move(element, direction);
            };

        document.onkeydown =  function (event) {
            launch(event);
        };
        document.getElementById('game').onclick = function (event) {
            launch(event);
        };
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
        let gameData = this.gameData,
            cellElements = gameData.cellsElement,
            emptyElement = document.getElementById('empty'),
            replacedElement,
            moveObj = element
                ? this.movements(element, cellElements)
                : this.movements(emptyElement, cellElements),

            thisElement = element ? element : moveObj[gameData.reverseDirection[keyDirection]];

        if (!element){
            replacedElement = thisElement ? [thisElement, emptyElement, keyDirection] : false;
        } else {
            for (let key in moveObj){
                if(moveObj.hasOwnProperty(key) && moveObj[key] === emptyElement){
                    replacedElement = [thisElement, emptyElement, key];
                    break;
                }
            }
        }

        if(element || thisElement) {return this.replaceCells(replacedElement, gameData);}
    }
    replaceCells(replacedElement, data){


        let elementArgs = arguments[0],
            currentElement = elementArgs[0],
            emptyElement = elementArgs[1],
            direction = elementArgs[2],

            content = data.content,
            contentElements = data.cellsElement,
            elementsData = {
                current: [currentElement, currentElement.innerHTML],
                empty: [emptyElement, emptyElement.innerHTML]
            };
        if(!data.moveCells) {
            data.moveCells = true;
            currentElement.className = 'cell ' + direction;

            setTimeout(function () {
                data.count += 1;
                for (let key in elementsData) {
                    if (elementsData.hasOwnProperty(key)) {
                        let element = elementsData[key][0],
                            contraryElText = elementsData[key === 'current' ? 'empty' : 'current'][1];
                        element.innerHTML = contraryElText;
                        content[contentElements.indexOf(element)] = contraryElText;
                        element.id ? element.removeAttribute('id') : element.setAttribute('id', 'empty');
                        key === 'current' ? element.className = 'cell' : false;
                    }
                }
                document.getElementById('count').innerHTML = data.count;
                data.moveCells = false;
                return this.checkWinState(content) ? this.win(content) ? true : false : false;
            }.bind(this), 250);
        }
    }
    checkWinState(content){
        let elements = this.gameData.cellsElement, currentEl, currentElClassList, win = true, count = this.gameData.count;

        for (let i = 0, len = content.length - 1; i < len; i++){
            currentEl = elements[i];
            currentElClassList = currentEl.classList;
            if(content[i] != i+1){
                currentElClassList.remove('win-color');
                win = false;
            } else {
                if(!currentElClassList.contains('win-color')){
                    currentEl.className += ' win-color';
                }

            }
        }
        localStorage.setItem('content', content);
        localStorage.setItem('count', count);
        return win;
    }
    win(content){
        let count = this.count;
        document.getElementById('win').style.display = 'flex';
        document.getElementById('win-count').innerHTML = this.gameData.count;
        localStorage.removeItem('content');
        localStorage.removeItem('count');
        return true;

    }
}


(function () {
    window.onload = () => new Game('Fifteen Puzzle', 'game');
}());
