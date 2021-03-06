$(document).ready(function () {
    var symbols = [
        '3xBAR',
        'BAR',
        '2xBAR',
        '7',
        'Cherry',
    ];

    var TOTAL_REEL = 3;
    var MAX_BALANCE = 5000;
    var COST_PER_SPIN = -1;
    var REEL0_DURATION = 2;
    var REEL1_DURATION = 2.5;
    var REEL2_DURATION = 3;
    var IMG_WIDTH = 121;
    var symbolsLen = symbols.length;
    var currIndex = symbolsLen - 1;
    var top = 'top';
    var bottom = 'bottom';
    var center = 'center';


    // Variables needed for tracking positions
    var indexes  = [currIndex, currIndex, currIndex];
    var currPos  = [center, center, center];
    var spinNums = [0, 0, 0];

    var totalPos = {
        top: [],
        center: [],
        bottom: [],
    };

    // Formula calculates peak angle
    var peakAngle = 360 / symbolsLen;

    var tx = calcZ(symbolsLen, IMG_WIDTH);
    var finished, animationID;

    // Variables needed for consistent frame rate per second
    // Logic gathered from -> https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe
    var frameCount = 0;
    var FPS = 60; // Could be multiples of twenty up to sixty
    var fpsInterval, startTime, now, then, elapsed;


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

    function spin() {

        finished = false;

        animationID = requestAnimationFrame(spin);

        // calc elapsed time since last loop
        now = Date.now();
        elapsed = now - then;

        // if enough time has elapsed, draw the next frame
        if (elapsed > fpsInterval) {

            // Get ready for next frame by setting then=now, but also adjust for
            // your specified fpsInterval not being a multiple of RAF's interval
            // (16.7ms)
            then = now - (elapsed % fpsInterval);

            frameCount++;

            // Add spin nums per reel
            if (frameCount <= REEL2_DURATION * FPS) {
                $(spinNums).each(function (i) {
                    spinNums[i] = (spinNums[i] + 1) % 10;
                });
            }

            if (frameCount <= REEL0_DURATION * FPS) {

                $('.reel__0').css({ WebkitTransform: 'rotateX(' +
                    (spinNums[0] * peakAngle / 2) % 360
                + 'deg)' });

                $('.reel__1').css({ WebkitTransform: 'rotateX(' +
                    (spinNums[1] * peakAngle / 2) % 360
                + 'deg)' });

                $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                    (spinNums[2] * peakAngle / 2) % 360
                + 'deg)' });

            } else if (frameCount > REEL0_DURATION * FPS && frameCount <= REEL1_DURATION * FPS) {

                $('.reel__1').css({ WebkitTransform: 'rotateX(' +
                    (spinNums[1] * peakAngle / 2) % 360
                + 'deg)' });

                $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                    (spinNums[2] * peakAngle / 2) % 360
                + 'deg)' });

            } else if (frameCount > REEL1_DURATION * FPS && frameCount <= REEL2_DURATION * FPS) {

                $('.reel__2').css({ WebkitTransform: 'rotateX(' +
                    (spinNums[2] * peakAngle / 2) % 360
                + 'deg)' });

            } else {
                finished = true;
            }

        }


        if (finished) {
            cancelAnimationFrame(animationID);
            enableInputs();
            reflectWinnings();
            frameCount = 0;
        }

    }

    // initialize the timer variables and start the animation
    function startAnimating(fps) {
        fpsInterval = 1000 / fps;
        then = Date.now();
        startTime = then;
        spin();
        playSound('spin');
    }

    function genRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function disableInputs() {
        $('input, select, button').attr('disabled', true).addClass('disabled');
    }

    function enableInputs() {
        $('input, select, button').attr('disabled', false).removeClass('disabled');
    }

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

    function calcWinningRows() {

        var winningRows = {};

        for (var pos in totalPos) {

            // Check if we got symbols on all reels for the position in hand
            if (totalPos[pos].length === TOTAL_REEL) {

                var isSame = true;
                var cherriesAnd7s = true;
                var bars = true;
                var current = $(totalPos[pos])[0];

                $(totalPos[pos]).each(function (i, item) {

                    if (current !== item) {
                        isSame = false;
                    }

                    if (item === '3xBAR' || item === '2xBAR' || item === 'BAR') {
                        cherriesAnd7s = false;
                    }

                    if (item === 'Cherry' || item === '7') {
                        bars = false;
                    }

                });

                // If all the symbols are the same, take the associated payments
                // Else, see if there is an "any" type of payment provided
                if (isSame) {
                    switch (current) {
                        case 'Cherry':
                            winningRows[pos] = $('[data-pos="'+pos+'"][data-symbol="'+current+'"]');
                            break;
                        case '7':
                            winningRows[pos] = $('[data-pos="any"][data-symbol="'+current+'"]');
                            break;
                        case '3xBAR':
                            winningRows[pos] = $('[data-pos="any"][data-symbol="'+current+'"]');
                            break;
                        case '2xBAR':
                            winningRows[pos] = $('[data-pos="any"][data-symbol="'+current+'"]');
                            break;
                        case 'BAR':
                            winningRows[pos] = $('[data-pos="any"][data-symbol="'+current+'"]');
                            break;
                    }
                } else {

                    if (cherriesAnd7s) {
                        winningRows[pos] = $('[data-pos="any"][data-symbol="Cherry7"]');
                    }

                    if (bars) {
                        winningRows[pos] = $('[data-pos="any"][data-symbol="BARS"]');
                    }
                }

            }

        }

        return winningRows;
    }

    function reflectWinnings() {

        var celebrations = [
            'Wow!',
            'Beautiful!',
            'On fire!',
            'Victory!',
            'You won!',
            'Congrats!',
        ];

        var isWon;
        var pay = 0;
        var winningRows = calcWinningRows();

        for (var row in winningRows) {
            isWon = true;
            $('.wl__' + row).effect("highlight", { color: "#ff0000" }, 3000);
            $(winningRows[row]).effect("highlight", {}, 3000);
            pay += $(winningRows[row]).data('value');
        }

        if (isWon) {
            $('.header').text(celebrations[genRandomNum(0, celebrations.length)]);
            trackBalance(pay);
            $('input[name="balance"]').effect("highlight", {}, 3000);

            // Play payoff sound
            playSound('payoff');
        }

        // Reset totalPositions at this point for the next spin
        totalPos = {
            top:    [],
            center: [],
            bottom: [],
        };
    }

    function trackBalance(amount) {

        var $balanceBox = $('input[name="balance"]');
        var balance = $balanceBox.val();
        $balanceBox.val(+balance + amount);

    }

    function playSound(sound) {

        var sounds = {
            spin: './audio/spin.mp3',
            payoff: './audio/payoff.mp3',
        }

        var sound = new Audio(sounds[sound]);
        sound.play();
    }

    $('.reel').each(function() {
        reelSetup($(this));
    });

    $('.spin').on('click', function() {

        trackBalance(COST_PER_SPIN);
        disableInputs();
        trackPos();
        startAnimating(FPS);

    });

    $(document.body).on('change', 'input[name="balance"]', function() {

        if ($(this).val() > MAX_BALANCE) {
            $(this).val(MAX_BALANCE);
            $('.error').fadeIn(2000, 'linear',function() {
                $(this).fadeOut(2000);
            });
        }

    });

    $(document.body).on('change', '[name="speed"]', function() {

        FPS = $(this).val();

    });

});