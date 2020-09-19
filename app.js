$(document).ready(function () {
    var symbols = [
        '3xBAR',
        'BAR',
        '2xBAR',
        '7',
        'Cherry',
    ];

    var symbolsLen = symbols.length;

    var currIndex = symbolsLen - 1;

    var TOTAL_REEL = 3;
    var top = 'top';
    var bottom = 'bottom';
    var center = 'center';

    // Formula calculates peak angle
    var peakAngle = 360 / symbolsLen;
    var imgWidth = 121;

    var tx = calcZ(symbolsLen, imgWidth);
    var start, finished, animationID;
    var count = 0;
    var angle = 0;


    // Function calculates translateZ value
    function calcZ(n, length) {
        return Math.round((length / 2) / Math.tan(Math.PI / n));
    }

    function reelSetup($jE) {
        $(symbols).each(function (i) {
            $jE.append('<div class="reel__cell" style="transform: rotateX(' +
            ((currIndex - i) * peakAngle) + 'deg) translateZ(' + tx
        + 'px); background-image: url(./img/' + symbols[i] + '.png)"></div>');
        });
    }

    $('.reel').each(function() {
        reelSetup($(this));
    });

    function spin() {
        // var now = new Date().getTime();
        finished = false;

        animationID = requestAnimationFrame(spin);

        // console.log(`${((now-start)/100)} seconds`)
        angle += peakAngle / 2;
        count++;

        if (count <= 120) {
            $('.reel__0').css({ WebkitTransform: 'rotateX(' +
                (angle + angles[0]/120) % 360
            + 'deg)' });

            $('.reel__1').css({ WebkitTransform: 'rotateX(' +
                (angle + angles[1]/150) % 360
            + 'deg)' });

            $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                (angle + angles[2]/180) % 360
            + 'deg)' });
        } else if (count > 120 && count <= 150) {
            $('.reel__1').css({ WebkitTransform: 'rotateX(' +
                (angle + angles[1]/150) % 360
            + 'deg)' });

            $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                (angle + angles[2]/180) % 360
            + 'deg)' });
        } else if (count > 150 && count <= 180) {
            $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                (angle + angles[2]/180) % 360
            + 'deg)' });
        } else {
            finished = true;
        }

        if (finished) {
            cancelAnimationFrame(animationID);
            $('.spin').attr('disabled', false);
            count = 0;
        }

    }

    $('.spin').on('click', function() {
        // start = new Date().getTime();

        // $(this).attr('disabled', true);

        // console.log(prevIndex, indexes, currPos, spinNums, totalPos);
        trackPos();
        // console.log(prevIndex, indexes, currPos, spinNums, totalPos);

        totalPos = {
            top:    [],
            center: [],
            bottom: [],
        };

        // spinNums = [];

        // spin();
    });

    function genRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomRotation(sensitivity, cb, min, max) {
        return sensitivity * cb(min, max);
    }

    var indexes  = [currIndex, currIndex, currIndex];
    var currPos  = [center, center, center];
    var spinNums = [0, 0, 0];

    var totalPos = {
        top: [],
        center: [],
        bottom: [],
    };

    function trackPos() {

        $('.reel').each(function(i) {
            // Get a spin number between 1-10, each spin will be 36 degrees
            var spinNum = genRandomNum(1, 10);// 3
            // spinNums.push(spinNum);
            spinNums[i] = (spinNums[i] + spinNum) % 10;

            // Track total number of spins for each reel respectively
            var newIndex = (indexes[i] + Math.ceil(spinNum / 2)) % symbolsLen; // 1

            if (spinNum % 2 !== 0 && currPos[i] === center) {
                totalPos.top.push(symbols[(newIndex - 1 + symbolsLen) % 5]);
                totalPos.bottom.push(symbols[newIndex]);
                currPos[i] = bottom;
            } else if (spinNum % 2 === 0 && currPos[i] === center) {
                totalPos.center.push(symbols[newIndex]);
            } else if (spinNum % 2 === 0 && currPos[i] === bottom) {
                totalPos.top.push(symbols[(newIndex - 1 + symbolsLen) % 5]);
                totalPos.bottom.push(symbols[newIndex]);
            } else if (spinNum % 2 !== 0 && currPos[i] === bottom) {
                newIndex = (indexes[i] + Math.floor(spinNum / 2)) % symbolsLen;
                totalPos.center.push(symbols[newIndex]);
                currPos[i] = center;
            }

            indexes[i] = newIndex;

            $(this).css({ WebkitTransform: 'rotateX(' + (spinNums[i] * peakAngle/2) % 360 + 'deg)' });

        });

    }

});