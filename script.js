
let bulletDamage = {
    Minigun:3,
    rpg:21,
    laser:70
}
const background = document.getElementById('background');
let hardnesLevel = 0;
let weaponIndex = 0;
let players = new Array();
let player; 
let playing = false;

function EnemyKilled(){
    player.startHealth *=1.05;
    player.health  = player.startHealth;
    player.createHealthLine();

    if(hardnesLevel===0){
        let enemy = new EasyEnemy(background);
    }else if(hardnesLevel===1){
        let enemy = new MiddleEnemy(background);
    }else{
        let enemy = new HardEnemy(background);
    }
    
}
class GameCore{
    backgroundTrack;
    ticks = 0;
    ticksToCreateBack;
    constructor(backgroundTrack){
        this.backgroundTrack = backgroundTrack;
        this.createBackground();
        setInterval(()=>this.tick.bind(this)(),1);
    }
    
    tick(){
        this.ticks++;
        
        if(this.ticks%10===0){
            this.createBackItem();
        }
    }
    createBackground(){
        let count = Math.random() * (100 - 20) + 20

        for (let index = 0; index < count; index++) {
            this.createBackItem();
        }
    }
    createBackItem(){
        let percent = Math.random() * 100;
        
        let x = Math.random() * window.innerWidth;
        let y = Math.random() * window.innerHeight;

        let position = {
            x:x,
            y:y
        }

        let element = document.createElement('div');

        new StarItem(element,this.backgroundTrack,position)
    }
    createEnemy(){

    }
}

class GameItem{
    backgroundTrack;
    ticks = 0;
    ticksToCreateBack;
    constructor(backgroundTrack){
        this.backgroundTrack = backgroundTrack;
        setInterval(()=>this.tick.bind(this)(),1);
    }
    
    tick(){
        this.ticks++;
        
        if(this.ticks%300===0){
            this.createBackItem();
        }
    }
}

class backgroundItem{
    item;
    background;
    position;
    constructor(item,background, position){
        this.item = item;
        this.background = background;
        this.position = position;
        this.createItem();
        this.processing();
    }

    createItem(){

    }
    processing(){

    }

}
class Rocket{
    item;
    itemInner;
    alive = true;
    enemyHolder;
    position;
    damage;
    startHealth = 100;
    health = 100;
    speed = 10;
    jets = new Array();
    Weapon = new Array();
    hpLine;
    constructor(enemyHolder){
        this.enemyHolder = enemyHolder;
        this.createItem();

        players.push(this);
    }

    createItem(){
        let element = document.createElement('div');
        element.classList = 'enemy hiden';

        let topPosition = Math.random() * window.innerHeight;
        element.style.top = `${topPosition}px`;

        this.position = {
            x:window.innerWidth,
            y:topPosition
        };
        this.item = element;

        let itemInner = document.createElement('div');
        itemInner.className = 'enemy-holder';

        this.itemInner = itemInner;
        this.createHealthLine();
        this.item.appendChild(itemInner);
        setTimeout(()=>{
            this.item.classList.remove('hiden');
        },100);
    }
    fireAnimation(){
        let i = 0;
        setInterval(() => {
            i++;
            for (const item of this.jets) {
                item.style.background = `url(assets/enemyBack/blaze/${i}.png)`;
            }
            if(i>=9){
                i=0;
            }
        }, 10);
    }
    getDamage(damage){
        this.health-=damage;
        console.log(this.health)


        let healthPercent =  1 - (this.startHealth-this.health)/this.startHealth;

        let damagePercent = 1 - (damage/(this.health+damage));
        this.hpLine.style.width = `${this.hpLine.clientWidth * damagePercent}px`;

        if(healthPercent<0.75){
            this.hpLine.style.background = 'yellow';
        }else if(healthPercent<0.5){
            this.hpLine.style.background = 'orange';
        }else if(healthPercent<0.25){
            this.hpLine.style.background = 'red';
        }

        if(this.health<0 && this.alive){
            this.alive = false;
            let i = 0;
            let interval = setInterval(() => {
                i++;

                this.item.style.background= `url(assets/boomItem/${i}.png)`;

                if(i>=11){
                    clearInterval(interval);
                }
            }, 40);
            try{
                let index = -1;
                for (let i = 0; i < players.length; i++) {
                    const element = players[i];
                    if(element==this){
                        index = i;
                    }
                }
                players.splice(index,1);
                background.removeChild(this.item);
            }catch{
                return;
            }

            if(this!=player){
                EnemyKilled();
            }
        }


    }
    createHealthLine(){
        try{
            this.itemInner.removeChild(this.hpLine);
        }catch{}

        let hpLine = document.createElement('div');
        hpLine.className = 'hpLine'
        this.hpLine = hpLine;
        this.itemInner.appendChild(hpLine);
    }
}
class Player extends Rocket{
    createItem(){
        super.createItem();

        this.startHealth = 100;
        this.damage = 5;

        this.width = 100;
        this.height = this.width*2;
        
        this.item.classList.add('player')

        this.item.style.height = `${this.height}px`;
        this.item.style.width = `${this.width}px`;

        this.item.style.background = `url(assets/enemyBack/player.png)`;

        let jet = document.createElement('div');
        jet.className='enemyJet';
        jet.style.height = '30px'
        jet.style.width = '30px'

        jet.style.top = `${this.height * 0.43}px`
        jet.style.left = `${this.width * 0.09 * -1}px`

        jet.style.transform = `rotate(180deg)`

        this.jets.push(jet);

        this.itemInner.appendChild(jet);

        this.enemyHolder.appendChild(this.item);
        this.CreateWeapon();
        super.fireAnimation();
    }
    getDamage(damage){
        super.getDamage(damage);
        if(this.health<0){
            playing = false;
        }
    }
    CreateWeapon(){
        this.Weapon.splice(0,this.Weapon.length)
        if(weaponIndex==2){
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '60%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Reslatron(rpg,1,this.item);
    
            this.Weapon.push(weapon2);
            return;
        }
        if(weaponIndex==0){
            let minigun = document.createElement('div');
            let minigun2 = document.createElement('div');
    
            minigun.style.position = 'absolute';
            minigun2.style.position = 'absolute';
    
            minigun.style.left = '80%';
            minigun2.style.left = '80%';
    
            minigun.style.top = '8%';
            minigun2.style.top = '88%';
    
            minigun.style.height = '10px';
            minigun2.style.height = '10px';
    
            minigun.style.width = '10px';
            minigun2.style.width = '10px';
    
            this.itemInner.appendChild(minigun);
            this.itemInner.appendChild(minigun2);
    
            let weapon1 = new Minigun(minigun,1,this.item);
            let weapon2 = new Minigun(minigun2,1,this.item);
    
            this.Weapon.push(weapon1);
            this.Weapon.push(weapon2);
        }
        if(weaponIndex==1){
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '0%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Rpg(rpg,1,this.item);
    
            this.Weapon.push(weapon2);
        }
    }

    Move(e) {
        let topPossition = this.item.offsetTop;
        let leftPosition = this.item.offsetLeft;
        let bottomPossition = topPossition + this.height;
        let rightPosition = leftPosition + this.width;

        console.log(e.key);

        if(e.key === 'ArrowUp' ){
            this.item.style.top = `${topPossition - this.speed}px`;
        }else if(e.key === 'ArrowDown'){
            this.item.style.top = `${topPossition + this.speed}px`;
        }else if(e.key === 'ArrowLeft'){
            this.item.style.left = `${leftPosition - this.speed}px`;
        }else if(e.key === 'ArrowRight'){
            this.item.style.left = `${leftPosition + this.speed}px`;
        }else if(e.key === ' '){
            for (const item of this.Weapon) {
                item.shoot();
            };
        }
        
    }
}
class EasyEnemy extends Rocket{
    
    createItem(){
        super.createItem();

        this.startHealth = 100;
        this.damage = 5;
        this.speed = 5;

        this.width = Math.floor(Math.random() *(120-90) + 90);
        this.height = this.width*2;
        

        this.item.style.height = `${this.height}px`;
        this.item.style.width = `${this.width}px`;

        this.item.style.background = `url(assets/enemyBack/easy/Untitled.png)`;

        let jet = document.createElement('div');
        jet.className='enemyJet';
        jet.style.height = '30px'
        jet.style.width = '30px'

        let secondJet = document.createElement('div');
        secondJet.className='enemyJet';
        secondJet.style.height = '30px'
        secondJet.style.width = '30px'

        jet.style.top = `${this.height * 0.30}px`
        secondJet.style.top = `${this.height * 0.55}px`

        jet.style.left = `${this.width * 0.55}px`
        secondJet.style.left = `${this.width * 0.55}px`

        this.jets.push(jet);
        this.jets.push(secondJet);

        this.itemInner.appendChild(jet);
        this.itemInner.appendChild(secondJet);

        this.enemyHolder.appendChild(this.item);
        this.CreateWeapon();
        super.fireAnimation();


        setTimeout(() => {
            this.processing();
        }, 500);
        
    }
    processing(){
        setInterval(() => {
            let topPlayerPosition = player.item.offsetTop;
            let fluctuation = Math.floor(Math.random() * (400) - 200);
            this.item.style.top = `${topPlayerPosition + fluctuation}px`;

        }, 500);
        setInterval(() => {
            let topPlayerPosition = player.item.offsetTop;
            let bottomPlayerPosition = topPlayerPosition + player.item.clientHeight;

            if(Math.abs(this.item.offsetTop-topPlayerPosition)<100 && Math.abs(this.item.offsetTop<bottomPlayerPosition)<100){
                for (const key of this.Weapon) {
                    key.shoot();
                }
            }
        }, 10);
    }
    CreateWeapon(){

        let weaponIndex = Math.floor(Math.random()*100);

        if(weaponIndex>25){
            let minigun = document.createElement('div');
            let minigun2 = document.createElement('div');
    
            minigun.style.position = 'absolute';
            minigun2.style.position = 'absolute';
    
            minigun.style.left = '0%';
            minigun2.style.left = '0%';
    
            minigun.style.top = '36%';
            minigun2.style.top = '58%';
    
            minigun.style.height = '10px';
            minigun2.style.height = '10px';
    
            minigun.style.width = '10px';
            minigun2.style.width = '10px';
    
            this.itemInner.appendChild(minigun);
            this.itemInner.appendChild(minigun2);
    
            let weapon1 = new Minigun(minigun,0,this.item);
            let weapon2 = new Minigun(minigun2,0,this.item);
    
            this.Weapon.push(weapon1);
            this.Weapon.push(weapon2);
        }
        else {
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '0%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Rpg(rpg,0,this.item);
    
            this.Weapon.push(weapon2);
        }
        
    }
}
class MiddleEnemy extends Rocket{
    
    createItem(){
        super.createItem();

        this.startHealth = 120;
        this.damage = 5;
        this.speed = 5;

        this.width = Math.floor(Math.random() *(110-70) + 70);
        this.height = this.width*2;
        

        this.item.style.height = `${this.height}px`;
        this.item.style.width = `${this.width}px`;

        this.item.style.background = `url(assets/enemyBack/easy/Untitled.png)`;

        let jet = document.createElement('div');
        jet.className='enemyJet';
        jet.style.height = '30px'
        jet.style.width = '30px'

        let secondJet = document.createElement('div');
        secondJet.className='enemyJet';
        secondJet.style.height = '30px'
        secondJet.style.width = '30px'

        jet.style.top = `${this.height * 0.30}px`
        secondJet.style.top = `${this.height * 0.55}px`

        jet.style.left = `${this.width * 0.55}px`
        secondJet.style.left = `${this.width * 0.55}px`

        this.jets.push(jet);
        this.jets.push(secondJet);

        this.itemInner.appendChild(jet);
        this.itemInner.appendChild(secondJet);

        this.enemyHolder.appendChild(this.item);
        this.CreateWeapon();
        super.fireAnimation();


        setTimeout(() => {
            this.processing();
        }, 500);
        
    }
    processing(){
        setInterval(() => {
            let topPlayerPosition = player.item.offsetTop;
            let fluctuation = Math.floor(Math.random() * (300) - 150);

            this.item.style.top = `${topPlayerPosition + fluctuation}px`;
        }, 500);
        setInterval(() => {
            let topPlayerPosition = player.item.offsetTop;
            let bottomPlayerPosition = topPlayerPosition + player.item.clientHeight;

            if(Math.abs(this.item.offsetTop-topPlayerPosition)<100 && Math.abs(this.item.offsetTop<bottomPlayerPosition)<100){
                for (const key of this.Weapon) {
                    key.shoot();
                }
            }
        }, 10);
    }
    CreateWeapon(){
        let weaponIndex = Math.floor(Math.random()*100);

        if(weaponIndex<25){
            let minigun = document.createElement('div');
            let minigun2 = document.createElement('div');
    
            minigun.style.position = 'absolute';
            minigun2.style.position = 'absolute';
    
            minigun.style.left = '0%';
            minigun2.style.left = '0%';
    
            minigun.style.top = '36%';
            minigun2.style.top = '58%';
    
            minigun.style.height = '10px';
            minigun2.style.height = '10px';
    
            minigun.style.width = '10px';
            minigun2.style.width = '10px';
    
            this.itemInner.appendChild(minigun);
            this.itemInner.appendChild(minigun2);
    
            let weapon1 = new Minigun(minigun,0,this.item);
            let weapon2 = new Minigun(minigun2,0,this.item);
    
            this.Weapon.push(weapon1);
            this.Weapon.push(weapon2);
        }
        else if (weaponIndex<75) {
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '0%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Rpg(rpg,0,this.item);
    
            this.Weapon.push(weapon2);
        } else{
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '-10%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Reslatron(rpg,0,this.item);
    
            this.Weapon.push(weapon2);
            return;
        }
        
    }
}
class HardEnemy extends Rocket{
    
    createItem(){
        super.createItem();

        this.startHealth = 150;
        this.damage = 5;
        this.speed = 5;

        this.width = Math.floor(Math.random() *(110-70) + 70);
        this.height = this.width*2;
        

        this.item.style.height = `${this.height}px`;
        this.item.style.width = `${this.width}px`;

        this.item.style.background = `url(assets/enemyBack/easy/Untitled.png)`;

        let jet = document.createElement('div');
        jet.className='enemyJet';
        jet.style.height = '30px'
        jet.style.width = '30px'

        let secondJet = document.createElement('div');
        secondJet.className='enemyJet';
        secondJet.style.height = '30px'
        secondJet.style.width = '30px'

        jet.style.top = `${this.height * 0.30}px`
        secondJet.style.top = `${this.height * 0.55}px`

        jet.style.left = `${this.width * 0.55}px`
        secondJet.style.left = `${this.width * 0.55}px`

        this.jets.push(jet);
        this.jets.push(secondJet);

        this.itemInner.appendChild(jet);
        this.itemInner.appendChild(secondJet);

        this.enemyHolder.appendChild(this.item);
        this.CreateWeapon();
        super.fireAnimation();


        setTimeout(() => {
            this.processing();
        }, 500);
        
    }
    processing(){
        setInterval(() => {
            let topPosition = this.item.offsetTop;
            let topPlayerPosition = player.item.offsetTop;

            if(Math.abs(topPosition-topPlayerPosition)>100){
                let fluctuation = Math.floor(Math.random() * (200) - 100);

                this.item.style.top = `${topPlayerPosition + fluctuation}px`;
            }

        }, 1000);
        setInterval(() => {
            let topPlayerPosition = player.item.offsetTop;
            let bottomPlayerPosition = topPlayerPosition + player.item.clientHeight;

            if(Math.abs(this.item.offsetTop-topPlayerPosition)<100 && Math.abs(this.item.offsetTop<bottomPlayerPosition)<100){
                for (const key of this.Weapon) {
                    key.shoot();
                }
            }
        }, 10);
    }
    CreateWeapon(){
        let weaponIndex = Math.floor(Math.random()*100);

        if(weaponIndex<15){
            let minigun = document.createElement('div');
            let minigun2 = document.createElement('div');
    
            minigun.style.position = 'absolute';
            minigun2.style.position = 'absolute';
    
            minigun.style.left = '0%';
            minigun2.style.left = '0%';
    
            minigun.style.top = '36%';
            minigun2.style.top = '58%';
    
            minigun.style.height = '10px';
            minigun2.style.height = '10px';
    
            minigun.style.width = '10px';
            minigun2.style.width = '10px';
    
            this.itemInner.appendChild(minigun);
            this.itemInner.appendChild(minigun2);
    
            let weapon1 = new Minigun(minigun,0,this.item);
            let weapon2 = new Minigun(minigun2,0,this.item);
    
            this.Weapon.push(weapon1);
            this.Weapon.push(weapon2);
        }
        else if (weaponIndex<50) {
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '0%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Rpg(rpg,0,this.item);
    
            this.Weapon.push(weapon2);
        } else{
            let rpg = document.createElement('div');
    
            rpg.style.position = 'absolute';
    
            rpg.style.left = '-10%';
    
            rpg.style.top = '50%';
    
            rpg.style.height = '10px';
    
            rpg.style.width = '10px';

            this.itemInner.appendChild(rpg);

            let weapon2 = new Reslatron(rpg,0,this.item);
    
            this.Weapon.push(weapon2);
            return;
        }
        
    }
}
class Weapon{
    item;
    avalible = true;
    debuff = 10;
    ammo;
    player;
    position;
    directions = {left:0,right:1}
    direction = 0;

    constructor(item,direction,player){
        this.item = item;
        this.direction = direction
        this.player = player;
        this.position = {
            x:this.getXposition(),
            y:this.getYposition()
        }
    }

    shoot(){
        if(this.avalible && player.alive){
            this.avalible = false;
            this.ammo.processing();
            setTimeout(()=>{
                this.avalible = true;
            },this.debuff)
        }
    }
    
    getXposition(){
        return this.player.offsetLeft+this.item.offsetLeft;
    }
    getYposition(){
        return this.player.offsetTop+this.item.offsetTop;
    }
}
class Rpg extends Weapon{
    constructor(item,direction,player){
        super(item,direction,player);

        this.debuff = 1000;
        this.ammo = new RpgBullet(bulletDamage.rpg,direction,this.position,background);
    }

    shoot(){
        this.position = {
            x:this.getXposition(),
            y:this.getYposition()
        }
        this.ammo = new RpgBullet(bulletDamage.rpg,this.direction,this.position,background);
        super.shoot();
    }


}
class Minigun extends Weapon{
    constructor(item,direction,player){
        super(item,direction,player);

        this.debuff = 100;
        this.ammo = new Bullet(bulletDamage.Minigun,direction,this.position,background);
    }

    shoot(){
        this.position = {
            x:this.getXposition(),
            y:this.getYposition()
        }
        this.ammo = new Bullet(bulletDamage.Minigun,this.direction,this.position,background);
        super.shoot();
    }


}
class Reslatron extends Weapon{
    constructor(item,direction,player){
        super(item,direction,player);

        this.debuff = 3000;
        this.ammo = new Laser(bulletDamage.laser,direction,this.position,background);
    }

    shoot(){
        this.position = {
            x:this.getXposition(),
            y:this.getYposition()- 5
        }
        this.ammo = new Laser(bulletDamage.laser,this.direction,this.position,background);
        super.shoot();
    }
}
class Ammo{
    damage;
    directions = {left:0,right:1}
    direction = 0;
    item;
    topPosition;
    leftPosition;
    speed = 2;
    holder;

    constructor(damage, direction, startPosition, holder){
        this.damage = damage;
        this.direction = direction;
        this.holder = holder;
        this.topPosition = startPosition.y;
        this.leftPosition = startPosition.x;
    }

    processing(){
        this.createItem();
        let interval = setInterval(() => {

            switch(this.direction){
                case this.directions.left:{
                    this.leftPosition-=this.speed;
                }break;
                case this.directions.right:{
                    this.leftPosition+=this.speed;
                }break;
            }


            this.item.style.left = `${this.leftPosition}px`;

            if(this.direction == this.directions.left){
                if(this.leftPosition>window.innerWidth/2){
                    return;
                }
            }else{
                if(this.leftPosition<window.innerWidth/2){
                    return;
                }
            }

            if(this.leftPosition < 0 || this.leftPosition> window.innerWidth){
                this.holder.removeChild(this.item);
                clearInterval(interval);
            }
            
            for (const item of players) {
                let leftPosition = item.item.offsetLeft;
                let topPosition = item.item.offsetTop;
                let rightPosition = leftPosition+item.item.clientWidth;
                let bottomPosition = topPosition + item.item.clientHeight;

                if(this.leftPosition > leftPosition && this.leftPosition<rightPosition && this.topPosition>topPosition && this.topPosition<bottomPosition){
                    this.holder.removeChild(this.item);
                    item.getDamage(this.damage);
                    this.makeHit();
                    clearInterval(interval);
                }
            }

        }, 10);
    }

    makeHit(){
        let animationDiv = document.createElement('div');
        animationDiv.className = 'animationDiv';

        animationDiv.style.left = `${this.leftPosition}px`;
        animationDiv.style.top = `${this.topPosition - 60}px`;

        background.appendChild(animationDiv);
        let i = 0;
        let interval = setInterval(() => {
            i++;

            animationDiv.style.background= `url(assets/boomItem/${i}.png)`;

            if(i>=11){
                background.removeChild(animationDiv);
                clearInterval(interval);
                
            }
        }, 40);
    }

    createItem(){
        
        let item =document.createElement('div');
        item.className = 'bullet';

        item.style.top = `${this.topPosition}px`;
        item.style.left = `${this.leftPosition}px`;

        this.item = item;
        this.holder.appendChild(item);
    }
}
class Laser extends Ammo{
    createItem(){
        super.createItem();

        this.speed = 0;

        this.item.style.height = `10px`
        this.item.style.width = '40px';
        this.item.classList.add('laser');

        this.item.style.background = 'red';
        setTimeout(() => {
            this.item.style.backgroundColor = 'white';
        }, 300);
        setTimeout(() => {
            this.speed = 80;
            this.item.style.width = '120px';
        }, 800);
    }
}
class RpgBullet extends Ammo{
    
    createItem(){
        super.createItem();

        this.speed = 20;

        this.item.style.height = `10px`
        this.item.style.width = '30px';

        this.item.style.background = 'url(assets/enemyBack/rocket.png)';
    }
}
class Bullet extends Ammo{
    
    createItem(){
        super.createItem();

        this.item.style.height = `2px`
        this.item.style.width = '5px';
        this.speed = 10;
        this.item.style.background = 'red';
    }
}
class StarItem extends backgroundItem{
    
    createItem(){
        this.height = Math.floor(Math.random() *(30-10) + 10);
        this.width = this.height;

        this.item.className = 'star';
        this.item.style.height = `${this.height}px`;
        this.item.style.width = `${this.width}px`;

        this.item.style.left =  `${this.position.x}px`
        this.item.style.top =  `${this.position.y}px`

        let rotate = Math.random() * 360;

        this.item.style.transform =  `rotateZ(${rotate}deg)`

        let ImageIndex = Math.floor(Math.random() * (8-1) + 1);

        this.item.style.background = `url(assets/starsBack/${ImageIndex}.png)`;

        this.background.appendChild(this.item);
    }
    processing(){
        let tick = 0;
        let tickRate = Math.floor(Math.random() * (15-5) +5);
        let ticksToBlink = Math.floor(Math.random() * (1000-500) +500);
        let interval = setInterval(() => {
            tick++;
            this.position.x-=1;
            this.item.style.left =  `${this.position.x}px`

            if(tick > Math.floor(ticksToBlink/tickRate)){
                ticksToBlink+=ticksToBlink;
                this.item.style.opacity =  0.2;
                setTimeout(() => {
                    this.item.style.opacity =  1;
                }, 500);
            }

            if(this.position.x<=0){
                this.background.removeChild(this.item);
                clearInterval(interval);
                
            }
        }, tickRate);
    }
}

document.addEventListener('DOMContentLoaded',()=>{

    const background = document.getElementById('background');
    const backgroundTrack = document.getElementById('backgroundTrack');

    new GameCore(backgroundTrack)
    
    document.addEventListener('keydown', (e)=>{if(playing)player.Move(e)});
    document.getElementById('startGame').addEventListener('click',()=>{
        for (let i = 0; i < players.length; i++) {
            const element = players[i];
            element.enemyHolder.removeChild(element.item);
        }
        players = new Array();
        player = new Player(background);
        new EasyEnemy(background);
        playing = true;
    });
    let weaponSelect =  document.getElementById('weapon');
    weaponSelect.addEventListener('change',()=>{
        weaponIndex = parseInt(weaponSelect.value);
        player.CreateWeapon();
    });

    let level =  document.getElementById('hardnes');
    level.addEventListener('change',()=>{
        hardnesLevel = parseInt(level.value);
    });
})


