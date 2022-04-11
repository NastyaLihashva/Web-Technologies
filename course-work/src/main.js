function getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

const loadMap = async (path) => {
    let data = await fetch(path)
    data = await data.json();
    return data;
}

class mapManager {
    constructor(data) {
        this.mapData = data;
        this.tLayer = null;
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize = { x: this.mapData.tilewidth, y: this.mapData.tileheight };
        this.mapSize = { x: this.xCount * this.tSize.x, y: this.yCount * this.tSize.y };
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;
        this.tilesets = new Array();
        this.view = { x: 0, y: 0, w: 640, h: 475 }

        for (let i = 0; i < this.mapData.tilesets.length; i++) { //загрузка изображений
            const img = new Image();
            img.onload = () => {
                this.imgLoadCount++;
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true;
                }
            }
            img.src = this.mapData.tilesets[i].image;
            const t = this.mapData.tilesets[i];
            const ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                type: t.type,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y),
            }
            this.tilesets.push(ts);
        }
        this.jsonLoaded = true;
    }

    draw() {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.draw(); }, 100);
            return;
        }
        if (this.tLayer === null) {
            this.tLayer = this.mapData.layers.filter(item => item.type === "tilelayer");
        }
        this.tLayer.forEach(layer => {
            layer.data.forEach((item, i) => {
                if (item !== 0) {
                    const tile = this.getTile(item);
                    let pX = (i % this.xCount) * this.tSize.x;
                    let pY = Math.floor(i / this.xCount) * this.tSize.y;
                    if (this.isVisible(pX, pY, this.tSize.x, this.tSize.y)) {
                        pX -= this.view.x;
                        pY -= this.view.y;
                        ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                    }
                }
            });
        })
    }

    getTile(tileIndex) {
        const tile = {
            img: null,
            px: 0,
            py: 0
        };
        const tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        const id = tileIndex - tileset.firstgid;
        const x = id % tileset.xCount;
        const y = Math.floor(id / tileset.xCount);
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;
        return tile;
    }

    getTileset(tileIndex) {
        for (let i = this.tilesets.length - 1; i >= 0; i--) {
            if (this.tilesets[i].firstgid <= tileIndex) {
                return this.tilesets[i];
            }
        }
        return null;
    }


    isVisible(x, y, width, height) {
        if (x + width < this.view.x || x > this.view.x + this.view.w || y + height < this.view.y || y > this.view.y + this.view.h) {
            return false;
        }
        return true;
    }

    parseEntities(){ 
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.parseEntities();
            }, 100);
        } else
            for (let j = 0; j < this.mapData.layers.length; j++)
                if (this.mapData.layers[j].type === 'objectgroup') {
                    const entities = this.mapData.layers[j];
            for (let i = 0; i < entities.objects.length; i++) {
                const e = entities.objects[i];
                try {
                    const obj = Object.create(gameM.factory[e.type]);
                    obj.name = e.name;
                    obj.type = e.type;
                    obj.pos_x = e.x;
                    obj.pos_y = e.y;
                    obj.size_x = e.width;
                    obj.size_y = e.height;
                    gameM.entities.push(obj);
                    if (obj.name === 'Player') {
                        Player.move_x = 0;
                        Player.move_y = 0;
                        gameM.initPlayer(obj);
                    }
                } catch (ex) {
                    //console.log("Error while creating: [" + e.gid + "]" + e.type + " " + ex);
                }
            }
        }
    }

    getTilesetIdx(x, y){
        const wX = x;
        const wY = y;
        const idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor(wX / this.tSize.x);
        return [this.tLayer[0].data[idx], this.tLayer[1].data[idx]];
    }

    centerAt(x, y) {
        if (x < this.view.w / 2)
            this.view.x = 0;
        else
            if (x > this.mapSize.x - this.view.w / 2)
                this.view.x = this.mapSize.x - this.view.w;
            else
                this.view.x = x - (this.view.w / 2);
        if (y < this.view.h / 2)
            this.view.y = 0;
        else
            if (y > this.mapSize.y - this.view.h / 2)
                this.view.y = this.mapSize.y - this.view.h;
            else
                this.view.y = y - (this.view.h / 2);
    }
}

const Entity = {
    pos_x: 0, pos_y: 0,
    size_x: 0, size_y: 0,
    extend: function (extendProto) {
        let object = Object.create(this);
        for (let property in extendProto) {
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                object[property] = extendProto[property];
            }
        }
        return object;
    }
};


const Player = Entity.extend({
    life: 3,
    move_x: 0,
    move_y: 0,
    scores: 0,
    damage: 1,
    speed: 10,
    sprites: ['player_walk1', 'player_walk2'],
    animCounter: 0,
    draw: function () {
        this.animCounter++;
        spritesMan.drawSprite(this.sprites[this.animCounter % 2], this.pos_x, this.pos_y);
    },
    update: function () {
        physicManager.update(this);
    },
    onTouchEntity: function (obj) {
        switch (obj.type){
            case "Health":
                this.life += 1;
                life.textContent = this.life;
                gameM.kill(obj);
                soundManager.play('./sound/heal.mp3');
                break;
            case "Gold":
                this.scores += 100;
                score.textContent = this.scores;
                gameM.kill(obj);
                soundManager.play('./sound/gold.mp3');
                break;
            case "BulletEnemy":
                this.life -= 1;
                life.textContent = this.life;
                if(this.life <= 0){
                    alert("Game Over");
                    gameM.kill(this);
                    gameM = null;
                    soundManager.play('./sound/defeat.mp3');
                    setTimeout(() => soundManager.stopAll(), 1000);
                }
                soundManager.play('./sound/takeDamage.mp3');
                break;
        }
    },
    fire: function () {
        const r = Object.create(Bullet);
        soundManager.play('./sound/shot.mp3');
        r.size_x = 10;
        r.size_y = 10;
        r.name = "Bullet" + (++gameM.bulNum);
        r.move_x = this.move_x;
        r.move_y = this.move_y;
        switch (this.move_x + 2 * this.move_y) {
            case -1:
                r.pos_x = this.pos_x - r.size_x;
                r.pos_y = this.pos_y;
                break;
            case 1:
                r.pos_x = this.pos_x + this.size_x;
                r.pos_y = this.pos_y;
                break;
            case -2:
                r.pos_x = this.pos_x;
                r.pos_y = this.pos_y - r.size_y;
                break;
            case 2:
                r.pos_x = this.pos_x;
                r.pos_y = this.pos_y + this.size_y;
                break;
            default:
                return;
        }
        gameM.entities.push(r);
    }
});

const Enemy = Entity.extend({
    life: 3,
    move_x: 0,
    move_y: 0,
    speed: 2,
    directionCounter: 29,
    animCounter: 0,
    sprites: ['zombie_walk1', 'zombie_walk2'],
    randomDirection: function() {
        switch (getRand(0, 4)) {
            case 0:
                this.move_x = 1;
                this.move_y = 0;
                break;
            case 1:
                this.move_x = -1;
                this.move_y = 0;
                break;
            case 2:
                this.move_y = 1;
                this.move_x = 0;
                break;
            case 3:
                this.move_y = -1;
                this.move_x = 0;
                break;
        }
    },
    draw: function () {
        this.animCounter++;
        spritesMan.drawSprite(this.sprites[this.animCounter % 2], this.pos_x, this.pos_y);
        this.directionCounter++;
        if (this.directionCounter === 30){
            this.directionCounter = 0;
            this.randomDirection();
        }
        if(this.directionCounter % 15 === 0){
            this.fire();
        }
    },
    update: function(){
        physicManager.update(this);
    },
    onTouchEntity: function (obj) {
        switch (obj.type) {
            case "Bullet":
                this.life -= gameM.player.damage;
                if(this.life <= 0){
                    gameM.kill(this);
                    gameM.player.scores  += 200;
                    score.textContent = gameM.player.scores;
                    soundManager.play('./sound/defeat.mp3');
                }
                break;
            default:
                this.randomDirection();
        }
    },
    onTouchMap: function(){
        this.randomDirection();
    },
    fire: function () {
        const r = Object.create(Bullet);
        r.size_x = 10;
        r.size_y = 10;
        r.name = "Bullet" + (++gameM.bulNum);
        r.move_x = this.move_x;
        r.move_y = this.move_y;
        r.type = "BulletEnemy";
        switch (this.move_x + 2 * this.move_y) {
            case -1:
                r.pos_x = this.pos_x - r.size_x;
                r.pos_y = this.pos_y;
                break;
            case 1:
                r.pos_x = this.pos_x + this.size_x;
                r.pos_y = this.pos_y;
                break;
            case -2:
                r.pos_x = this.pos_x;
                r.pos_y = this.pos_y - r.size_y;
                break;
            case 2:
                r.pos_x = this.pos_x;
                r.pos_y = this.pos_y + this.size_y;
                break;
            default:
                return;
        }
        gameM.entities.push(r);
    }
});

const Bullet = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 20,
    type: 'Bullet',
    draw: function () {
        if(this.move_x === 1)
            spritesMan.drawSprite(`bullet_right`, this.pos_x, this.pos_y);
        else if (this.move_x === -1)
            spritesMan.drawSprite(`bullet_left`, this.pos_x, this.pos_y);
        else if (this.move_y === 1)
            spritesMan.drawSprite(`bullet_down`, this.pos_x, this.pos_y);
        else if (this.move_y === -1)
            spritesMan.drawSprite(`bullet_up`, this.pos_x, this.pos_y);
    },
    update: function () {
        physicManager.update(this);
    },
    onTouchMap: function () {
        gameM.kill(this);
    },
    onTouchEntity: function (obj) {
        switch (obj.type) {
            case "Enemy":
                obj.onTouchEntity(this);
                gameM.kill(this);
                break;
            case "Player":
                obj.onTouchEntity(this);
                gameM.kill(this);
                break;
            default:
                gameM.kill(this);
        }
    },

});

const Gold = Entity.extend({
    draw: function () {
        spritesMan.drawSprite("gold", this.pos_x, this.pos_y);
    },
    update: () => {
    }
});


const Health = Entity.extend({
    draw: function () {
        spritesMan.drawSprite("health", this.pos_x, this.pos_y);
    },
    update: () => {
    }
});


class spriteManager{
    constructor(){
        this.image = new Image();
        this.sprites = [];
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }

    loadAtlas(atlasJson, atlasImg) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseAtlas(request.responseText);
            }
        };
        request.open("GET", atlasJson, true);
        request.send();
        this.loadImg(atlasImg);
    }

    loadImg(imgName) {
        this.image.onload = () => {
            this.imgLoaded = true;
        };
        this.image.src = imgName;
    }

    parseAtlas(atlasJSON) {
        let atlas = JSON.parse(atlasJSON);
        for (let name in atlas.frames) {
            let frame = atlas.frames[name].frame;
            this.sprites.push({ name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h });
        }
        this.jsonLoaded = true;
    }

    drawSprite(name, x, y) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                this.drawSprite(name, x, y);
            }, 80);
        } else {
            let sprite = this.getSprite(name);
            if (!level1.isVisible(x, y, sprite.w, sprite.h))
                return;
            x -= level1.view.x;
            y -= level1.view.y;
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.w, sprite.h);
        }
    }

    getSprite(name) {
        for (let i = 0; i < this.sprites.length; i++) {
            let s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null;
    }
};

class eventsManager{
    constructor(){
        this.bind = [];
        this.action = [];
    }

    setup(){
        this.bind[87] = 'up';
        this.bind[83] = 'down';
        this.bind[65] = 'left';
        this.bind[68] = 'right';
        this.bind[32] = 'fire';
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    }
    
    kill(){
        document.body.removeEventListener("keydown", this.onKeyDown);
        document.body.removeEventListener("keyup", this.onKeyUp);
    }

    onKeyDown = (event) => {
        let action = this.bind[event.keyCode];
        if (action && action !== 'fire') {
            this.action[action] = true;
        }
        
    }

    onKeyUp = (event) => {
        let action = this.bind[event.keyCode];
        if (action && action !== 'fire')
            this.action[action] = false;
        else if (action === 'fire' ) {
            this.action[action] = true;
            setTimeout(() => this.action[action] = false, 100);
        }
    }

};

class PhysicManager{
    constructor(){
    }
    update(obj) { 
        let newX = obj.pos_x + Math.floor(obj.move_x * (obj.speed));
        let newY = obj.pos_y + Math.floor(obj.move_y * (obj.speed));

        let ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2 );
        if(obj.type === "Player") {
            if (obj.move_x === 0 && obj.move_y === 0)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2);

            if (obj.move_y === 1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2 + 10);

            if (obj.move_x === 1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2 + 8, newY + (obj.size_y) / 2);

            if (obj.move_x === -1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2 - 8, newY + (obj.size_y) / 2);

            if (obj.move_y === -1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2 - 7);
        }
        if(obj.type === "Enemy"){
            if (obj.move_x === 0 && obj.move_y === 0)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2);

            if (obj.move_y === 1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2 + 20);

            if (obj.move_x === 1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2 + 15, newY + (obj.size_y) / 2 );

            if (obj.move_x === -1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2 - 15, newY + (obj.size_y) / 2 );

            if (obj.move_y === -1)
                ts = level1.getTilesetIdx(newX + (obj.size_x) / 2, newY + (obj.size_y) / 2 - 20);
        }

        let e = this.entityAtXY(obj, newX, newY);
        if (e !== null && obj.onTouchEntity){
            obj.onTouchEntity(e);
        }

        if (ts[1] === 1960 && obj.type === "Player"){
            if (levelNum === 1) {
                if (confirm("Вы уверены, что хотите перейти на следующий уровень?")) {
                    soundManager.play('./sound/win.mp3');
                    Player.scores = gameM.player.scores;
                    Player.life = gameM.player.life;
                    Player.damage = gameM.player.damage;
                    eventMan.kill();
                    eventMan = new eventsManager();
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    clearInterval(interval);
                    gameM = new gameManager('./json/level2.json');
                    return;
                }
            }
            else {

                if (confirm("Вы уверены, что хотите закончить игру?") ) {
                    soundManager.play('./sound/win.mp3');
                    setTimeout(() => soundManager.stopAll(), 3000);
                    setRecordsTable(gameM.player.scores);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    clearInterval(interval);
                    return;
                }
            }
        }
        if (
            (((ts[0] !== 578 || ts[1] !== 0 ) && levelNum === 1) ||
            ((ts[0] !== 138 || ts[1] !== 0) && levelNum === 2)) && obj.onTouchMap) {
                obj.onTouchMap(ts);
        }
        
        if (((ts[0] === 578 && ts[1] === 0) || (ts[0] === 138 && ts[1] === 0)) && e === null) {
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else {
            return "break";
        }
        return "move";
    }

    entityAtXY(obj, x, y) {
        for (let i = 0; i < gameM.entities.length; i++) {
            let e = gameM.entities[i];
            if (e.name !== obj.name) {
                if (x + obj.size_x < e.pos_x || y + obj.size_y < e.pos_y || x > e.pos_x + e.size_x || y > e.pos_y + e.size_y)
                    continue;
                return e;
            }
        }
        return null;
    }
}


class SoundManager{
    constructor(){
        this.clips = {};
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
        this.loaded = false;
        this.gainNode.connect(this.context.destination);
    }

    load(path, callback) {
        if (this.clips[path]) {
            callback(this.clips[path]);
            return;
        }
        const clip = { path: path, buffer: null, loaded: false };
        clip.play = function (volume, loop) {
            this.play(this.path, { looping: loop ? loop : false, volume: volume ? volume : 1 });
        };
        this.clips[path] = clip;
        const request = new XMLHttpRequest();
        request.open("GET", path, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
        this.context.decodeAudioData(request.response, function (buffer) {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    }

    loadArray(array) {
        for (let i = 0; i < array.length; i++) {
        this.load(array[i], () => {
                if (array.length === Object.keys(this.clips).length) {
                    for (const sd in this.clips)
                        if (this.clips[sd].loaded) return;
                    this.loaded = true;
                }
            });
        }
    }

    play(path, settings) {
        if (this.loaded) {
            setTimeout(() => {this.play(path, settings);}, 1000);
            return;
        }
        let looping = false;
        let volume = 1;
        if (settings) {
            if (settings.looping)
                looping = settings.looping;
            if (settings.volume)
                volume = settings.volume;
        }
        const sd = this.clips[path];
        if (sd === null) return false;
        const sound =this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }

    stopAll() {
        this.gainNode.disconnect();
    }
};


class gameManager{
    constructor(path){
        this.factory = {};
        this.entities = [];
        this.bulNum = 0;
        this.player = null;
        this.laterKill = [];
        loadMap(path).then((data) => {
            level1 = new mapManager(data);
            spritesMan.loadAtlas("./img/sprites/spritesheet.json", "./img/sprites/spritesheet.png");
            this.factory['Player'] = Player;
            this.factory['Enemy'] = Enemy;
            this.factory['Gold'] = Gold;
            this.factory['Health'] = Health;
            level1.parseEntities();
            level1.draw();
            levelNum++;
            eventMan.setup();
            this.play();
        });
    }
    
    initPlayer(obj){
        this.player = obj;
    }
    kill(obj) {
        this.laterKill.push(obj);
    }
    update(){
        if (this.player === null)
            return;
        this.player.move_x = 0;
        this.player.move_y = 0;

        if (eventMan.action["up"]) {
            this.player.move_y = -1;
        }
        if (eventMan.action["down"]) {
            this.player.move_y = 1;
        }
        if (eventMan.action["left"]) {
            this.player.move_x = -1;
        }
        if (eventMan.action["right"]) {
            this.player.move_x = 1;
        }
        if (eventMan.action["fire"])
            this.player.fire();

        this.entities.forEach((e) => {
            try {
                e.update();
            } catch (ex) {
                console.log(e, ex);
            }
        });
        for (let i = 0; i < this.laterKill.length; i++) {
            let idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.entities.splice(idx, 1);
        }
        if (this.laterKill.length > 0)
            this.laterKill.length = 0;
        level1.draw();
        level1.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw();
    }
    draw() {
        for (let e = 0; e < this.entities.length; e++) {
            this.entities[e].draw();
        }
    }
    play(){
        interval = setInterval(() => this.update(), 100);
    }
};

const toLocal = (nickname, score) => {
    let records = new Map(JSON.parse(localStorage.getItem("records")));
    if (records.has(nickname)) {
        if (records.get(nickname) < score) {
            records.set(nickname, score);
        }
    } else {
        records.set(nickname, score);
    }
    records = [...records.entries()].sort((a, b) => b[1] - a[1]);
    localStorage.setItem("records", JSON.stringify(records));
    return records;
}

const setRecordsTable = (newScore) => {
    const username = localStorage.getItem('username');
    document.querySelector('.popup__records').style.display = 'flex';
    const records = toLocal(username, newScore);
    const popupItems = document.querySelector('.popup__table-item');
    records.forEach((item, index) => {
        popupItems.insertAdjacentHTML('beforeend', `
            <li class="${item[0] === username ? 'popup__you' : ''}">
                <div class="popup__name">
                    <span>${index + 1}.</span>
                    <h3>${item[0]}</h3>
                </div>
                <p class="popup__score">${item[1]}</p>
            </li>
        `);
    });
};


let gameM;
let level1;
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score");
const life = document.querySelector(".life");
let levelNum = 0;
let interval;

const spritesMan = new spriteManager();
let eventMan = new eventsManager();
const physicManager = new PhysicManager();
const soundManager = new SoundManager();
soundManager.loadArray(['./sound/bg.mp3', './sound/defeat.mp3','./sound/win.mp3', './sound/shot.mp3', './sound/enemyDeath.mp3', './sound/takeDamage.mp3', './sound/heal.mp3', './sound/gold.mp3']);

const form = document.querySelector('.name');
const input = document.querySelector('.input');
form.addEventListener('submit', e => {
    e.preventDefault();
    if (input.value.trim() === "") {
        alert("Введите имя пользователя!");
    } else {
        localStorage.setItem('username', input.value);
        document.querySelector(".overlay").style.display = 'none';
        soundManager.play('./sound/bg.mp3', { looping: true, volume: 1 });
        gameM = new gameManager('./json/level1.json');
    }
});