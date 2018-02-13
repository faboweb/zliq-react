import React from 'react'
import ReactDOM from 'react-dom'
import {merge$, stream, isStream} from 'zliq'

export function render(vdom, parentElement, globals = {}, debounce = 10) {
    let vdom$ = vdom(globals)
	return vdom$.debounce(debounce).map(
		function renderUpdate(element) {
			if (!parentElement) {
				parentElement = document.createElement('div')
			}
			ReactDOM.render(element, parentElement)
			
			return {
				element: parentElement.childNodes[0]
			}
		})
}

export const h = (tag, props, ...children) => {
	let elementConstructor = (globals) => {
		let component;
		let version = -1;

		let constructedChildren = resolveChildren(children, globals)
		let mergedChildren$ = mergeChildren$(constructedChildren);
		// jsx usually resolves known tags as strings and unknown tags as functions
		// if it is a function it is treated as a component and will resolve it
		// props are not automatically resolved
		if (typeof tag === 'function') {
			let result = tag(
				props || {},
				mergedChildren$,
				globals
			)
            return resolveChildren(result, globals)
            .map(({tag, prop, children}) => React.createElement(tag, props, children))
		}
		return merge$([
			wrapProps$(props),
			mergedChildren$.map(flatten)
		]).map(([props, children]) => {
            return React.createElement(tag, props, children)
		});
	}
	elementConstructor.IS_ELEMENT_CONSTRUCTOR = true

	return elementConstructor
};

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform
* input: [stream]
* output: stream([])
*/
function mergeChildren$(children) {
	if (!Array.isArray(children)) {
		children = [children];
	}
	children = flatten(children)
	.filter(_ => _ !== null);
	let childrenVdom$arr = children.map(child => {
		if (isStream(child)) {
			return child
			.flatMap(mergeChildren$);
		}
		return child;
	})

	return merge$(childrenVdom$arr);
}

// flattens an array
export function flatten(array, mutable) {
    var toString = Object.prototype.toString;
    var arrayTypeStr = '[object Array]';
    
    var result = [];
    var nodes = (mutable && array) || array.slice();
    var node;

    if (!array.length) {
        return result;
    }

    node = nodes.pop();
    
    do {
        if (toString.call(node) === arrayTypeStr) {
            nodes.push.apply(nodes, node);
        } else {
            result.push(node);
        }
    } while (nodes.length && (node = nodes.pop()) !== undefined);

    result.reverse(); // we reverse result to restore the original order
    return result;
}

/*
* Wrap props into one stream
* input: {{}}
* output: stream({})
*/
function wrapProps$(props) {
	if (props === null) return stream({});

	let nestedStreams = extractNestedStreams(props);
	let updateStreams = nestedStreams.map(function makeNestedStreamUpdateProps({parent, key, stream}) {
		return stream
		.distinct()
		// here we produce a sideeffect on the props object -> low GC
		// to trigger the merge we also need to return sth (as undefined does not trigger listeners)
		.map(value => {
			parent[key] = value;
			return value; 
		})
	});
	return merge$(updateStreams).map(_ => props);
}

// to react to nested streams in an object, we extract the streams and a reference to their position
// returns [{parentObject, propertyName, stream}]
function extractNestedStreams(obj) {
	return flatten(Object.keys(obj).map(key => {
		// DEPRECATED I can't think of a usecase
		// if (typeof obj[key] === 'object') {
		// 	return extractNestedStreams(obj[key]);
		// }
		if (obj[key] === null || obj[key] === undefined) {
			return []
		}
		if (isStream(obj[key])) {
			return [{
				parent: obj,
				key,
				stream: obj[key]
			}];
		}
		if (typeof obj[key] === 'object') {
			return extractNestedStreams(obj[key])
		}
		return [];
	}))
}

/*
* children can be nested arrays, nested streams and element contstructors
* this function unifies them into the format [string|number|vdom|stream<string|number|vdom>]
*/
function resolveChildren (children, globals) {
	if (!Array.isArray(children)) {
		children = [].concat(children)
	}
	let resolvedChilden = children.map(child => {
		if (Array.isArray(child)) {
			return resolveChildren(child, globals)
		}
		return resolveChild(child, globals)
	})
	return flatten(resolvedChilden)
}

/*
* resolve the element constructor, also for elements nested in streams
* returns the format string|number|vdom|stream<string|number|vdom>
*/
function resolveChild(child, globals) {
	if (typeof child !== 'function') {
		return child
	}
	if (child.IS_ELEMENT_CONSTRUCTOR) {
		return child(globals)
	}
	if (isStream(child)) {
		return child.map(x => {
				return resolveChildren(x, globals)
			})
	}
}