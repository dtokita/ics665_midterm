$(document).ready(function() {

    $('#number-of-blocks').change(function() {
        var label = document.getElementById('number-of-blocks-label');
        let sliderVal = document.getElementById('number-of-blocks').value;

        label.innerText = 'Number of Blocks (' + sliderVal + ')';
    });

    $('#transmission-rate').change(function() {
        var label = document.getElementById('transmission-rate-label');
        let sliderVal = document.getElementById('transmission-rate').value / 100.0;

        label.innerText = 'Transmission Rate (' + sliderVal + ')';
    });

    $('#death-rate').change(function() {
        var label = document.getElementById('death-rate-label');
        let sliderVal = document.getElementById('death-rate').value / 100.0;

        label.innerText = 'Death Rate (' + sliderVal + ')';
    });

    $('#recovery-rate').change(function() {
        var label = document.getElementById('recovery-rate-label');
        let sliderVal = document.getElementById('recovery-rate').value / 100.0;

        label.innerText = 'Recovery Rate (' + sliderVal + ')';
    });

    $('#infection-radius').change(function() {
        var label = document.getElementById('infection-radius-label');
        let sliderVal = document.getElementById('infection-radius').value;

        label.innerText = 'Recovery Rate (' + sliderVal + 'px)';
    });

    anime({
        targets: document.getElementById('simulation-container'),
        translateY: '3vh',
        borderWidth: 2,
        borderColor: '#929292',
        height: '50vh',
        easing: 'linear',
        autoplay: true
    });

    anime({
        targets: document.getElementById('graph-container'),
        translateY: '6vh',
        borderWidth: 2,
        borderColor: '#929292',
        height: '30vh',
        easing: 'linear',
        autoplay: true
    });

});

function initSimulation() {

    generateBlocks();
    randomlyMoveBlocks();

    Plotly.plot('graph-container', [{
        y: [0], // infected
        type: 'line',
        name: 'Infected',
        line: {
            color: 'red'
        }
    }, {
        y: [document.getElementsByClassName('vulnerable').length], // vulnerable
        type: 'line',
        name: 'Vulnerable',
        line: {
            color: 'black'
        }
    }, {
        y: [document.getElementsByClassName('dead').length], // dead
        type: 'line',
        name: 'Dead',
        line: {
            color: 'purple'
        }
    }, {
        y: [document.getElementsByClassName('recovered').length], // recovered
        type: 'line',
        name: 'Recovered',
        line: {
            color: 'green'
        }
    }], {
        height: document.getElementById('graph-container').clientHeight,
        width: document.getElementById('graph-container').clientWidth - 20,
        margin: {
            t: 20,
            l: 20,
            r: 20,
            b: 20
        }
    });
}

function simulationStep() {

    infectionCheck();
    deathCheck();
    recoveryCheck();
    randomlyMoveBlocks();

    Plotly.extendTraces('graph-container', {
       y: [[document.getElementsByClassName('infected').length],
           [document.getElementsByClassName('vulnerable').length],
           [document.getElementsByClassName('dead').length],
           [document.getElementsByClassName('recovered').length]]
    }, [0, 1, 2, 3]);

}

function generateBlocks(timeline) {
    let simulationContainer = document.getElementById('simulation-container');

    let patientZero = document.createElement('div');
    patientZero.id = 0;
    patientZero.className = 'infected';

    simulationContainer.appendChild(patientZero);

    anime({
        targets: '.infected',
        backgroundColor: '#FF0000',
        borderColor: '#FF0000'
    });

    for (var i = 1; i < document.getElementById('number-of-blocks').value; i++) {
        var block = document.createElement('div');
        block.id = i;
        block.className = 'vulnerable';

        simulationContainer.appendChild(block);
    }
}

function getSimulationRect() {
    let simulationContainer = document.getElementById('simulation-container');
    let simulationContainerRect = simulationContainer.getBoundingClientRect();

    return simulationContainerRect;
}

function randomlyMoveBlocks() {
    let simulationRect = getSimulationRect();

    anime({
        targets: '#simulation-container div',
        left: function(el, i, l) {
            return Math.floor(Math.random() * (simulationRect['width'] - 20));
        },
        top: function (el, i, l) {
            return Math.floor(Math.random() * (simulationRect['height'] - 20));
        },
        easing: 'linear',
        duration: 500,
        delay: 1000
    });
}

function infectionCheck() {
    var infectedArr = document.getElementsByClassName('infected');
    var scalingFactor = document.getElementById('infection-radius').value / 5;

    anime({
        targets: '.infected',
        borderRadius: '50%',
        backgroundColor: '#FFFFFF',
        opacity: 0.5,
        borderWidth: '0.5px',
        duration: 400,
        scale: scalingFactor,
        easing: 'linear'
    });

    $.each(infectedArr, function(keyInfected, valueInfected) {

        var vulnerableArr = document.getElementsByClassName('vulnerable');

        $.each(vulnerableArr, function(keyVulnerable, valueVulnerable) {

            if (valueVulnerable != undefined) {
                if (isInRadius([valueInfected.offsetLeft, valueInfected.offsetTop],
                    [valueVulnerable.offsetLeft, valueVulnerable.offsetTop],
                    document.getElementById('infection-radius').value)) {

                    if (Math.random() < (document.getElementById('transmission-rate').value / 100)) {
                        valueVulnerable.className = 'infected';

                        anime({
                            targets: valueVulnerable,
                            backgroundColor: '#FF0000',
                            borderColor: '#FF0000',
                            easing: 'linear',
                            delay: 500,
                            duration: 500
                        });
                    }
                }

            }
        })
    });

}

function deathCheck() {
    var infectedArr = document.getElementsByClassName('infected');

    $.each(infectedArr, function (key, value) {
        if (Math.random() < (document.getElementById('death-rate').value / 100)) {

            if (value != undefined) {
                value.className = 'dead';

                anime({
                    targets: value,
                    backgroundColor: '#a14aff',
                    borderColor: '#a14aff',
                    borderRadius: '0%',
                    opacity: 1,
                    scale: 1,
                    easing: 'linear',
                    duration: 500,
                    delay: 1000
                })
            }

        }
    })
}

function recoveryCheck() {
    var infectedArr = document.getElementsByClassName('infected');

    $.each(infectedArr, function (key, value) {
        if (Math.random() < (document.getElementById('recovery-rate').value / 100)) {

            if (value != undefined) {
                value.className = 'recovered';

                anime({
                    targets: value,
                    backgroundColor: '#00ff00',
                    borderColor: '#00ff00',
                    borderRadius: '0%',
                    opacity: 1,
                    scale: 1,
                    easing: 'linear',
                    duration: 500,
                    delay: 1000
                })
            }

        }
    })
}

function isInRadius(pointA, pointB, radius) {
    let distance = (pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]);
    radius *= radius;

    if (distance < radius) {
        return true;
    }

    return false;

}
