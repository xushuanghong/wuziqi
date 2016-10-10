$(function() {
    var canvas = $('#canvas');
    var ctx = canvas.get(0).getContext('2d');
    var black=$('.black');
    var white=$('.white');
    var ROW = 15;
    var width = canvas.width();
    var off = width / ROW;
    $('.renji').on('click', function() {
        var ai = false;
        ai = !ai;
        function handleClick(e) {
            var position = {
                x: Math.round((e.offsetX - off / 2) / off),
                y: Math.round((e.offsetY - off / 2) / off)
            };
            if (blocks[v2k(position)]) {
                return;
            }
            if (ai) {
                drawChess(position, 'black');
                if (check(position, 'black') > 5) {
                    black.css('display',"block")
                    $(canvas).off('click');
                    if (confirm('是否生成棋谱？')) {
                        review();
                    }
                    return;
                }
                drawChess(AI(), 'white')
                if (check(position, 'white') >= 5) {
                    white.css('display',"block")
                    $(canvas).off('click');
                    if (confirm('是否生成棋谱？')) {
                        review();
                    }
                    return;
                }
                return;
            }
        }
        $(canvas).on('click', handleClick);
    });
    $('.renren').on('click', function() {
        var flag = true;
        function handleClick(e) {
            var position = {
                x: Math.round((e.offsetX - off / 2) / off),
                y: Math.round((e.offsetY - off / 2) / off)
            };
            if (blocks[v2k(position)]) {
                return;
            }
            if (flag) {
                drawChess(position, 'black');
                if (check(position, 'black') >= 5) {
                    alert('黑棋赢了');
                    $(canvas).off('click');
                    if (confirm('是否生成棋谱？')) {
                        review();
                    }
                    return;
                }
            } else {
                drawChess(position, 'white');
                if (check(position, 'white') >= 5) {
                    alert('白棋赢了');
                    $(canvas).off('click');
                    if (confirm('是否生成棋谱？')) {
                        review();
                    }
                    return;
                }
            }
            flag = !flag;
        }
        $(canvas).on('click', handleClick);
    });
    var blocks = {};
    var blank = {};
    for (var i = 0; i < ROW; i++) {
        for (var j = 0; j < ROW; j++) {
            blank[p2k(i, j)] = true;
        }
    }
    function makecircle(x, y) {
        ctx.beginPath();
        ctx.arc(x * off, y * off, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    function draw(i) {
        ctx.beginPath();
        //		0.5是用来消除双像素线
        ctx.moveTo(off / 2 + 0.5, off / 2 + 0.5 + i * off);
        ctx.lineTo((ROW - 0.5) * off + 0.5, off / 2 + 0.5 + i * off);
        ctx.moveTo(off / 2 + 0.5 + i * off, off / 2 + 0.5);
        ctx.lineTo(off / 2 + 0.5 + i * off, (ROW - 0.5) * off + 0.5);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    }
    function v2k(position) {
        return position.x + '_' + position.y;
    }
    function k2v(key) {
        var arr = key.split('_');
        return {
            x: parseInt(arr[0]),
            y: parseInt(arr[1])
        };
    }
    function p2k(x, y) {
        return x + '_' + y;
    }
    function drawChess(position, color) {
        ctx.save();
        var radgrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, 15);
        radgrad.addColorStop(0, 'white');
        radgrad.addColorStop(0.5, 'black');
        ctx.beginPath();
        if (color == 'black') {
            ctx.fillStyle = radgrad;
        } else {
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.shadowBlur = 2;
            ctx.shadowColor = "black";
            ctx.fillStyle = 'white';
        }
        ctx.translate((position.x + 0.5) * off + 0.5, (position.y + 0.5) * off + 0.5)
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
        blocks[v2k(position)] = color;
        delete blank[v2k(position)];
    }
    function check(pos, color) {
        var table = {};
        var num = 1;
        var nums = 1;
        var numx = 1;
        var numx2 = 1;
        //		var Tableblack={};
        //		var Tablewhite={};
        for (var i in blocks) {
            //			if(blocks[i]=='black'){
            //				Tableblack[i]=true;
            //			}
            //			if(blocks[i]=='white'){
            //				Tablewhite[i]=true;
            //			}
            if (blocks[i] == color) {
                table[i] = true;
            }
        }
        //		console.log(Tableblack)
        //		console.log(Tablewhite)
        var tx = pos.x;
        var ty = pos.y;
        while (table[p2k(tx + 1, ty)]) {
            num++;
            tx++;
        }
        tx = pos.x;
        ty = pos.y;
        while (table[p2k(tx - 1, ty)]) {
            num++;
            tx--;
        }
        while (table[p2k(tx, ty + 1)]) {
            nums++;
            ty++;
        }
        tx = pos.x;
        ty = pos.y;
        while (table[p2k(tx, ty - 1)]) {
            nums++;
            ty--;
        }
        while (table[p2k(tx + 1, ty + 1)]) {
            numx++;
            tx++;
            ty++
        }
        tx = pos.x;
        ty = pos.y;
        while (table[p2k(tx - 1, ty - 1)]) {
            numx++;
            tx--;
            ty--
        }
        while (table[p2k(tx - 1, ty + 1)]) {
            numx2++;
            tx--;
            ty++
        }
        tx = pos.x;
        ty = pos.y;
        while (table[p2k(tx + 1, ty - 1)]) {
            numx2++;
            tx++;
            ty--
        }
        return Math.max(num, nums, numx, numx2);
        //		if(num>=5||nums>=5||numx>=5||numx2>=5){
        //			return true;
        //		}else{
        //			return false;
        //		}
    }
    function restart() {
        ctx.clearRect(0, 0, 600, 600);
        blocks = {};
        flag = true;
        $(canvas).off('click').on('click', handleClick);
        draw();
    }
    function drawText(pos, text, color) {
        ctx.save();
        ctx.font = '15px 微软雅黑';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (color == 'black') {
            ctx.fillStyle = 'white';
        } else if (color == 'white') {
            ctx.fillStyle = 'black';
        }
        ctx.fillText(text, (pos.x + 0.5) * off, (pos.y + 0.5) * off)
        ctx.restore();
    }
    function review() {
        var i = 1;
        for (var pos in blocks) {
            drawText(k2v(pos), i, blocks[pos]);
            i++;
        }
    }
    for (var i = 0; i < ROW; i++) {
        draw(i);
        makecircle(3.5, 3.5);
        makecircle(11.5, 3.5);
        makecircle(7.5, 7.5);
        makecircle(3.5, 11.5);
        makecircle(11.5, 11.5);
    }
    function AI() {
        //		遍历空白位置
        var max1 = -Infinity;
        var max2 = -Infinity;
        for (var i in blank) {
            var score1 = check(k2v(i), 'black');
            var score2 = check(k2v(i), 'white');
            if (score1 > max1) {
                max1 = score1;
                pos1 = k2v(i);
            }
            if (score2 > max2) {
                max2 = score2;
                pos2 = k2v(i);
            }
        }
        if (max2 >= max1) {
            return pos2;
        } else {
            return pos1;
        }
        //      var max1 = -Infinity;
        //		for(var i in blank){
        //			var scroe=check(k2v(i),'black'); 
        //			if(scroe> max1){
        //			  max1=scroe;
        //			  pos=k2v(i);
        //			}
        //			
        //		}
        //		
        //		return pos;
    }
    var audio = $('audio').get(0);
    $('.ksyx').on('click', function() {
        $('.kaishi').addClass('yidong');
        $('.renji').addClass('ddz');
        $('.renren').addClass('ddz');
        audio.play();
    })
});
