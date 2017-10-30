//Module that controls savedStory.html page
angular.module('legacyOwls.savedStory', [])

  .controller('savedStoryController', ['$scope', 'SavedArticles',
    function($scope, SavedArticles) {
      $scope.savedArticles = [];

      $scope.downloadArticles = function() {

        //call factory function .getArticlesFromDB
        //to download a user's saved articles from its savedStories array
        //then reassigns that to .savedArticles
        SavedArticles.getArticlesFromDB()
          .then(function(response) {
            $scope.savedArticles = response;
          });

      }; //end of downloadArticles function

      //run downloadArticles
      $scope.downloadArticles();

    }
  ])