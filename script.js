window.onload = function () {
  const search = document.getElementById("search"),
    submit = document.getElementById("submit"),
    random = document.getElementById("random"),
    mealsEl = document.getElementById("meals"),
    resultHeading = document.getElementById("result-heading"),
    single_mealEl = document.getElementById("single-meal");

  // Search meal and fetch from API
  function searchMeal(e) {
    e.preventDefault();

    single_mealEl.innerHTML = "";

    const term = search.value;

    if (term.trim()) {
      //if empty
      fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          resultHeading.innerHTML = `<h2>Results for '${term}':</h2>`;

          if (data.meals === null) {
            resultHeading.innerHTML = `<p>There are no search results<p>`;
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
              )
              .join("");
          }
        });
      search.value = "";
    } else {
      alert("Please enter a search term");
    }
  }

  function addMeal(meal) {
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
      <h1>${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <div class="single-meal-info">
        ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
        ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
      </div>
      <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
          ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
      </div>
    </div>
  `; //the join is for making it like a string
  }

  function getMealById(MeaLID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${MeaLID}`)
      .then((res) => res.json())
      .then((data) => {
        //   console.log(data);
        const meal = data.meals[0];
        addMeal(meal);
      });
  }

  submit.addEventListener("submit", searchMeal);
  mealsEl.addEventListener("click", (e) => {
    const mealinfo = e.path.find((item) => {
      if (item.classList) {
        return item.classList.contains("meal-info");
      } else {
        return false;
      }
    });
    if (mealinfo) {
      const mealid = mealinfo.getAttribute("data-mealID");
      getMealById(mealid);
    }
  });
};
