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
        // angle += peakAngle / 2;
        count++;

        if (count <= 180) {
            $(spinNums).each(function (i) {
                spinNums[i] = (spinNums[i] + 1) % 10;
            });
        }

        // console.log(spinNums, count)

        if (count <= 120) {
            $('.reel__0').css({ WebkitTransform: 'rotateX(' +
                (spinNums[0] * peakAngle / 2) % 360
            + 'deg)' });

            $('.reel__1').css({ WebkitTransform: 'rotateX(' +
                (spinNums[1] * peakAngle / 2) % 360
            + 'deg)' });

            $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                (spinNums[2] * peakAngle / 2) % 360
            + 'deg)' });
        } else if (count > 120 && count <= 150) {
            $('.reel__1').css({ WebkitTransform: 'rotateX(' +
                (spinNums[1] * peakAngle / 2) % 360
            + 'deg)' });

            $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                (spinNums[2] * peakAngle / 2) % 360
            + 'deg)' });
        } else if (count > 150 && count <= 180) {
            $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                (spinNums[2] * peakAngle / 2) % 360
            + 'deg)' });
        } else {
            finished = true;
        }

        if (finished) {
            cancelAnimationFrame(animationID);
            enableSpinButton();
            count = 0;
        }

    }

    $('.spin').on('click', function() {
        // start = new Date().getTime();

        disableSpinButton();

        console.log('trackPos started ! ', spinNums)
        trackPos();
        console.log(indexes, currPos, spinNums, totalPos);
        console.log('trackPos finished ! ', spinNums)

        totalPos = {
            top:    [],
            center: [],
            bottom: [],
        };

        spin();
    });

    function genRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function disableSpinButton() {
        $('.spin').attr('disabled', true).addClass('disabled');
    }

    function enableSpinButton() {
        $('.spin').attr('disabled', false).removeClass('disabled');
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

            var spinNum = calcDesiredSpinNum(i);

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

        });

    }

    function calcDesiredSpinNum(reelIndex) {

        var isFixed = $('[name="mode"]').val() === 'fixed';

        if (!isFixed) {
            // Get a spin number between 1 and 10, each spin will be 36 degrees
            return genRandomNum(1, 10);
        } else {

            var desiredIndex = $('[name="reel-' + reelIndex + '-symbol"]').find(':selected').data('index');
            var desiredPos = $('[name="reel-' + reelIndex + '-pos"]').val();

            var spinNum = ((desiredIndex - indexes[reelIndex] + symbolsLen) % symbolsLen) * 2;

            switch (true) {
                case currPos[reelIndex] === center && desiredPos === bottom:
                    spinNum = spinNum - 1;
                    break;
                case currPos[reelIndex] === center && desiredPos === top:
                    spinNum = spinNum + 1;
                    break;
                case currPos[reelIndex] === top && desiredPos === center:
                    spinNum = spinNum - 1;
                    break;
                case currPos[reelIndex] === top && desiredPos === bottom:
                    spinNum = spinNum - 2;
                    break;
                case currPos[reelIndex] === bottom && desiredPos === center:
                    spinNum = spinNum + 1;
                    break;
                case currPos[reelIndex] === bottom && desiredPos === top:
                    spinNum = spinNum + 2;
                    break;
            }

            return spinNum;

        }
    }

});