import createElement from 'https://tranjog.github.io/src/vdom/createElement.js';
import render from 'https://tranjog.github.io/src/vdom/render.js';
import mount from 'https://tranjog.github.io/src/vdom/mount.js';
import diff from 'https://tranjog.github.io/src/vdom/diff.js';

const createVApp = (count) => createElement('div', {
    attrs: {
        id: 'app',
        dataCount: count,
    },
    children: [
        String (count),
        createElement('br'),
        ...Array.from ({ length: count}, () =>
        createElement('img',{
            attrs:{
            src: 'https://picsum.photos/200',
            }
        })),
    ]
});

let count = 0;
let vApp = createVApp(count);
let app = render(vApp);

let $rootEl = mount(app, document.getElementById('app'));

setInterval( () => {
    const vNewApp = createVApp(parseInt(Math.random() * 10));
    const patch = diff(vApp, vNewApp);
    $rootEl = patch($rootEl);
    vApp = vNewApp;
}, 1000);


