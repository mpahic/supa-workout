var audioBeep = new Audio(
  'https://firebasestorage.googleapis.com/v0/b/mpahic-1a040.appspot.com/o/sound%2Fmixkit-clock-countdown-bleeps-916.wav?alt=media&token=0c67a263-40a7-4e1d-9d49-3d50456eb938'
);

const SUPABASE_URL = 'https://yqntaqpxfztrgagsmauc.supabase.co';
var SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDk2MDU4NSwiZXhwIjoxOTQwNTM2NTg1fQ.I1USSxWCIu7huDhLNPO2zwfFoJO82IoH3ACuq0wSBZc';

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const backgrounds = ["#eb47e0","#eb479e","#eb475d","#eb7347","#ebb447","#e0eb47","#9eeb47","#5deb47","#47eb73","#47ebb4","#47e0eb","#479eeb","#475deb","#7347eb","#b447eb"];

var workout;
(async () => {
  let { data: workouts, error } = await supabase
    .from('workout')
    .select('name,background,json')
    .eq('id', getParameterByName('workout'));

  preloadWorkout(workouts[0].name, workouts[0].background, workouts[0].json);
})();

function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

var noSleep = new NoSleep();
document.addEventListener(
  'click',
  function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  },
  false
);

var running = false;
var timeline;
timeline = anime.timeline({
  autoplay: false,
  suspendWhenDocumentHidden: false
});

timeline.set('.honeycomb', {
  translateX: 0,
  translateY: 0,
  scale: 1
});

function loadAnimation() {
  timeline
    .add({
      targets: '#preparation .go',
      opacity: 0,
      duration: 10
    })
    .add({
      targets: '#preparation .go',
      duration: 6000
    })
    .add(
      {
        targets: '#preparation .countdown',
        easing: 'linear',
        delay: anime.stagger(1000),
        scale: [
          { value: 1, duration: 10 },
          { value: 1.25, duration: 900, delay: 100 }
        ],
        opacity: [
          { value: 1, duration: 10 },
          { value: 0, duration: 900, delay: 100 }
        ]
      },
      '-=6000'
    )
    .add(
      {
        begin: function(anim) {
          audioBeep.play();
        }
      },
      '-=5000'
    )
    .add({
      targets: '#preparation',
      opacity: 0,
      duration: 1000
    });

    var repeat = workout.repeat ? workout.repeat : 1;
    for (var i = 0; i < repeat; i++) {
      workout.routines.forEach(routine => {
        addRoutineToTimeline(routine, timeline);
        
      });
      if(workout.inbetweenRoutines) {
        workout.inbetweenRoutines.forEach(inroutine => {
          addRoutineToTimeline(inroutine, timeline);
          
        });
      }
    }


    timeline
    .add(
      {
        targets: '#preparation',
        opacity: 1,
        duration: 10
      },
      '-=1000'
    )
    .add(
      {
        targets: '#preparation .end',
        opacity: 1,
        duration: 10
      },
      '-=1000'
    )
    .finished.then(function() {
      running = false;
    });
}

function addRoutineToTimeline(routine, timeline) {
  timeline
      .add(
        {
          targets: '#routine' + routine.id,
          scale: calculateScale(),
          translateX: calculateTranslateX(),
          translateY: calculateTranslateY(),
          duration: 100
        },
        '-=11000'
      )
      .add(
        {
          targets: '#routine' + routine.id,
          opacity: 1,
          duration: 2000
        },
        '-=10000'
      )
      .add(
        {
          targets: '#routine' + routine.id,
          translateY: 0,
          translateX: 0,
          scale: 1,
          easing: 'spring(1, 80, 10, 0)',
          duration: 2000,
          begin: function(anim) {
            document.body.style.background = routine.background;
          }
        },
        '-=1000'
      )
      .add({
        targets: '#routine' + routine.id,
        duration: routine.duration * 1000
      })
      .add(
        {
          targets: '#routine' + routine.id + ' .countdown',
          easing: 'linear',
          delay: anime.stagger(1000),
          scale: [
            { value: 1, duration: 10 },
            { value: 1.25, duration: 900, delay: 100 }
          ],
          opacity: [
            { value: 1, duration: 10 },
            { value: 0, duration: 900, delay: 100 }
          ]
        },
        '-=6000'
      )
      .add(
        {
          begin: function(anim) {
            audioBeep.play();
          }
        },
        '-=5000'
      )
      .add({
        targets: '#routine' + routine.id,
        opacity: 0,
        duration: 1000
      });
}

function calculateScale() {
  if (window.innerHeight > window.innerWidth) {
    var calc = (window.innerHeight - window.innerWidth) / window.innerWidth;
    return calc > 1 ? 1 : calc;
  } else {
    return (window.innerWidth - window.innerHeight) / window.innerHeight;
  }
}

function calculateTranslateY() {
  if (window.innerHeight > window.innerWidth) {
    return window.innerWidth * 0.4 + (window.innerWidth * calculateScale()) / 2;
  } else {
    return (window.innerHeight * calculateScale()) / 2 + 'px';
  }
}

function calculateTranslateX() {
  if (window.innerHeight > window.innerWidth) {
    return (
      window.innerWidth * 0.1 -
      (window.innerWidth * calculateScale()) / 2 +
      'px'
    );
  } else {
    return (
      (window.innerWidth * 0.1 + window.innerHeight * calculateScale()) / 2 +
      'px'
    );
  }
}

var overlayDiv = document.getElementById('overlay');
var running = false;
function clickApp() {
  if (!running) {
    overlayDiv.style.background = 'none';
    overlayDiv.innerHTML = '';
    timeline.play();
    running = true;
    if (
      audioBeep.currentTime != 0 &&
      audioBeep.currentTime != audioBeep.duration
    ) {
      audioBeep.play();
    }
  } else {
    pauseAnimation();
  }
}

window.onblur = function() {
//  pauseAnimation();
};

function pauseAnimation() {
  overlayDiv.style.background = workout.background;
  overlayDiv.innerHTML = 'Paused';
  timeline.pause();
  running = false;
  audioBeep.pause();
}

function preloadWorkout(name, background, json) {
  workout = json;
  document.body.style.background = background;

  for (var i = 0; i < workout.routines.length; i++) {
    generateRoutine(i, workout.routines);
  }
  if(workout.inbetweenRoutines) {
    for (var i = 0; i < workout.inbetweenRoutines.length; i++) {
      generateRoutine(i, workout.inbetweenRoutines);
    }
  }
  loadAnimation();
}

var images = [];
function generateRoutine(i, routines) {
  var routineElem = document.createElement('div');
  routineElem.classList.add('honeycomb');
  routineElem.setAttribute('id', 'routine' + routines[i].id);
  routineElem.style.opacity = 0;
  document.body.appendChild(routineElem);

  var titleWrapperElem = document.createElement('div');
  titleWrapperElem.classList.add('titleWrapper');

  var titleElem = document.createElement('div');
  titleElem.classList.add('title');
  titleElem.innerHTML = routines[i].name;
  titleWrapperElem.appendChild(titleElem);
  routineElem.appendChild(titleWrapperElem);

  if (routines[i].image) {
    var imgElem = document.createElement('img');
    imgElem.classList.add('container');
    imgElem.setAttribute('src', routines[i].image);
    routineElem.appendChild(imgElem);

    images[i] = new Image();
    images[i].src = routines[i].image;
  } else if (routines[i].icon) {
    var imgElem = document.createElement('div');
    imgElem.classList.add('icon');
    imgElem.classList.add('container');
    var iconElem = document.createElement('i');
    iconElem.classList.add('fas');
    iconElem.classList.add('fa-' + routines[i].icon);
    imgElem.appendChild(iconElem);
    routineElem.appendChild(imgElem);
  }

  for (let i = 5; i >= 0; i--) {
    var countdownElement = document.createElement('div');
    countdownElement.classList.add('countdown');
    countdownElement.classList.add('container');
    countdownElement.style.opacity = 0;
    countdownElement.innerHTML = i;
    routineElem.appendChild(countdownElement);
  }
}

function changeBackground(selectObject) {
  var value = selectObject.value;
  document.body.style.background = selectObject.value;
}
