angular.module('legacyOwls.comment', ["pageslide-directive"])

  .controller('commentBox',

    ['$scope', '$location', 'Trending', 'Articles', 'Comment',
      function($scope, $location, Trending, Articles, Comment) {
        $scope.testComment;
        $scope.idx;
        $scope.articleTitle;
        $scope.article;
        $scope.articles;
        $scope.refreshComment;
        $scope.newComment = []; //Temporary array for new comments added


        /***************************************
         *          For Trending Articles
         ***************************************/

        $scope.toggleTrending = function(index) {
          $scope.checked = !$scope.checked
          $scope.idx = index;
          console.log($scope.idx)
          Trending.getAll().then(function(res) {
            $scope.articleTitle; //Need to find articleTitle
            $scope.article = res.data[$scope.idx];
            // console.log(res.data[$scope.idx]);
            console.log($scope.article.commentData, ' LINE 32, comment.js')
            console.log(res.data);
            $scope.testComment = $scope.article.commentData;
          })

          $scope.refreshComment = function() {

            //Comment.getallComment calls factory comment function to make a get request to
            //database to retrieve all data to regarding to specific article that is clicked based on clicked index / article.
            Comment.getAllComment($scope.article).then(function(res) {
              console.log(res, ' RES, comment.js')
              // $scope.testComment = res.data;
            })
          }();

          $scope.submitComment = function() {
            var sendToDB = {};
            sendToDB.article = $scope.article.articleData;
            var commentData = {}
            commentData.articleTitle = $scope.article.title
            commentData.user = $scope.username = 'Anonymous'; //grab user name
            commentData.comment = $scope.userInputComment;
            sendToDB.commentData = commentData;
            Comment.postComment(sendToDB)
            $scope.newComment.push($scope.userInputComment);
            $scope.userInputComment = '';
          }
        } //End of Toggle Button for Article


        /***************************************
         *           For Latest Articles
         ***************************************/

        //When Comment Form is clicked, toggle function is called to use
        //pageslide directive to show the comment form div.
        $scope.toggle = function(index) {

          //$scope.checked is angular-pageslide directive
          $scope.checked = !$scope.checked;

          $scope.idx = index;
          $scope.newComment = []; //clears array of previous comments added
          $scope.getLatest = function() {
            var params = {
              source: 'all',
              section: $scope.selectedOption,
              time: '24',
              limit: 40,
              offset: 0
            }

            //Article.getLatest is called upon toggle in order for index to be match from photo that is displayed on html.
            Articles.getLatest(params)
              .then(function(response) {
                $scope.articles = response.data.results.filter(function(photo) {
                  // only want the articles that have a photo url - some of them have multimedia = ''
                  // $scope.urls[photo.url] ? photo.likes = $scope.urls[photo.url] : photo.likes = 0;
                  return photo.multimedia.length === 4;
                });
                $scope.article = $scope.articles[$scope.idx];
                // console.log($scope.article, ' LINE 81, comment.js ')

                //refreshComment is called when toggle is clicked at same time..
                $scope.refreshComment = function() {

                  //Comment.getallComment calls factory comment function to make a get request to
                  //database to retrieve all data to regarding to specific article that is clicked based on clicked index / article.
                  Comment.getAllComment($scope.article).then(function(res) {
                    // console.log(res, ' RES, comment.js')
                    $scope.testComment = res.data;
                  })
                }();
              });
          }();

          //submitComment takes input from user comment field and make a post request to database
          $scope.submitComment = function() {

            //sendToDB object contains article object, user input data
            var sendToDB = {};
            sendToDB.article = $scope.article;

            //commentData contains title of article, comment input
            var commentData = {};
            commentData.articleTitle = $scope.article.title;
            commentData.user = $scope.username = 'Anonymous'; //Task: Need to grab username
            commentData.comment = $scope.userInputComment;
            sendToDB.commentData = commentData;

            //Comment.postComment calls factory comment function to make a post request do database
            Comment.postComment(sendToDB);

            //comment is pushed to temporary array to display what user recently commented
            $scope.newComment.push($scope.userInputComment);
            $scope.userInputComment = '';

          }

        } //End of Toggle Button for Latest
      }
    ]);