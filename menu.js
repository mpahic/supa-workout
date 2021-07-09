
const SUPABASE_URL = "https://yqntaqpxfztrgagsmauc.supabase.co"
var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyNDk2MDU4NSwiZXhwIjoxOTQwNTM2NTg1fQ.I1USSxWCIu7huDhLNPO2zwfFoJO82IoH3ACuq0wSBZc'

var supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const session = supabase.auth.session();
console.log(session);

var menuShown = false;
function showLoginOption() {
  if(menuShown) {
    document.getElementById('signin').style = "transform : translate(100vw,0)";
    menuShown = false;
  } else {
    document.getElementById('signin').style = "transform : translate(10vw,0)";
    menuShown = true;
  }
};

async function signGoogle()  {
    console.log("clicked2");
    const { user, session, error } = await supabase.auth.signIn({
      provider: 'google'
    })
}

(async() => {
  console.log('before start');

  let { data: workouts, error } = await supabase
  .from('workout')
  .select('id,name,background,icon');

  var selection = document.getElementById('selection');
  workouts.forEach(workout => {
    
    var workoutElem = document.createElement('li');
    workoutElem.classList.add('honeycomb-cell');
    workoutElem.setAttribute('id', workout.id);
    workoutElem.addEventListener('click', getClickFunction(workout.id));

    var styleElem = document.head.appendChild(document.createElement("style"));
    styleElem.innerHTML = '#'+workout.id+':after {background: '+workout.background+';}';  
    
    var iconWrapperElem = document.createElement('div');
    iconWrapperElem.classList.add('honeycomb-cell__image');
    var iconElem = document.createElement('i');
    iconElem.classList.add('fas');
    iconElem.classList.add('fa-' + workout.icon);
    iconWrapperElem.appendChild(iconElem);
    workoutElem.appendChild(iconWrapperElem);

    
    var titleElem = document.createElement('div');
    titleElem.classList.add('honeycomb-cell__title');
    titleElem.innerHTML = workout.name;
    workoutElem.appendChild(titleElem);

    selection.appendChild(workoutElem);

    
  });

})();

function getClickFunction(e) {
  return function () {
    console.log(e);
    window.location = '/hex.html?workout=' + e;
  }
}