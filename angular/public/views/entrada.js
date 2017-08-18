'use strict';

var entradaContacto = angular
  .module('app.entrada', [
    'ngRoute',
    'ui.router',
    'ngCookies',
  ])
  .config(['$stateProvider', function($stateProvider) {

      var settings = {
          name: 'app.entrada',
          //abstract: true,
          url: '/entrada',
          views: {
            '@': {
              templateUrl: 'views/entrada.html',
              controller: 'entradaController'
            }
          }
      };

      $stateProvider.state(settings);

  }])
  .controller("entradaController",['$scope','$http','$cookies','UserService', '$sce',
  function entradaController($scope, $http, $cookies, UserService, $sce) {
     if (Object.keys(UserService.getEntradaSeleccionada()).length==0) {
      console.log('No hay ninguna entrada seleccionada :(');
      var ultimaEntrada = $cookies.getObject('ultimaEntradaVisitada');
      UserService.setEntradaSeleccionada(ultimaEntrada);
    };
    $scope.entradaSeleccionada = UserService.getEntradaSeleccionada();
    $scope.comentarios = {};
    
    // Obtenemos todos los comentarios de la entrada seleccionada
    $http.get('/api/comentario/'+UserService.getEntradaSeleccionada().id_entrada).success(function(comentarios) {
      console.log(comentarios);
      comentarios = comentarios.sort(function(a, b){return a.createdAt.localeCompare(b.createdAt)});
      $scope.comentarios = comentarios;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

    ///////////COMENTARIOS

            var markdown, postAuthorEmail;
        postAuthorEmail = 'jan.kanty.pawelski@gmail.com';
        $scope.comments = [
            {
                id: 1,
                author: {
                    name: 'Jan-Kanty Pawelski',
                    email: 'jan.kanty.pawelski@gmail.com',
                    website: 'pawelski.io'
                },
                content: 'I made it! My awesome angular comment system. What do you think?',
                loved: false
            },
            {
                id: 2,
                author: {
                    name: 'Tomasz Jakut',
                    email: 'comandeer@comandeer.pl',
                    website: 'comandeer.pl'
                },
                content: 'Nice looking. Good job dude ;)',
                loved: true
            },
            {
                id: 3,
                author: {
                    name: 'Jan-Kanty Pawelski',
                    email: 'jan.kanty.pawelski@gmail.com',
                    website: 'pawelski.io'
                },
                content: '<span class="reply">@Tomasz Jakut</span> Thanks man. I tried hard.',
                loved: false
            },
            {
                id: 4,
                author: {
                    name: 'Grzegorz B\u0105k',
                    email: 'szary.elf@gmail.com',
                    website: 'gregbak.com'
                },
                content: 'Third! Amazing system man! By the way check my new website: <a href="//gregbak.com">http://gregbak.com</a>.',
                loved: false
            }
        ];
        $scope.newComment = {};
        markdown = function (string) {
            string = string.replace(/(@.+)@/g, '<span class="reply">$1</span>');
            string = string.replace(/\*\*(.+)\*\*/g, '<strong>$1</strong>');
            string = string.replace(/__(.+)__/g, '<strong>$1</strong>');
            string = string.replace(/\*(.+)\*/g, '<em>$1</em>');
            string = string.replace(/_(.+)_/g, '<em>$1</em>');
            string = string.replace(/``(.+)``/g, '<code>$1</code>');
            string = string.replace(/`(.+)`/g, '<code>$1</code>');
            return string;
        };
        $scope.parseContent = function (content) {
            return $sce.trustAsHtml(content);
        };
        $scope.isAuthor = function (email) {
            return email === postAuthorEmail;
        };
        $scope.getGravatar = function (email) {
            var hash;
            if (email === void 0) {
                email = '';
            }
            hash = email.trim();
            hash = hash.toLowerCase();
            hash = md5(hash);
            return '//gravatar.com/avatar/' + hash + '?s=104&d=identicon';
        };
        $scope.loveComment = function (commentId) {
            var comment, i, len, ref, results;
            ref = $scope.comments;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                if (window.CP.shouldStopExecution(1)) {
                    break;
                }
                comment = ref[i];
                if (comment.id === commentId) {
                    results.push(comment.loved = !comment.loved);
                } else {
                    results.push(void 0);
                }
            }
            window.CP.exitedLoop(1);
            return results;
        };
        $scope.addReply = function (author) {
            if ($scope.newComment.content === void 0) {
                $scope.newComment.content = '';
            }
            if ($scope.newComment.content.search('@' + author + '@') === -1) {
                if ($scope.newComment.content[0] === '@') {
                    $scope.newComment.content = ', ' + $scope.newComment.content;
                } else {
                    $scope.newComment.content = ' ' + $scope.newComment.content;
                }
                return $scope.newComment.content = '@' + author + '@' + $scope.newComment.content;
            }
        };
        $scope.addNewComment = function () {
            $scope.newComment.id = $scope.comments.length + 1;
            $scope.newComment.author.website = $scope.newComment.author.website.replace(/https?:\/\/(www.)?/g, '');
            $scope.newComment.content = markdown($scope.newComment.content);
            $scope.newComment.loved = false;
            $scope.comments.push($scope.newComment);
            return $scope.newComment = {};
        };
        return $scope.$watch('newComment.email', function (newValue, oldValue) {
            var newCommentAvatar;
            newCommentAvatar = document.getElementById('newCommentAvatar');
            return newCommentAvatar.src = $scope.getGravatar($scope.newComment.email);
        });




}]);

