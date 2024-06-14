function handleAttributeChange(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'hidden') {
            const target = mutation.target;
            let name = target.getAttribute('aria-label');
            if (target.hasAttribute('hidden')) {
                let element = document.getElementById(`${name}-grant-all`)
                element.remove();
            } else {
                createForTab(name);
            }
        }
    }
}

function createForTab(name) {
    let root = document.querySelector('div[name="integration_permissions"]')
    let section = root.querySelector(`section[aria-label="${name}"]`);


    let newElement = document.createElement('div')
    newElement.id = `${name}-grant-all`
    newElement.innerHTML = `
    <input type="button" name="grant-all" id="grant-all" value="Grant all">
    <input type="button" name="reset-all" id="reset-all" value="Reset all">
    `
    root.insertBefore(newElement, section)
    
    document.getElementById('grant-all').addEventListener('click', (e) => {
        let menus = section.querySelectorAll('details-menu .SelectMenu-list')
        menus.forEach(menu => {
            let options = menu.querySelectorAll('label');
            options[options.length-1].click();
        });
    })

    document.getElementById('reset-all').addEventListener('click', (e) => {
        let menus = section.querySelectorAll('details-menu .SelectMenu-list')
        menus.forEach(menu => {
            let element = menu.querySelector('label')
            console.log(element);
            element.click();
            if (element.getAttribute('aria-checked') !== 'true') {
                setTimeout(() => {
                element.click();
                }, 100);
            }
        });
    })
    
}

let repo_element = document.querySelector(`section[aria-label="repository-permissions"]`);
let user_element = document.querySelector(`section[aria-label="user-permissions"]`);
const repo_observer = new MutationObserver(handleAttributeChange);
repo_observer.observe(repo_element, { attributes: true });

const user_observer = new MutationObserver(handleAttributeChange);
user_observer.observe(user_element, { attributes: true });

if(!repo_element.hasAttribute('hidden')) {
createForTab("repository-permissions");
}

if(!user_element.hasAttribute('hidden')) {
createForTab("user-permissions");
}