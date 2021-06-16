let lastElement;
document.addEventListener('mousedown', ev => lastElement = ev.target);

chrome.runtime.onMessage.addListener(msg => {
	if (msg === 'getLastElement') {
		chrome.runtime.sendMessage(
			lastElement
				? { action: 'setElementInfo', elementInfo: composeElementInfo(lastElement) }
				: { error: 'lastElement is null' });
	} else {
		chrome.runtime.sendMessage({ error: 'unknown action' });
	}
});

function composeElementInfo(targetElement) {
	let path = [];

	const getBasic = element =>
		element != null
			? ({
				id: element.id,
				className: element.className,
				tagName: element.tagName,
				innerText: element.innerText,
				href: element.href,
				src: element.src,
			})
			: null;

	let currentElement = targetElement;
	do {
		path.push({
			...getBasic(currentElement),
			siblingCount: targetElement.parentElement.childElementCount,
			siblingIndex: [...targetElement.parentElement.children].indexOf(targetElement),
			siblingPrev: getBasic(currentElement.previousElementSibling),
			siblingNext: getBasic(currentElement.nextElementSibling),
			attributes: Object.fromEntries([...currentElement.attributes]
				.filter(x => x.name !== 'class')
				.map(x => [x.name, x.value]))
		});
	} while (currentElement = currentElement.parentElement);

	setTimeout(() => {
		alert('Open the Autoclicker extension popup window to create the Autoclicker action.');
	}, 1);

	return path;
}