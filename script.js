const input = document.getElementById('input');
const content = document.getElementById('content-gitProfile');
const repository = document.getElementById('content-repository');
const client_id = '43046768003db25e7991';
const client_secret = 'd98b81dc0f569f0fd403309fedd5475427afcb87';

input.addEventListener('keyup', function () {
    const user = event.target.value;
    // console.log(user);
    if (user === '') {
        content.innerText = '';
        repository.innerText = '';
    } else {
        fetch(`https://api.github.com/users/${user}?client_id=${client_id}&client_secret=${client_secret}`, {
            method: "GET"
        }
            // , {
            //     client_id: '43046768003db25e7991',
            //     client_secret: 'd98b81dc0f569f0fd403309fedd5475427afcb87'
            // }
        ).then(response => {
            /**
             *  if the result json object contain the property 'message' it means the 
             *  promise is resolved and not rejected so a workaround is to use throw statement 
             *  so it will stop the rest of the code.
             */
            return response.json().then(result => {
                if (response.ok) {
                    return result
                } else {
                    throw new Error(result.message);
                }
            })
        }).then(result => {
            console.log("TEST", result)
            // console.log(result);
            
            // if (result.hasOwnProperty('message')) throw 'NOT FOUND';
            const updated_at = new Date(result.updated_at);
            const created_at = new Date(result.created_at);
            const updated = `${updated_at.getFullYear()}/${updated_at.getMonth()}/${updated_at.getDate()}`;
            const created = `${created_at.getFullYear()}/${created_at.getMonth()}/${created_at.getDate()}`;
            // console.log( 'tete : '+updated_at.getFullYear()+'/'+updated_at.getMonth()+'/'+updated_at.getDate());
            content.innerHTML = `
            <div class="username">${result.name === null ? 'N/A':result.name}<div>${result.email === null ? '' : result.email}</div></div>
            <div class="details">
                <div class="panel-avatar">
                    <img class="avatar" src="${result.avatar_url}">
                    <button><a href="${result.html_url}">Github profile</a></button>
                </div>
                <div class="panel-detail">
                    <div class="panel-detail-header">
                        <span>Public repos: ${result.public_repos}</span>
                        <span>Followers: ${result.followers}</span>
                        <span>Following: ${result.following}</span>
                        <span id='hireable'>Hireable: ${result.hireable === null ? 'N/A' : result.hireable? 'yes':'no'}</span>
                    </div>
                    <div class="panel-detail-row">Last update: ${updated}</div>
                    <div class="panel-detail-row">Company: ${result.company === null ? 'N/A' : result.company}</div>
                    <div class="panel-detail-row">blog/website: ${result.blog}</div>
                    <div class="panel-detail-row">Location: ${result["location"]} </div>
                    <div class="panel-detail-row">Since: ${created}</div>
                </div>
            </div>
            `;
            const hireable = document.getElementById('hireable');
            // console.log(hireable.innerText);
            if (result.hireable) hireable.style.backgroundColor = '#00b300'
            else if (result.hireable === false) hireable.style.backgroundColor = '#f00';
            return fetch(`https://api.github.com/users/${user}/repos?client_id=${client_id}&client_secret=${client_secret}&sort=updated&direction=asc&per_page=5`);
        }).then(repos => {
            return repos.json();
        }).then(repos => {
            // console.log(repos.length);
            repository.innerHTML = `<h3>Repository list</h3>`;
            repos.forEach(el => {
                const repo = `<div class="repos-row">
                            <div class="repos-row-name">
                                <strong>${el.name}: </strong><span>${el.description === null ? '' : el.description}</span>
                            </div>
                            <div class="repos-row-stats">
                                <button><a target='_blank' href="${el.html_url}">Repo</a></button>
                                <button>Watchers: ${el.watchers_count}</button>
                                <button>Forks: ${el.forks}</button>
                            </div>
                            </div>`;
                repository.insertAdjacentHTML('beforeend', repo);
            })
        }).catch(error => {
            console.log("error",error);
            content.innerText = '';
            repository.innerText = '';
        })
    }

})

