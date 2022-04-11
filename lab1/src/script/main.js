document.addEventListener("DOMContentLoaded", () => {
    "use strict";
    const canvasNext = document.querySelector(".canvas__next"),
        style = document.getElementById("style"),
        start = document.querySelector(".start"),
        score = document.querySelector(".score");


    class Draw{
        constructor(){
            this.figuresColor = { /*цвета фигур тетриса*/
                "1": "rgb(139, 0, 139)",
                "2": "rgb(255, 127, 80)",
                "3": "rgb(128, 0, 0)",
                "4": "rgb(142, 36, 241)",
                "5": "rgb(100, 149, 237)",
                "6": "rgb(127, 255, 212)",
                "7": "rgb(34, 139, 34)",
                "8": "rgb(100, 200, 34)"},
                this.canvas = document.getElementById('canvas'), /*доступ к холсту*/
                this.ctx = canvas.getContext("2d");
            this.ctx.strokeStyle = "black";
            this.ctx.lineWidth = 1;
        }

        drawAllFigures(map){
            let curX = 0, curY = -60;
            this.ctx.moveTo(curX, curY);
            for(let i of map){
                for(let j of i){
                    if(j > 0){
                        this.ctx.fillStyle = this.figuresColor[j];
                        this.ctx.fillRect(curX, curY, 30, 30);
                        this.ctx.strokeRect(curX, curY, 30, 30);
                    }
                    curX += 30;
                }
                curY += 30;
                curX = 0;
            }
        }

        drawSingleFigure(x, y, matrix){
            let curX = x, curY = y;
            this.ctx.moveTo(x, y);
            for(let i of matrix){
                for(let j of i){
                    if(j > 0){
                        this.ctx.fillStyle = this.figuresColor[j];
                        this.ctx.fillRect(curX, curY, 30, 30);
                        this.ctx.strokeRect(curX, curY, 30, 30);
                    }
                    curX += 30;
                }
                curY += 30;
                curX = x;
            }
        }

        clear(x = 0, y = 0 , w = 300, h = 600){
            this.ctx.clearRect(x, y, w, h);
        };
    };

    const toLocal = (nickname, score) => {
        let records = new Map(JSON.parse(localStorage.getItem("records")));
        if(records.has(nickname)){
            if(records.get(nickname) < score){
                records.set(nickname, score);
            }
        } else{
            records.set(nickname, score);
        }
        records = [...records.entries()].sort((a, b) => b[1]-a[1]);
        localStorage.setItem("records", JSON.stringify(records));
        return records;
    }

    const setRecordsTable = (newScore)=>{
        const username = localStorage.getItem('username');
        document.querySelector('.popup__records').style.display = 'flex';
        const records = toLocal(username, newScore);
        const popupItems = document.querySelector('.popup__table-item');
        records.forEach((item, index) => {
            popupItems.insertAdjacentHTML('beforeend', `
                <li class="${item[0] === username ? 'popup__you' : ''}">
                    <div class="popup__name">
                        <span>${index+1}.</span>
                        <h3>${item[0]}</h3>
                    </div>
                    <p class="popup__score">${item[1]}</p>
                </li>
            `);
        });
    };

    class Game{
        constructor(n = 10, m = 20){
            this.drawer = new Draw();
            this.matrixMap = this.createMap(n, m);
            this.speed = 25;
            this.nextIndex = 0;
            this.score = 0;
            this.curX = 4;
            this.curY = 0;
            this.curColor = "#000";
            this.curFigure = [];
            this.tetrominos = [ /*формы для фигур*/
                [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ],
                [
                    [1,0,0],
                    [1,1,1],
                    [0,0,0],
                ],
                [
                    [0,0,1],
                    [1,1,1],
                    [0,0,0],
                ],
                [
                    [1,1],
                    [1,1],
                ],
                [
                    [0,1,1],
                    [1,1,0],
                    [0,0,0],
                ],
                [
                    [1,1,0],
                    [0,1,1],
                    [0,0,0],
                ],
                [
                    [0,1,0],
                    [1,1,1],
                    [0,0,0],
                ],
                [
                    [0,0,0],
                    [1,1,1],
                    [0,0,0],
                ],
            ];

        }

        controll(){ /*движение фигуры в зависимости от нажатия клавиш*/
            document.addEventListener('keydown', e => {
                switch (e.key){
                    case "ArrowUp":
                        e.preventDefault();
                        const prevForm = this.curFigure;
                        this.rotate();
                        if(!this.isValidMove()){
                            this.curFigure = prevForm;
                        }
                        break;
                    case "ArrowDown":
                        e.preventDefault();
                        this.pushDown();
                        break;
                    case "ArrowLeft":
                        e.preventDefault();
                        this.curX--;
                        if(!this.isValidMove()){
                            this.curX++;
                        }
                        break;
                    case "ArrowRight":
                        e.preventDefault();
                        this.curX++;
                        if(!this.isValidMove()){
                            this.curX--;
                        }
                        break;
                };
            });
        }

        createMap (n, m){ /*создается пустое поле*/
            const arr = [];
            for(let i = 0; i < m + 2; i++){
                arr.push(new Array(n).fill(0));
            }
            return arr;
        }

        getRandomInt(min, max) { /*выдает случайное число*/
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
        }

        createNext(){ /*создается новая фигура*/
            this.nextIndex = this.getRandomInt(0, 8);
            this.curColor = this.drawer.figuresColor[this.nextIndex+1];
            canvasNext.className = canvasNext.className.replace(/T\d/, `T${this.nextIndex+1}`);
            style.textContent = `
                .block{
                    background: ${this.curColor};
                }
            `;
        }

        deleteRow(index){
            for(let i = index; i >= 2; i--){
                this.matrixMap[i] = [...this.matrixMap[i-1]];
            }
        }

        checkLine(){
            let counter = 0;
            this.matrixMap.forEach((item, index)=>{
                if(item.every((item)=> item > 0)){
                    this.deleteRow(index);
                    counter++;
                }
            });
            this.drawer.clear();
            this.drawer.drawAllFigures(this.matrixMap);
            this.setScore(counter);
        }

        rotate(){ /*вращение фигуры*/
            const N = this.curFigure.length - 1;
            this.curFigure = this.curFigure.map((row, i) =>
                row.map((val, j) => this.curFigure[N - j][i])
            );
        }

        pushDown(){ /*падения фигуры*/
            for(let i = this.curY; i < this.matrixMap.length; i++){
                this.curY++;
                if(!this.isValidMove()){
                    this.curY--;
                    return;
                }
            }
        }

        isValidMove(){ /*проверка на возможность быть фигуре на поле*/
            for(let i = 0; i < this.curFigure.length; i++){
                for(let j = 0; j < this.curFigure[i].length; j++){
                    if(!this.curFigure[i][j] ||
                        (this.curX + j >= 0 && this.curX + j < this.matrixMap[0].length) &&
                        (this.curY + i <= this.matrixMap.length) && (this.matrixMap[this.curY + i] && !this.matrixMap[this.curY + i][this.curX + j])){
                        continue;
                    }
                    else{
                        return false;
                    }
                }
            }
            return true;
        }

        setFigure(color){
            this.drawer.clear();
            this.drawer.drawAllFigures(this.matrixMap);
            this.drawer.drawSingleFigure(this.curX * 30, (this.curY-2) * 30, this.curFigure, color);
        }

        setScore(counter){ /*прибавка очков*/
            switch(counter){
                case 0:
                    this.score += 0
                    break;
                case 1:
                    this.score += 100
                    break;
                case 2:
                    this.score += 250
                    break;
                case 3:
                    this.score += 500
                    break;
                case 4:
                    this.score += 1000
                    break;
            }
            if(this.score >= 2500) { /*в зависимости от очков увеличивается скорость падения фигур*/
                this.speed = 14;
            }else if(this.score >= 2000){
                this.speed = 14;
            } else if(this.score >= 1500){
                this.speed = 17;
            }else if(this.score >= 1000){
                this.speed = 20;
            } else if(this.score >= 500){
                this.speed = 23;
            }
            score.textContent = this.score;
        }

        start(){
            let curSpeed = 0;
            let animateId;
            this.createNext();
            let color = this.curColor;
            this.curFigure = this.tetrominos[this.nextIndex];
            this.createNext();
            const animate = () => {
                animateId = requestAnimationFrame(animate);
                if(curSpeed++ >= this.speed){
                    this.setFigure(color);
                    curSpeed = 0;
                    this.curY++;
                    if(!this.isValidMove()){
                        this.curY--;
                        for(let i = 0; i < this.curFigure.length; i++){
                            for(let j = 0; j < this.curFigure[i].length; j++){
                                if(this.curFigure[i][j] > 0){
                                    this.matrixMap[i + this.curY][j + this.curX] = this.curFigure[i][j];
                                }
                            }
                        }
                        this.checkLine();
                        if(this.curY <= 1){
                            cancelAnimationFrame(animateId);
                            setRecordsTable(this.score);
                            return;
                        }
                        this.curFigure = this.tetrominos[this.nextIndex];
                        this.curY = 0;
                        this.curX = 4;
                        color = this.curColor;
                        this.createNext();
                    }
                }
            }
            animateId = requestAnimationFrame(animate);
        }
    };

    let logic;
    start.addEventListener('click', () => {
        logic = new Game();
        logic.controll();
        logic.start();
    });

    document.querySelector('.nickname').textContent = localStorage.getItem('username');
});