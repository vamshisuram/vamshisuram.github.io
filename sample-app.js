var userAccessToken;

function logIntoApp() {
    FB.login(function(response) {
        console.log('response');
        console.log(response);
        userAccessToken = response.authResponse.accessToken;
    }, {
        scope: 'public_profile'
    });
}

/*FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
        console.log('user has already logged into app');
        userAccessToken = response.authResponse.accessToken;
    } else if (response.status === 'not_authorized') {
        console.log('user logged into FB, but didnot authenticate your app');
        logIntoApp();
    } else {
        console.log('user not logged into FB');
        logIntoApp();
    }
});*/

logIntoApp();

function createElement(type, text, className, eventHandler) {
    var ele = document.createElement(type);
    ele.className = className;
    var eleText;
    if (text) {
        eleText = document.createTextNode(text);
        ele.appendChild(eleText);
    }
    if (eventHandler) {
        ele.addEventListener('click', eventHandler);
    }
    return ele;
}

function getEventHandler(data) {
    return function(event) {
        var likeText = event.target.innerHTML;
        if (likeText === 'Like') {
            event.target.innerHTML = 'Liked';
            event.target.className = 'likedBtn';
        } else {
            event.target.innerHTML = 'Like';
            event.target.className = 'likeBtn';
        }
    };
}

function createPageSection(pageData) {
    var collection = document.getElementById("pagesList");
    var div = document.createElement('div');
    div.id = pageData.id;
    div.className = 'pageSection';

    var name = createElement('p', pageData.name, 'name');
    var category = createElement('p', pageData.category, 'category');
    var btn = createElement('button', 'Like', 'likeBtn', getEventHandler(pageData));

    div.appendChild(name);
    div.appendChild(category);
    div.appendChild(btn);
    collection.appendChild(div);
}

function addPagesDataToDOM(data) {
    var collection = document.getElementById("pagesList");

    // remove existing list
    while (collection.hasChildNodes()) {
        collection.removeChild(collection.lastChild);
    }

    // create new list
    data.forEach(function(pageData) {
        createPageSection(pageData);
    });
}

function searchForPages(text) {
    FB.api('/search', 'GET', {
        q: text,
        type: 'page',
        access_token: userAccessToken,
        fields: "id,name,category"
    }, function(response) {
        console.log("searching for pages");
        console.log(response);
        var topTenPages = response.data.slice(0, 10);
        addPagesDataToDOM(topTenPages);
    });
}

window.getPages = function() {
    var text = document.getElementById("searchText").value;
    searchForPages(text);
}
