const zip = (xs, ys) =>{
    const zipped = [];
    for (let i=0; i < Math.min(xs.length, ys.length); i++){
        zipped.push([xs[i], ys[i]]);
    }
    return zipped;
}

const diffAttrs = (oldAttrs, newAttrs) => {
    const patches = [];

    //set new attributes
    for (const [k,v] of Object.entries(newAttrs)) {
        patches.push($node => {
            $node.setAttribute(k,v);
            return $node;
        });
    }

    //remove old attributes
    for (const k in oldAttrs) {
        if (!(k in newAttrs)){
            patches.push($node => {
                $node.removeAttribute(k);
                return $node;
            });
        }
    }
    return $node =>{
        for (const patch of patches){
            patch($node);
        }
    }
};

const diffChildren = (oldVChildren, newVChildren) => {
    const childPatches =[];
    for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren) ) {
        childPatches.push(diff(oldVChild, newVChild));
    }

    const additionalPatches = [];

    for (const additionalVChild of newVChildren.slice(oldVChildren.length)){
        additionalPatches.push($node => {
            $node.appendChild(render(additionalVChild));
            return $node;
        });
    }
    return $parent => {
        for (const [patch, child ] of zip(childPatches, $parent.childNodes)){
            patch(child);
        }
        for (const patch of additionalPatches){
            patch($parent);
        }
        return $parent;
    };

};

const diff = (vOldNode, vNewNode) => {
    if (vNewNode === undefined){
        return $node => {
            $node.remove();
            return undefined;
        };
    }
    
    if ((typeof vOldNode === 'string') ||
        (typeof vNewNode === 'string')){
            if (vOldNode !== vNewNode){
                return $node => {
                    const $newNode = render(vNewNode);
                    $node.replaceWith($newNode);
                    return $newNode;
                };
            } else {
                return $node => undefined;
            }
        }

    if (vOldNode.tagName !== vNewNode.tagName){
        return $node => {
            const $newNode = render(vNewNode);
            $node.replaceWith($newNode);
            return $newNode;
        };
    }

    const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs);
    const patchChildren = diffChildren(vOldNode.children, vNewNode.children);
    
    return $node => {
        patchAttrs($node);
        patchChildren($node);
        return $node;
    };
};

const mount = ($node, $target) => {
    $target.replaceWith($node);
    return $node;
}

const renderElem = ({tagName, attrs, children}) => {
    const $el = document.createElement(tagName);

    //set attributes
    for (const [key, value] of Object.entries(attrs)){
        $el.setAttribute(key, value);
    }

    //set children
    for (const child of children){
        const $child = render(child);
        $el.appendChild($child);
    }

    return $el;
};

const render = (vNode) => {
    if (typeof vNode === 'string'){
        return document.createTextNode(vNode);
    }

    return renderElem(vNode);
}

const createElement = (tagName, { attrs = {}, children =[] } = {} ) => {
    return {
        tagName,
        attrs,
        children,
    }
};

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
