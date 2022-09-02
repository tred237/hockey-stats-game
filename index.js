const init = () => {
    let p = document.createElement('p')
    p.textContent = 'hello!'
    document.querySelector('body').appendChild(p)
}

addEventListener('DOMContentLoaded', init)