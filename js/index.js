// Ensure that the script runs when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Retrieve references to HTML elements
    const form = document.getElementById('github-form');
    const search = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
    
    // Add a submit event listener to the form
    form.addEventListener('submit', function (e) {
      // Prevent the default form submission behavior
      e.preventDefault();
    
      // Clear any previous search results
      userList.innerHTML = '';
      reposList.innerHTML = '';
    
      // Retrieve the trimmed search term from the input field
      const githubSearch = search.value.trim();
    
      // Fetch GitHub user data based on the search term
      fetch(`https://api.github.com/search/users?q=${githubSearch}`)
        .then(function (response) {
          // Check if the response is okay; otherwise, throw an error
          if (!response.ok) {
            throw Error('Could not fetch users');
          }
          // Parse the response as JSON and return it as a promise
          return response.json();
        })
        .then(function (data) {
          // Loop through each user in the data and display their information
          data.items.forEach(function (user) {
            const userItems = document.createElement('li');
            userItems.innerHTML = `
              <img src="${user.avatar_url}" alt="${user.login}" width="30" height="30">
              <a href="${user.html_url}" target="_blank">${user.login}</a>
            `;
    
            userList.appendChild(userItems);
    
            // Add a click event listener to fetch and display user repositories
            userItems.addEventListener('click', function () {
              fetch(`https://api.github.com/users/${user.login}/repos`)
                .then(function (repos) {
                  // Check if the response is okay; otherwise, throw an error
                  if (!repos.ok) {
                    throw Error('Could not fetch repo');
                  }
                  // Parse the response as JSON and return it as a promise
                  return repos.json();
                })
                .then(function (reposData) {
                  // Clear the previous repository list
                  reposList.innerHTML = '';
    
                  // Loop through the repositories and display them
                  reposData.forEach(function (repo) {
                    const repoItem = document.createElement('li');
                    repoItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
    
                    reposList.appendChild(repoItem);
                  });
                })
                .catch(function (error) {
                  console.error('error getting repos:', error);
                });
            });
          });
        })
        .catch(function (error) {
          console.error('error fetching data from github:', error);
        });
    });
  });
  