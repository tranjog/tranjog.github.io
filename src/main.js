import createElement from './vdom/createElement';
import render from './vdom/render';
import mount from './vdom/mount';
import diff from './vdom/diff';

// const vApp = {
//     tagName='div',
//     attrs:{
//         id:"app",
//     },
//     children: [
//         'hello world',
//     ],
// }

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


