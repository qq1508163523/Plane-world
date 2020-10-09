let planeWorld = {};

//planeWorld.enemy_bullet = [];
planeWorld.me_bullet = [];
planeWorld.enemy_list = [];
planeWorld.me = null;
planeWorld.gameStatus = false;
planeWorld.gameBoard = null;

planeWorld.init = function (enemy_number,gameBoard){
    planeWorld.gameBoard = gameBoard;
    let width = gameBoard.style.width;
    let height = gameBoard.style.height;
    let gap = Math.floor(width / enemy_number);
    for(let i = 0;i < enemy_number;i++){
        let newNode = planeWorld.constructNode(Math.floor(i * gap),10,true,"enemy");
        planeWorld.enemy_list.push(newNode);
    }
    planeWorld.me = planeWorld.constructNode(Math.ceil(width/2)-100,height - 200,true,"me");
    planeWorld.me.onmousemove = function (e){
        planeWorld.me.style.left = e.offsetX;
        planeWorld.me.style.top = e.offsetY;
    }
    planeWorld.gameStatus = true;
    planeWorld.refresher(); // run refresher
}

planeWorld.constructNode = function (x,y,isPlane,imageName){
    let node;
    if(isPlane){ // create plane
        node = document.createElement("img");
    }else{ // create bullet
        node = document.createElement("div");
        node.style.height = '7px';
        node.style.width = '7px';
        node.style.background = 'yellow';
        node.style.borderRadius = '7px';
        node.setAttribute("src","../img/"+imageName+".png");
    }
    node.style.position = 'absolute';
    node.style.top = y+'px';
    node.style.left = x+'px';
    planeWorld.gameBoard.appendChild(node); // add in game board
    return node;
}

planeWorld.refresher = function (){
     planeWorld.checker();
     planeWorld.producer();
     planeWorld.mover();

    if(planeWorld.gameStatus){
        window.setTimeout(planeWorld.refresher,15); // FPS 60
    }else{
        //game stop
    }
}

planeWorld.producer = function (){
    for(let i = 0;i < 3;i++){ // produce bullet
        let current_x = planeWorld.me.style.left;
        let current_y = planeWorld.me.style.top;
        let newBullet = planeWorld.constructNode(current_x,current_y,false,"");
        planeWorld.me_bullet.push(newBullet);
    }

    if(planeWorld.enemy_list.length < 10){
        let width = planeWorld.gameBoard.style.width;
        for(let i = 0,len = 10 - planeWorld.enemy_list.length;i < len;i++){
            let birth_x = Math.floor(Math.random() * 10 * Math.floor(width/10));
            let newEnemy = planeWorld.constructNode(birth_x,10,true,"enemy");
            planeWorld.enemy_list.push(newEnemy);
        }
    }
}

planeWorld.mover = function(){
    for(let i = 0,len = planeWorld.enemy_list.length;i < len;i++){
        let current_x = planeWorld.enemy_list[i].style.left;
        let current_y = planeWorld.enemy_list[i].style.top;
        let val = Math.random();
        let moveDistance = 5;
        if(val > 0.5){
            moveDistance = -5;
        }

        let width = planeWorld.gameBoard.style.width;
        if(current_x + moveDistance > width || current_x + moveDistance < 0){
            current_x += moveDistance * -1;
        }
        planeWorld.enemy_list[i].style.left = current_x+"px";
        planeWorld.enemy_list[i].style.top = (current_y + 5)+"px";
    }

    for(let i = 0,len = planeWorld.me_bullet.length;i < len;i++){
        let current_x = planeWorld.me_bullet[i].style.left;
        planeWorld.me_bullet[i].style.left = (current_x - 5)+"px";
    }
}

planeWorld.checker = function (){

    //me VS enemy
    for(let i = 0,len = planeWorld.enemy_list.length;i < len;i++){
        let enemy_x = planeWorld.enemy_list[i].style.left;
        let enemy_y = planeWorld.enemy_list[i].style.top;
        let me_x = planeWorld.me.style.left;
        let me_y = planeWorld.me.style.top;

        if(enemy_x - me_x <= 200 && enemy_y - me_y <= 200){
            planeWorld.gameStatus = false; // game over
        }
    }

    let enemy_death_list = [];
    let bullet_death_list = [];
    for(let i = 0,len = planeWorld.me_bullet.length;i < len;i++){
        let bullet_y = planeWorld.me_bullet[i].style.top;
        if(bullet_y <= 0){
            bullet_death_list.push(planeWorld.me_bullet[i]);
        }
    }

    planeWorld.remover(bullet_death_list); // remove bullet that out of game board


    for(let i = 0,len = planeWorld.me_bullet.length;i < len;i++){
        let bullet_x = planeWorld.me_bullet[i].style.left;
        let bullet_y = planeWorld.me_bullet[i].style.top;
        for(let k = 0,len2 = planeWorld.enemy_list.length;k < len2;k++){
            let enemy_x = planeWorld.enemy_list[k].style.left;
            let enemy_y = planeWorld.enemy_list[k].style.top;
            if(enemy_x - bullet_x <= 200 && enemy_y - bullet_y <= 200){
                bullet_death_list.push(planeWorld.me_bullet[i]);
                enemy_death_list.push(planeWorld.enemy_list[k]);
            }
        }
    }

    planeWorld.remover(bullet_death_list); // remove bullet that hit enemy
    planeWorld.remover(enemy_death_list); // remove enemy that hit by bullet
}

planeWorld.remover = function (list){
    for(let i = 0,len = list.length;i < len;i++){
        planeWorld.gameBoard.removeChild(list[i]);
    }
}