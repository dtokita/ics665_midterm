// Simulation Parameters
var gridSize = 20;
var transmissionRate = 0.5;
var deathRate = 0.1;
var incubationPeriod = 5;

var grid = [gridSize, gridSize];
var columns = grid[0];
var rows = grid[1];
var count = 0;

var infected = [];
var recovered = [];
var dead = [];

var simulationVisualization = document.querySelector('.simulation-container');
var fragment = document.createDocumentFragment();

for (let i = 0; i < rows; i++) {

  var row = document.createElement('div');
  row.className = 'row';

  for (let j = 0; j < columns; j++) {
    var block = document.createElement('div');
    block.className = 'block';
    block.id = count;

    row.appendChild(block);
    count++;
  }

  fragment.appendChild(row);

}

simulationVisualization.appendChild(fragment);

let screenHeight = document.querySelector('.simulation-container').clientHeight;
let screenWidth = document.querySelector('.simulation-container').clientWidth;
var blockSize = 0;

if (screenWidth > screenHeight) {
    blockSize = screenHeight / gridSize;
} else {
    blockSize = screenWidth / gridSize;
}

var animation = anime.timeline({
    targets: '.block',
    easing: 'easeInOutSine',
    delay: anime.stagger(5),
    autoplay: true
})
    .add({
        backgroundColor: '#FFFFFF',
        border: '#FFFFFF',
        width: blockSize,
        height: blockSize,
        margin: blockSize
    });

var initialInfectedBlockId = Math.floor(Math.random() * columns * rows);
infected.push({id: initialInfectedBlockId, age: 0});

var initialInfectedBlock = document.getElementById(initialInfectedBlockId);
initialInfectedBlock.className = 'infected';

animation.add({
  backgroundColor: '#AA0000',
  border: '#AA0000',
  targets: '.infected',
  easing: 'easeInOutSine',
  delay: anime.stagger(5)
});

function simulateStep() {
  infected.forEach(deathCheck);
  infected.forEach(recoveryCheck);
  infected.forEach(infectionCheck);

  console.log(infected);
  console.log(dead);
  console.log(recovered);
}

function infectionCheck(infectedObj, index) {

  if ((infectedObj['age'] == -1) || (infectedObj['age'] == incubationPeriod - 1)) {
    infected = infected.filter(function(value, index, infected) {
        return ((value['age'] != -1) && (value['age'] < incubationPeriod));
    });

    return 0;
  }

  let id = infectedObj['id'];
  var left = null;
  var right = null;
  var up = null;
  var down = null;

  if ((id % gridSize) != 0) {
    left = id - 1;

    if (Math.random() <= transmissionRate) {

      var block = document.getElementById(left);

      if (block.className == 'block') {
          infected.push({id: left, age: 0});
          document.getElementById(left).className = 'infected';

          anime({
              targets: '.infected',
              backgroundColor: '#AA0000',
              border: '#AA0000',
              easing: 'easeInOutSine',
              delay: anime.stagger(5)
          });

      }
    }
  }

  if ((id % gridSize) != (gridSize - 1)) {
    right = id + 1;

      if (Math.random() <= transmissionRate) {

          var block = document.getElementById(right);

          if (block.className == 'block') {
              infected.push({id: right, age: 0});
              document.getElementById(right).className = 'infected';

              anime({
                  targets: '.infected',
                  backgroundColor: '#AA0000',
                  border: '#AA0000',
                  easing: 'easeInOutSine',
                  delay: anime.stagger(5)
              });

          }
      }

  }

  if ((id - gridSize) > -1) {
    up = id - gridSize;

      if (Math.random() <= transmissionRate) {

          var block = document.getElementById(up);

          if (block.className == 'block') {
              infected.push({id: up, age: 0});
              document.getElementById(up).className = 'infected';

              anime({
                  targets: '.infected',
                  backgroundColor: '#AA0000',
                  border: '#AA0000',
                  easing: 'easeInOutSine',
                  delay: anime.stagger(5)
              });

          }
      }

  }

  if ((id + gridSize) < count + 1) {
    down = id + gridSize;

      if (Math.random() <= transmissionRate) {

          var block = document.getElementById(down);

          if (block.className == 'block') {
              infected.push({id: down, age: 0});
              document.getElementById(down).className = 'infected';

              anime({
                  targets: '.infected',
                  backgroundColor: '#AA0000',
                  border: '#AA0000',
                  easing: 'easeInOutSine',
                  delay: anime.stagger(5)
              });

          }
      }

  }


}

function deathCheck(infectedObj, index) {

  if ((Math.random() <= deathRate) && (document.getElementById(infectedObj['id']).className == 'infected')) {

    infectedObj['age'] = -1;

    var deadBlock = document.getElementById(infectedObj['id']);
    deadBlock.className = 'dead';

    dead.push(infectedObj);

    anime({
        targets: '.dead',
        backgroundColor: '#3d3d3d',
        border: '#3d3d3d',
        easing: 'easeInOutSine',
        delay: anime.stagger(5)
    });

  } else {
    if (infectedObj['age'] != -1) {
        infectedObj['age']++;
    }

  }

}

function recoveryCheck(infectedObj, index) {

    if (infectedObj['age'] == incubationPeriod) {
        var recoveredBlock = document.getElementById(infectedObj['id']);
        recoveredBlock.className = 'recovered';

        recovered.push(infectedObj);

        anime({
            targets: '.recovered',
            backgroundColor: '#00ff00',
            border: '#00ff00',
            easing: 'easeInOutSine',
            delay: anime.stagger(5)
        });
    }

}