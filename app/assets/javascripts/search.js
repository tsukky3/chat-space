$(document).on('turbolinks:load', function() {
  $(function() {
    var search_user = $("#user-search-result");
    function appendUser(user) {
      var html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">${ user.name }</p>
          <a class="user-search-add chat-group-user__btn chat-group-user__btn--add" data-user-id="${ user.id }" data-user-name="${ user.name }">追加</a>
      </div>
      `
      search_user.append(html);
    }

    function appendNoUser(user) {
      var html = `
      <div class="chat-group-user clearfix">
        <p class="chat-group-user__name">${ user }</p>
      </div>
      `
      search_user.append(html);
    }

    function appendMember(id, name) {
      var html = `
      <div class='chat-group-user clearfix js-chat-member' id='chat-group-user-${ id }'>
        <input name='group[user_ids][]' type='hidden' value='${ id }'>
        <p class='chat-group-user__name'>${ name }</p>
        <a class='user-search-remove chat-group-user__btn chat-group-user__btn--remove js-remove-btn' data-user-id='${ id }'>削除</a>
      </div>
      `
      return html
    }

    $('#user-search-field').on('keyup', function() {
      var input = $('#user-search-field').val();
      $.ajax({
        type: 'GET',
        url: '/users',
        data: { name: input },
        dataType: 'json'
      })

      .done(function(users){
        $("#user-search-result").empty();
        if ( users.length !== 0 ) {
          users.forEach(function(user) {
            appendUser(user);
          });
        } else {
          appendNoUser("一致するユーザはいません");
        }
      })
      .fail(function() {
        alert('ユーザの検索に失敗しました')
      });

      $('#user-search-result').on('click', '.user-search-add', function() {
        var id = $(this).data('userId')
        var name = $(this).data('userName');
        var insertMember = appendMember(id, name);
        $('#chat-group-users').append(insertMember);
        $(this).parent('.chat-group-user').remove();
      });

      $('#chat-group-users').on('click', '.user-search-remove', function() {
        var id = $(this).data('userId');
        $(`#chat-group-user-${id}`).remove();
      })
    });
  });
});
