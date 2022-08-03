"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/** Checks if a particular story is a user's favorite */

function isStoryFavorite(story, user) {
  const favorited = user.isFavorite(story);
  const starType = favorited ? "fas" : "far";
  return `<span class="star"> <i class="${starType} fa-star"></i></span>`;
}

/** Generates a delete button icon HTML */

function generateDel() {
  return `<span class="trash"> <i class="fa-trash fas"></i></span>`;
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * - del: boolean to show delete story button
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, del) {
  // console.debug("generateStoryMarkup", story);

  const canSee = Boolean(currentUser instanceof User); //Checks to see if currentUser exists and is a instance of User

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${del ? generateDel() : ""}
        ${canSee ? isStoryFavorite(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets list of favorite stories from a user, generates their HTML for them */

function putFavStoriesOnPage() {
  if (currentUser === undefined) {
    alert('You need to be logged in!');
    return;
  }
  $allStoriesList.empty();

  // loop through all favorite stories from user and generate HTML for them
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Gets a list of stories created by a user, generates their HTML for them with a delete icon */

function putMyStoriesOnPage() {
  if (currentUser === undefined) {
    alert('You need to be logged in!');
    return;
  }
  $allStoriesList.empty();

  // loop through all favorite stories from user and generate HTML for them
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story, true);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** Handles story submission once the user clicks on the form submit button. Sends submission data to API and prepends markup to story list. */

$submitStoryBtn.on("click", submitStory);

async function submitStory(evt) {
  evt.preventDefault();
  const newStory = await storyList.addStory(currentUser,{title: $titleInput.val(), author: $authorInput.val(), url: $urlInput.val()});
  storyList.stories.push(newStory);
  currentUser.ownStories.push(newStory);
  const newMarkup = generateStoryMarkup(newStory);
  $allStoriesList.prepend(newMarkup);
}

/** Handles favoriting a story. */

$allStoriesList.on("click", ".star", favoriteStory);

async function favoriteStory(evt) {
  const $target = $(evt.target); //Turns it into jQuery so we can access its methods
  const $theLi = $target.closest('li'); //Finds story content of our target which is a Li
  const storyId = $theLi.attr('id')
  const story = storyList.stories.find(val => val.storyId === storyId); //Finds the story we want to favorite in the storyList
  if ($target.hasClass('fas')) {
    await currentUser.delFav(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFav(story);
    $target.closest("i").toggleClass("fas far");
  }
}

/** Handles deleting a story. */

$allStoriesList.on("click", ".trash", delStory);

async function delStory(evt) {
  const $target = $(evt.target); //Turns it into jQuery so we can access its methods
  const $theLi = $target.closest('li'); //Finds story content of our target which is a Li
  const storyId = $theLi.attr('id')
  const story = storyList.stories.find(val => val.storyId === storyId); //Finds the story we want to favorite in the storyList
  await storyList.delStory(currentUser, story);
  storyList.stories = storyList.stories.filter(val => val.storyId !== story.storyId);
  putMyStoriesOnPage();
}