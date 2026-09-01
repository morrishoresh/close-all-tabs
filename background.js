browser.action.onClicked.addListener(async () => {
  const oldTabs = await browser.tabs.query({});
  const oldIds = oldTabs.map((t) => t.id);

  // Create the replacement tab first so the window never has zero tabs.
  await browser.tabs.create({ url: "about:blank" });

  if (oldIds.length > 0) {
    await browser.tabs.remove(oldIds);
  }
});
