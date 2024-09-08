const search = document.getElementById('search'),
  submit = document.getElementById('submit'),
  random = document.getElementById('random'),
  mealsEl = document.getElementById('meals'),
  resultHeading = document.getElementById('results-heading'),
  single_mealEl = document.getElementById('single-meal');

// Search meal and fetch from API
function searchMeal(e) {
  e.preventDefault();

  // Clear Signle meal
  single_mealEl.innerHTML = '';

  // Get search term
  const term = search.value;

  //   checks for empty
  if (term.trim() /*!== " "*/) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resultHeading.innerHTML = `<h2>Search Result for '${term}' </h2>`;

        if (data.meals === null) {
          resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`;
        } else {
          mealsEl.innerHTML = data.meals
            .map(
              (meal) => `
                <div class="meal">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                    <div class="meal-info" data-mealID="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `
              // console.log()
            )
            .join('');
        }
      });
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
}

// fetch meal by ID
function getMealByID(mealID) {
  fetch(`http://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];
      console.log(meal);
      addMealToDOM(meal);
    });
}
// add to DOM
function addMealToDOM(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
        <div class="single-meal">
            <h1> ${meal.strMeal} </h1>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
                <p>${meal.strInstructions}</p>
                <h2>Ingredients</h2>
                <ul>
                ${ingredients.map((ing) => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
        </div> 
    `;
}

// event listeners
submit.addEventListener('submit', searchMeal);

// mealsEl.addEventListener('click', (e) => {
//   const mealInfo = e.composePath.find((item) => {
//     console.log(item);
//   });
// });

mealsEl.addEventListener('click', (e) => {
  const mealInfo = e.target.closest('.meal-info');
  if (mealInfo) {
    const mealID = mealInfo.getAttribute('data-mealID');
    console.log(mealID);
    getMealByID(mealID);
  }
});
