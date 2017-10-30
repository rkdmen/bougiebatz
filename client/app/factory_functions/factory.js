angular.module('legacyOwls.factory', [])

  .factory('Trending', ['$http', function($http) {

    //GET request
    var getAll = function() {
      return $http({
        method: 'GET',
        url: '/api/article'
      });
    }

    //POST and PUT requests to the article schema
    var like = function(article) {
      // if (article.likes) {
      //     return $http({
      //         method: 'PUT',
      //         url: '/api/article',
      //         data: article
      //     });
      // }
      // else {
      //     return $http({
      //         method: 'POST',
      //         url: '/api/article',
      //         data: article
      //     });
      // }
      return $http({
        method: 'POST',
        url: '/api/article',
        data: article
      });
    }

    return {
      getAll: getAll,
      like: like
    }

  }]) // end of Trending factory

  .factory('SavedArticles', ['$http', function($http) {

    var getArticlesFromDB = function() {
      return $http({
          method: 'GET',
          url: '/database'
        })
        .then(function(resp) {
          return resp.data.savedStories;
        });
    }

    var saveArticleToDB = function(article) {
      return $http({
        method: 'POST',
        url: '/database',
        data: article
      });
    }

    var getLikesFromDB = function() {
      return $http({
          method: 'GET',
          url: '/likes',
        })
        .then(function(resp) {
          return resp.data.likedStories;
        })
    }

    var saveLikeToDB = function(url) {
      return $http({
        method: 'POST',
        url: '/likes',
        data: url
      });
    }

    return {
      getArticlesFromDB: getArticlesFromDB,
      saveArticleToDB: saveArticleToDB,
      getLikesFromDB: getLikesFromDB,
      saveLikeToDB: saveLikeToDB
    }

  }]) //end of SavedArticles factory

  .factory('Articles', ['$http', function($http) {

    var options = [
      'all',
      'arts',
      'blogs',
      'books',
      'briefing',
      'business',
      'food',
      'health',
      'magazine',
      'movies',
      'multimedia',
      'multimedia/photos',
      'n.y. / region',
      'obituaries',
      'opinion',
      'public editor',
      'real estate',
      'science',
      'sports',
      'style',
      'sunday review',
      'technology',
      'theater',
      'today\'s paper',
      'travel',
      'u.s.',
      'washington',
      'week in review',
      'well',
      'world',
      'your money'
    ];

    var getLatest = function(params) {
      return $http({
        method: 'GET',
        url: '/api/Large',
        params: params
      });
    }

    return {
      options: options,
      getLatest: getLatest
    }

  }])

  .factory('AuthService', ['$q', '$timeout', '$http',
    function($q, $timeout, $http) {

      // create user variable
      var user = null;

      // return available functions for use in the controllers
      return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus,
        login: login,
        logout: logout,
        register: register
      });

      function isLoggedIn() {
        if (user) {
          return true;
        } else {
          return false;
        }
      }

      function getUserStatus() {
        return $http.get('/user/status')
          // handle success
          .success(function(data) {
            if (data.status) {
              user = true;
            } else {
              user = false;
            }
          })
          // handle error
          .error(function(data) {
            user = false;
          });
      }

      function login(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/login', { username: username, password: password })
          // handle success
          .success(function(data, status) {
            if (status === 200 && data.status) {
              user = true;
              deferred.resolve();
            } else {
              user = false;
              deferred.reject();
            }
          })
          // handle error
          .error(function(data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }

      function logout() {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a get request to the server
        $http.get('/user/logout')
          // handle success
          .success(function(data) {
            user = false;
            deferred.resolve();
          })
          // handle error
          .error(function(data) {
            user = false;
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }

      function register(username, password) {

        // create a new instance of deferred
        var deferred = $q.defer();

        // send a post request to the server
        $http.post('/user/register', { username: username, password: password })
          // handle success
          .success(function(data, status) {
            if (status === 200 && data.status) {
              deferred.resolve();
            } else {
              deferred.reject();
            }
          })
          // handle error
          .error(function(data) {
            deferred.reject();
          });

        // return promise object
        return deferred.promise;

      }

    }
  ])


  .factory('Comment', ['$http', function($http) {
    // console.log('comment called')
    var postComment = function(data) {
      // console.log(data , ' comment factory data**');
      return $http({
        method: 'POST',
        url: 'api/comment',
        data: data
      })
    }

    var getAllComment = function(article) {
      // console.log('getallcomment called');
      return $http({
        method: 'GET',
        url: 'api/comment',
        params: { article: article }
      });
    }

    return {
      postComment: postComment,
      getAllComment: getAllComment
    }

  }])

  .factory('Photo', [function() {

    var pic = {};

    var savePhoto = function(photo) {
      pic = photo;
    }

    var getPhoto = function() {
      return pic;
    }

    return {
      savePhoto: savePhoto,
      getPhoto: getPhoto
    }

  }]);