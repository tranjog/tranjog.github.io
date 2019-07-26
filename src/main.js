import createElement from 'https://github.com/tranjog/tranjog.github.io/blob/master/src/vdom/createElement';
import render from 'https://github.com/tranjog/tranjog.github.io/blob/master/src/vdom/render';
import mount from 'https://github.com/tranjog/tranjog.github.io/blob/master/src/vdom/mount';
import diff from 'https://github.com/tranjog/tranjog.github.io/blob/master/src/vdom/diff';
createElement.js

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


