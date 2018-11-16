const input = document.getElementById('input');
const content = document.getElementById('content-gitProfile');
const repository = document.getElementById('content-repository');
const client_id = '43046768003db25e7991';
const client_secret ='d98b81dc0f569f0fd403309fedd5475427afcb87';

input.addEventListener('keyup', function () {
    const user = event.target.value;
    fetch(`https://api.github.com/users/${user}?client_id=${client_id}&client_secret=${client_secret}`
    // , {
    //     client_id: '43046768003db25e7991',
    //     client_secret: 'd98b81dc0f569f0fd403309fedd5475427afcb87'
    // }
    )
    .then(result => {
        return result.json();
    })
    .then(result => {
        console.log(result);
        content.innerHTML = `
            <div class="username">${result.name}<div>${result.email === null ? '':result.email}</div></div>
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
                        <span id='hireable'>Hireable: ${result.hireable === null?'N/A':result.hireable}</span>
                    </div>
                    <div class="panel-detail-row">Last update: ${result.updated_at}</div>
                    <div class="panel-detail-row">Company: ${result.company === null? 'N/A':result.company}</div>
                    <div class="panel-detail-row">blog/website: ${result.blog}</div>
                    <div class="panel-detail-row">Location: ${result["location"]} </div>
                    <div class="panel-detail-row">Since: ${result.created_at}</div>
                </div>
            </div>
            `;
            const hireable = document.getElementById('hireable');
            console.log(hireable.innerText);
            if( result.hireable) hireable.style.backgroundColor = '#00b300'
            else if ( result.hireable === false) hireable.style.backgroundColor ='#f00';
        return fetch(`https://api.github.com/users/${user}/repos?client_id=${client_id}&client_secret=${client_secret}&sort=updated&direction=asc&per_page=5`);
    }).then(repos =>{
        return repos.json();
    }).then(repos=>{
        console.log(repos.length);
        repository.innerHTML = `<h3>Repository list</h3>`;
        repos.forEach( el => {
            const repo =    `<div class="repos-row">
                            <div class="repos-row-name">
                                <strong>${el.name}: </strong><span>${el.description === null? '' :el.description}</span>
                            </div>
                            <div class="repos-row-stats">
                                <button><a target='_blank' href="${el.html_url}">Repo</a></button>
                                <button>Watchers: ${el.watchers_count}</button>
                                <button>Forks: ${el.forks}</button>
                            </div>
                            </div>`;
            repository.insertAdjacentHTML('beforeend',repo);
        })
    })
    .catch(error => {
        console.log(error);
    })
})