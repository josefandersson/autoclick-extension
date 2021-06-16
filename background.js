const onClickCreateAutoclicker = (menuItem, tab) => {
	chrome.tabs.sendMessage(tab.id, 'getLastElement');
};

// ============
// Context menu
// ============
chrome.contextMenus.removeAll();
chrome.contextMenus.create({
	id: 'create-autoclicker-for-element',
	title: 'Create Autoclicker for element',
	contexts: ['all']
});
chrome.contextMenus.onClicked.addListener(onClickCreateAutoclicker);


// ===========================
// Coms with content and popup
// ===========================
let elementInfo, tabId;
chrome.extension.onMessage.addListener(async (request, sender, sendResponse) => {
	if (request.error) {
		console.warn('onMessage got error:', request, sender);
		return;
	}

	if (request.action === 'setElementInfo') {
		elementInfo = request.elementInfo;
		chrome.browserAction.setBadgeText({ tabId, text: null });
		tabId = sender.tab.id;
		chrome.browserAction.setBadgeText({ tabId, text: '1' });
	} else if (request.action === 'getElementInfo') {
		sendResponse(elementInfo);
		elementInfo = null;
		chrome.browserAction.setBadgeText({ tabId, text: null });
	}
});