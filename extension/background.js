const CSS = "nouislider.min.css";
const TITLE = "Filter Grades";
const APPLICABLE_PROTOCOLS = ["http:", "https:"];

const enableFilter = tab => {
	browser.tabs.insertCSS({ file: CSS });
	browser.tabs.sendMessage(tab.id, "filter");
};

const protocolIsApplicable = url => {
	var anchor = document.createElement("a");
	anchor.href = url;
	return APPLICABLE_PROTOCOLS.includes(anchor.protocol);
};

const initializePageAction = tab => {
	browser.tabs.sendMessage(tab.id, "darkTheme").then(res => {
		if (protocolIsApplicable(tab.url)) {
			browser.pageAction.setIcon({
				tabId: tab.id,
				path: `icons/${res.darkTheme ? "dark" : "light"}ThemeFilter.svg`
			});
			browser.pageAction.setTitle({ tabId: tab.id, title: TITLE });
			browser.pageAction.show(tab.id);
		}
	});
};

browser.tabs.query({}).then(tabs => {
	tabs.forEach(initializePageAction);
});

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {
	initializePageAction(tab);
});

browser.pageAction.onClicked.addListener(enableFilter);
