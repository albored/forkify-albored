import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import booksmarksView from './views/booksmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';
// import { async } from 'regenerator-runtime';

// const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // 0 results view to mark selected search
    resultsView.update(model.getSearchResultsPage());
    booksmarksView.update(model.state.bookmarks);
    // 1 Load recipe
    await model.loadRecipe(id);
    // 2 Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1 Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // 2 Load search results
    await model.loadSearchResults(query);
    // 3 Render results
    resultsView.render(model.getSearchResultsPage());
    // 4 render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (gotoPage) {
  // 1 Render new results
  resultsView.render(model.getSearchResultsPage(gotoPage));
  // 2 render new initial pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update recipe servings
  model.updateServings(newServings);
  // update Servings
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controleAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  booksmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  booksmarksView.render(model.state.bookmarks);
};

const controleAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.upLoadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    booksmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('what!', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  booksmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controleAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controleAddRecipe);
};

init();
