import { T, now } from "./modules/timeline-monad";
const hljs = require('highlight.js');
const _sce = document.scrollingElement;
const sce = _sce == null
    ? {}
    : _sce;
const consoleTL = ((console) => T((self) => self.sync((a) => {
    console.log(a);
    return a;
})))(console);
const log = (a) => (consoleTL[now] = a);
const linesMappingTL = T();
const asciidoctor = require('asciidoctor.js')();
const registry = asciidoctor.Extensions.create();
import { linemap } from './ext';
linemap(registry)(linesMappingTL);
/*
import('../extensions/highlight.js/index.js')
  .then((module: any) => {

    module.register(registry);

  });
*/
const headElTL = T();
headElTL[now] =
    document
        .getElementsByTagName("head")[0];
let count = 0;
const render = (dataTL) => (baseOption) => (f) => {
    try {
        console.log(count++);
        const headTargetEl = document
            .getElementsByTagName("head")[0];
        const selfEl = document
            .getElementsByTagName("script")[0];
        const bodyTargetEl = document
            .getElementsByTagName("body")[0];
        const data = dataTL[now];
        const addOption = {
            base_dir: data.dir_name.dir,
            extension_registry: registry,
            sourcemap: true,
        };
        const option = //destructive for {}
         Object.assign({}, baseOption, addOption);
        const html = asciidoctor
            .convert(data.text, option);
        //---------get html
        const parser = new DOMParser();
        const htmlEl = parser
            .parseFromString(html, "text/html");
        // consoleTL[now] = htmlEl;
        //copy body attribute
        /*
                for (let name in htmlEl
                  .parentElement
                  .attributes) {
                  bodyTargetEl
                    .setAttribute(name,
                      bodyEl.attributes[name].value);
                };
        */
        //---------get head
        const headEl = htmlEl
            .getElementsByTagName("head")[0];
        // consoleTL[now] = headEl;
        /*
                console.log(
                  headEl.isEqualNode(headElTL[now] as HTMLBaseElement)
                );
        */
        headEl.isEqualNode(headElTL[now])
            ? undefined
            : (() => {
                const headChildlenEls = Array.prototype
                    .slice.call(headEl.children);
                headTargetEl.innerHTML = "";
                headChildlenEls.map((el) => headTargetEl
                    .insertAdjacentElement("beforeend", el));
                headTargetEl
                    .insertAdjacentElement("beforeend", selfEl);
            })();
        headElTL[now] = headEl;
        //---------get body
        const bodyEl = htmlEl
            .getElementsByTagName("body")[0];
        //consoleTL[now] = "bodyEl";
        // consoleTL[now] = bodyEl;
        //copy body attribute
        Array.from(bodyEl.classList)
            .map((name) => bodyTargetEl.classList.add(name));
        const bodyChildlenEls = Array.prototype
            .slice.call(bodyEl.children);
        //consoleTL[now] = bodyChildlenEls;
        const bodyContentsEls = bodyChildlenEls
            .filter((el) => (el.tagName !== "SCRIPT"));
        //consoleTL[now] = "bodyContentsEls";
        //consoleTL[now] = bodyContentsEls;
        bodyTargetEl.innerHTML = "";
        bodyContentsEls.map((el) => bodyTargetEl
            .insertAdjacentElement("beforeend", el));
        //script hack -----
        /*
                const codeEls = Array.prototype
                  .slice.call(document
                    .getElementsByClassName("highlight"));
        
                codeEls.map((el: HTMLBodyElement) =>
                  hljs.initHighlighting(el)
                );
        
        */
        //target scroll---------
        consoleTL[now] = data.dir_name.dir;
        consoleTL[now] = data.dir_name.name;
        const line = ((line) => linesMappingTL[now]
            .reduce((acm, current) => (line >= current)
            ? current
            : acm))(data.line + 1);
        const className = (data.line < 10)
            ? "target"
            : "data-asciidocline" + line;
        const _targetElement = document
            .getElementsByClassName(className)[0];
        const targetElement = _targetElement == null
            ? {}
            : _targetElement;
        //error??
        targetElement.scrollIntoView();
        const offset = 150;
        ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) //touch the bottom
            ? undefined
            : sce.scrollTop = sce.scrollTop - offset;
        f(); //render done!
        return true;
    }
    catch (error) {
        console.log("!!! ERROR !!!");
        console.log(error);
        f(); //render done!
    }
};
export { render };