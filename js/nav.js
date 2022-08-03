"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Show story submission form/hide when clicking $navStory */

$navStory.on("click", navStoryClick);

function navStoryClick() {
  $storyForm.toggleClass("hidden");
}

/** Show favorite stories in a new page upon clicking */

$navFav.on("click", navFavClick);

function navFavClick() {
  putFavStoriesOnPage();
}

/** Show my stories in a new page upon clicking */

$navMyStory.on("click", navMyStory);

function navMyStory() {
  putMyStoriesOnPage();
}
