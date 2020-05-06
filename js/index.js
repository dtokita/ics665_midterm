// Entirely designed by dtokita unless otherwise noted

$(document).ready(function() {

    // Allow user to change the number of blocks using slider
    $('#number-of-blocks').change(function() {
        var label = document.getElementById('number-of-blocks-label');
        let sliderVal = document.getElementById('number-of-blocks').value;

        label.innerText = 'Number of Blocks (' + sliderVal + ')';
    });

    // Allow user to change transmission rate using slider
    $('#transmission-rate').change(function() {
        var label = document.getElementById('transmission-rate-label');
        let sliderVal = document.getElementById('transmission-rate').value / 100.0;

        label.innerText = 'Transmission Rate (' + sliderVal + ')';
    });

    // Allow user to change transmission rate using slider
    $('#death-rate').change(function() {
        var label = document.getElementById('death-rate-label');
        let sliderVal = document.getElementById('death-rate').value / 100.0;

        label.innerText = 'Death Rate (' + sliderVal + ')';
    });

    // Allow user to change recovery rate using slider
    $('#recovery-rate').change(function() {
        var label = document.getElementById('recovery-rate-label');
        let sliderVal = document.getElementById('recovery-rate').value / 100.0;

        label.innerText = 'Recovery Rate (' + sliderVal + ')';
    });

    // Allow user to change infection radius using slider
    $('#infection-radius').change(function() {
        var label = document.getElementById('infection-radius-label');
        let sliderVal = document.getElementById('infection-radius').value;

        label.innerText = 'Recovery Rate (' + sliderVal + 'px)';
    });

    // Animate the borders of the simulation container
    anime({
        targets: document.getElementById('simulation-container'),
        translateY: '3vh',
        borderWidth: 2,
        borderColor: '#929292',
        height: '50vh',
        easing: 'linear',
        autoplay: true
    });

    // Animate the borders of the graph container
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

// Function to call to start the simulation
function initSimulation() {

    // Generate and disperse blocks in simulation space
    generateBlocks();
    randomlyMoveBlocks();

    // Initialize blank graph with traces at initial values
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

// Execute a single step in the simulation
function simulationStep() {

    // Make infection, death, and recovery determinations based on current positions and parameters
    // determined in the control panel, then move blocks
    infectionCheck();
    deathCheck();
    recoveryCheck();
    randomlyMoveBlocks();

    // Plot the values for the traces at the current time stamp
    Plotly.extendTraces('graph-container', {
       y: [[document.getElementsByClassName('infected').length],
           [document.getElementsByClassName('vulnerable').length],
           [document.getElementsByClassName('dead').length],
           [document.getElementsByClassName('recovered').length]]
    }, [0, 1, 2, 3]);

}

// Create blocks for the simulation
function generateBlocks(timeline) {
    let simulationContainer = document.getElementById('simulation-container');

    // Create the initial infected patient
    let patientZero = document.createElement('div');
    patientZero.id = 0;
    patientZero.className = 'infected';

    simulationContainer.appendChild(patientZero);

    // Change the infected block to red to indicate the infection
    anime({
        targets: '.infected',
        backgroundColor: '#FF0000',
        borderColor: '#FF0000'
    });

    // Create the rest of the blocks as black, vulnerable blocks
    for (var i = 1; i < document.getElementById('number-of-blocks').value; i++) {
        var block = document.createElement('div');
        block.id = i;
        block.className = 'vulnerable';

        simulationContainer.appendChild(block);
    }
}

// Get dimension of simulation space
function getSimulationRect() {
    let simulationContainer = document.getElementById('simulation-container');
    let simulationContainerRect = simulationContainer.getBoundingClientRect();

    return simulationContainerRect;
}

// Randomly shuffle the blocks bounded by the simulation space
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

// Using the infection rate and infection radius, randomly determine if an infected
// block infects those around it 
function infectionCheck() {
    var infectedArr = document.getElementsByClassName('infected');
    var scalingFactor = document.getElementById('infection-radius').value / 5;

    // Change the infected to red circles to indicate the radius of infection
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

    // Perform the random calculation for each infected block in simulation
    $.each(infectedArr, function(keyInfected, valueInfected) {

        var vulnerableArr = document.getElementsByClassName('vulnerable');

        // Check if each vulnerable is in radius of infected
        $.each(vulnerableArr, function(keyVulnerable, valueVulnerable) {

            if (valueVulnerable != undefined) {
                if (isInRadius([valueInfected.offsetLeft, valueInfected.offsetTop],
                    [valueVulnerable.offsetLeft, valueVulnerable.offsetTop],
                    document.getElementById('infection-radius').value)) {

                    if (Math.random() < (document.getElementById('transmission-rate').value / 100)) {
                        // Block infected, change class and animate the transition to red
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

// Check if an infected block dies, randomly based on death-rate
function deathCheck() {
    var infectedArr = document.getElementsByClassName('infected');

    // Check if each infected with die
    $.each(infectedArr, function (key, value) {
        if (Math.random() < (document.getElementById('death-rate').value / 100)) {

            if (value != undefined) {
                // Infected block dies, animate the transition to purple block
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

// Check if an infected block recovers, randomly based on recovery-rate
function recoveryCheck() {
    var infectedArr = document.getElementsByClassName('infected');

    // Check if each infected block recovers
    $.each(infectedArr, function (key, value) {
        if (Math.random() < (document.getElementById('recovery-rate').value / 100)) {

            if (value != undefined) {
                // Infected block recovers and animate block to green
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

// Helper function to determine if two points are within a radius of each other
function isInRadius(pointA, pointB, radius) {
    let distance = (pointA[0] - pointB[0]) * (pointA[0] - pointB[0]) + (pointA[1] - pointB[1]) * (pointA[1] - pointB[1]);
    radius *= radius;

    if (distance < radius) {
        return true;
    }

    return false;

}
