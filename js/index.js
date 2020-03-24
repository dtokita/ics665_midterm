// Simulation Parameters
var gridSize = 20;
var transmissionRate = 0.5;
var deathRate = 0.25;
var recoveryRate = 0.5;
var incubationPeriod = 14;

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

var animation = anime.timeline({
    targets: '.block',
    easing: 'easeInOutSine',
    delay: anime.stagger(5),
    autoplay: true
})
    .add({
        backgroundColor: '#FFFFFF',
        border: '#FFFFFF'
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
  infected.forEach(infectionCheck);

  console.log(infected);
  console.log(dead);
}

function infectionCheck(infectedObj, index) {

  if (infectedObj['age'] == -1) {
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

  if (Math.random() <= deathRate) {

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